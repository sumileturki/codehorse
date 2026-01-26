import { Octokit } from "octokit";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";

/* ================================
   GitHub Token
================================ */

export const getGithubToken = async (): Promise<string> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const account = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "github",
    },
  });

  if (!account || !account.accessToken) {
    throw new Error("No GitHub access token found");
  }

  return account.accessToken;
};

/* ================================
   Contribution Types
================================ */

interface ContributionDay {
  contributionCount: number;
  date: string; // ISO string from GitHub
  color: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

interface ContributionData {
  user: {
    contributionsCollection: {
      contributionCalendar: ContributionCalendar;
    };
  };
}

/* ================================
   Fetch Contributions
================================ */

export async function fetchUserContribution(
  token: string,
  username: string
): Promise<ContributionCalendar | null> {
  const octokit = new Octokit({ auth: token });

  const query = `
    query ($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await octokit.graphql<ContributionData>(query, {
      username,
    });

    return response.user.contributionsCollection.contributionCalendar;
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error);
    return null;
  }
}


export const getRepositories = async(page:number=1, perPage=10)=>{
  const token = await getGithubToken();
  const octokit = new Octokit({auth:token});

  const {data} = await octokit.rest.repos.listForAuthenticatedUser({
    sort:"updated",
    direction:"desc",
    visibility: "all",
    per_page:perPage,
    page:page
  })
  return data;
}


export const createWebhook = async(owner: string, repo: string)=>{
  const token = await getGithubToken();
  const octokit = new Octokit({auth:token});

  const webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/github`

  const {data: hooks} = await octokit.rest.repos.listWebhooks({
    owner,
    repo
  })

  const existinghook = hooks.find(hook=>hook.config.url ===webhookUrl);
  if(existinghook){
    return existinghook
  }

  const {data} = await octokit.rest.repos.createWebhook({
    owner,
    repo,
    config:{
      url:webhookUrl,
      content_type:"json"
    },
    events:["pull_request"]
  })

  return data;

}
export const deleteWebhook = async(owner: string, repo: string)=>{
  const token = await getGithubToken();
  const octokit = new Octokit({auth:token});

  const webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/github`

  try {
    const {data:hooks} = await octokit.rest.repos.listWebhooks({
    owner,
    repo,
  })

  const hookDelete = hooks.find(hook => hook.config.url === webhookUrl)


  if(hookDelete){
    await octokit.rest.repos.deleteWebhook({
      owner,
      repo,
      hook_id: hookDelete.id
    })
    return true
  }

  return false

  } catch (error) {
    
    console.error("Failed to delete webhook:", error);
    return false;
  }

}