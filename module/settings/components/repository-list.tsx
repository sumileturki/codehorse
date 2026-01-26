"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getConnectedRep,
  disconnetRepo,
  disconnectAllRepos,
} from "@/module/settings/actions";

import { toast } from "sonner";

import {
  ExternalLink,
  Trash2,
  AlertTriangle,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useState } from "react";
import { RepositoryListSkeleton } from "./RepositoryListSkeleton";

export function RepositoryList() {
  const queryClient = useQueryClient();

  const [disconnectAllOpen, setDisconnectAllOpen] =
    useState(false);

  /* Fetch repositories */
  const { data: repositories = [], isLoading } = useQuery({
    queryKey: ["connected-repositories"],
    queryFn: getConnectedRep,
  });

  /* Disconnect single repo */
  const disconnectRepoMutation = useMutation({
    mutationFn: (repoId: string) => disconnetRepo(repoId),
    onSuccess: () => {
      toast.success("Repository disconnected");
      queryClient.invalidateQueries({
        queryKey: ["connected-repositories"],
      });
    },
    onError: () => {
      toast.error("Failed to disconnect repository");
    },
  });

  /* Disconnect all repos */
  const disconnectAllMutation = useMutation({
    mutationFn: disconnectAllRepos,
    onSuccess: () => {
      toast.success("All repositories disconnected");
      queryClient.invalidateQueries({
        queryKey: ["connected-repositories"],
      });
      setDisconnectAllOpen(false);
    },
    onError: () => {
      toast.error("Failed to disconnect repositories");
    },
  });

  if (isLoading) {
  return <RepositoryListSkeleton count={3} />;
}


  if (repositories.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No connected repositories
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Disconnect All */}
      <div className="flex justify-end">
        <AlertDialog
          open={disconnectAllOpen}
          onOpenChange={setDisconnectAllOpen}
        >
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              Disconnect All
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Disconnect all repositories?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This will remove all connected repositories and
                delete their GitHub webhooks. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  disconnectAllMutation.mutate()
                }
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Disconnect All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Repository cards */}
      {repositories.map((repo) => (
        <Card key={repo.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base">
                {repo.fullName}
              </CardTitle>

              <div className="flex gap-2 items-center">
                <Badge variant="secondary">Connected</Badge>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" size="icon" asChild>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>

              <Button
                variant="destructive"
                size="icon"
                onClick={() =>
                  disconnectRepoMutation.mutate(repo.id)
                }
                disabled={
                  disconnectRepoMutation.isPending
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="text-sm text-muted-foreground">
            Connected on{" "}
            {new Date(repo.createAt).toLocaleDateString()}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
