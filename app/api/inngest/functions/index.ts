import { inngest } from "@/inngest/client";

export const helloWorld = inngest.createFunction(
  { id: "code-horse" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Heljhblo ${event.data.email}!` };
  },
);