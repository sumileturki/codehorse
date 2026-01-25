"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  GitCommit,
  GitPullRequest,
  MessageSquare,
  GitBranch,
} from "lucide-react";

import { ModeToggle } from "@/components/ui/modeToggle";
import { getDashboardStats, getMonthlyActivity } from "@/module/dashboard/action";

/* ================================
   Main Dashboard Page
================================ */

const MainPage = () => {
  /* -------- Dashboard Stats -------- */
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  /* -------- Monthly Activity -------- */
  const { data: monthlyData, isLoading: chartLoading } = useQuery({
    queryKey: ["monthly-activity"],
    queryFn: getMonthlyActivity,
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">GitHub Dashboard</h1>
        <ModeToggle />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Commits"
          value={stats?.totalCommits}
          icon={<GitCommit className="h-5 w-5" />}
          loading={statsLoading}
        />

        <StatCard
          title="Pull Requests"
          value={stats?.totalPRs}
          icon={<GitPullRequest className="h-5 w-5" />}
          loading={statsLoading}
        />

        <StatCard
          title="Reviews"
          value={stats?.totalReviews}
          icon={<MessageSquare className="h-5 w-5" />}
          loading={statsLoading}
        />

        <StatCard
          title="Repositories"
          value={stats?.totalRepos}
          icon={<GitBranch className="h-5 w-5" />}
          loading={statsLoading}
        />
      </div>

      {/* Monthly Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Activity</CardTitle>
          <CardDescription>Last 6 months GitHub activity</CardDescription>
        </CardHeader>

        <CardContent className="h-[320px]">
          {chartLoading ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Loading chart...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="commits" name="Commits" />
                <Bar dataKey="prs" name="PRs" />
                <Bar dataKey="reviews" name="Reviews" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MainPage;

/* ================================
   Reusable Stat Card
================================ */

function StatCard({
  title,
  value,
  icon,
  loading,
}: {
  title: string;
  value?: number;
  icon: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? "—" : value ?? 0}
        </div>
      </CardContent>
    </Card>
  );
}
