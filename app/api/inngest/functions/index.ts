import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { indexCodeBase } from "@/module/ai/lib/rag";
import { getRepoFileContents } from "@/module/github/lib/github";
import { step } from "inngest";
import { success } from "zod";

export const helloWorld = inngest.createFunction(
  { id: "code-horse", triggers: [{ event: "test/hello.world" }] },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Heljhblo ${event.data.email}!` };
  },
);

export const indexRepo = inngest.createFunction({
  id: "index-repo",
  triggers: [{ event: "repository.connected" }]
},
async ({event,step})=>{
  const {owner, repo, userId} = event.data
  // fetch all the files

  const files =  await step.run("fetch-files",async ()=>{
    const account = await prisma.account.findFirst({
      where:{
        userId:userId,
        providerId: "github"
      }
    })

    if(!account?.accessToken){
      throw new Error("No github acces token found")
    }

    return await getRepoFileContents(account.accessToken, owner, repo)

  })

  await step.run("index-codebase", async()=>{
    await indexCodeBase(`${owner}/${repo}`, files)
  })

  return { success:true, indexedFiles: files.length}

}
)