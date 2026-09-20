"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatDistanceToNow } from "date-fns";
import { Github } from "lucide-react";
import Link from "next/link";

interface ReviewProps {
  review: {
    id: string;
    prNumber: number;
    prTitle: string;
    prUrl: string;
    review: string;
    status: string;
    createdAt: Date;
    repository: {
      fullName: string;
    };
  };
}

export default function ReviewCard({ review }: ReviewProps) {
  const isCompleted = review.status === "completed";

  return (
    <Card className="hover:shadow-lg transition-all border-border/50 overflow-hidden flex flex-col h-full bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3 border-b border-border/10 bg-muted/20">
        <div className="flex justify-between items-start gap-4">
          <div>
            <Badge variant="outline" className="mb-2 bg-background/50">
              {review.repository.fullName}
            </Badge>
            <CardTitle className="text-lg leading-tight line-clamp-2">
              <Link href={review.prUrl} target="_blank" className="hover:underline flex items-center gap-2">
                {review.prTitle} <Github className="h-4 w-4 text-muted-foreground" />
              </Link>
            </CardTitle>
          </div>
          <Badge
            variant={isCompleted ? "default" : "secondary"}
            className={isCompleted ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : ""}
          >
            {review.status}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          PR #{review.prNumber} • {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
        </p>
      </CardHeader>

      <CardContent className="pt-4 flex-grow">
        <div className="text-sm text-muted-foreground line-clamp-3 prose dark:prose-invert">
          {review.review.substring(0, 150)}...
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full" disabled={!isCompleted}>
              {isCompleted ? "Read Full Review" : "Processing..."}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl mb-2">Review for PR #{review.prNumber}</DialogTitle>
              <div className="flex gap-2">
                 <Badge variant="outline">{review.repository.fullName}</Badge>
              </div>
            </DialogHeader>
            <div className="mt-4 prose prose-sm md:prose-base dark:prose-invert prose-pre:bg-muted/50 max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {review.review}
              </ReactMarkdown>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
