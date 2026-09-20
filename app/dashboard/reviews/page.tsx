import { requireAuth } from "@/module/auth/utils/auth-utils";
import prisma from "@/lib/db";
import ReviewCard from "./review-card";
import { BookOpen } from "lucide-react";

export default async function ReviewsPage() {
  const session = await requireAuth();

  const reviews = await prisma.review.findMany({
    where: {
      repository: {
        userId: session.user.id,
      },
    },
    include: {
      repository: {
        select: {
          fullName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Pull Request Reviews</h1>
        <p className="text-muted-foreground max-w-2xl">
          View all the AI-generated reviews for your connected repositories.
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed bg-muted/20">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No reviews yet</h2>
          <p className="text-muted-foreground max-w-sm mb-6">
            When you open a Pull Request on one of your connected repositories, the AI review will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
