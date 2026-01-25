"use server";

import { headers } from "next/headers";
import { Octokit } from "octokit";
import { auth } from "@/lib/auth";
import {
  getGithubToken,
  fetchUserContribution,
} from "@/module/github/lib/github";



export async function getDashboardStats() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });

    const { data: user } = await octokit.rest.users.getAuthenticated();

    // TODO: real repo count
    const totalRepos = 30;

    const calendar = await fetchUserContribution(token, user.login);
    const totalCommits = calendar?.totalContributions ?? 0;

    const { data: prs } =
      await octokit.rest.search.issuesAndPullRequests({
        q: `author:${user.login} type:pr`,
        per_page: 1,
      });

    const totalPRs = prs.total_count;

    // TODO: real reviews from DB
    const totalReviews = 44;

    return {
      totalCommits,
      totalPRs,
      totalRepos,
      totalReviews,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);

    return {
      totalCommits: 0,
      totalPRs: 0,
      totalRepos: 0,
      totalReviews: 0,
    };
  }
}

/* ================================
   Monthly Activity
================================ */

export async function getMonthlyActivity() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });

    const { data: user } = await octokit.rest.users.getAuthenticated();

    const calendar = await fetchUserContribution(token, user.login);
    if (!calendar) return [];

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyData: Record<
      string,
      { commits: number; prs: number; reviews: number }
    > = {};

    // Initialize last 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = monthNames[date.getMonth()];
      monthlyData[key] = { commits: 0, prs: 0, reviews: 0 };
    }

    // Commits
    calendar.weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        const date = new Date(day.date);
        const key = monthNames[date.getMonth()];
        if (monthlyData[key]) {
          monthlyData[key].commits += day.contributionCount;
        }
      });
    });

    // Reviews (TEMP sample data)
    const generateSampleReviews = () => {
      const now = new Date();
      return Array.from({ length: 45 }, () => {
        const daysAgo = Math.floor(Math.random() * 180);
        const d = new Date(now);
        d.setDate(d.getDate() - daysAgo);
        return { createdAt: d };
      });
    };

    const reviews = generateSampleReviews();
    reviews.forEach((review) => {
      const key = monthNames[review.createdAt.getMonth()];
      if (monthlyData[key]) {
        monthlyData[key].reviews += 1;
      }
    });

    // PRs (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: prs } =
      await octokit.rest.search.issuesAndPullRequests({
        q: `author:${user.login} type:pr created:>${
          sixMonthsAgo.toISOString().split("T")[0]
        }`,
        per_page: 100,
      });

    // NOTE: GitHub search does not give per-month breakdown directly
    // (needs pagination + parsing created_at if you want exact data)

    return Object.keys(monthlyData).map((name) => ({
      name,
      ...monthlyData[name],
    }));
  } catch (error) {
    console.error("Error fetching monthly activity:", error);
    return [];
  }
}
