import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { requireAuth } from "@/module/auth/utils/auth-utils";

export default async function SubscriptionPage() {
  await requireAuth();

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4">
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          Supercharge your Code Reviews
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose the plan that best fits your workflow. Automate your GitHub pull requests with state-of-the-art AI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* FREE PLAN */}
        <Card className="relative flex flex-col border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Hobby</CardTitle>
            <CardDescription>Perfect for exploring CodeHorse</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="mb-6">
              <span className="text-5xl font-extrabold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                <span>Up to 5 repositories</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                <span>5 AI reviews per repository</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                <span>Basic code context (RAG)</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                <span>Community support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">
              Current Plan
            </Button>
          </CardFooter>
        </Card>

        {/* PRO PLAN */}
        <Card className="relative flex flex-col border-primary/50 shadow-lg shadow-primary/10 overflow-hidden transform md:-translate-y-4">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-primary/50" />
          <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">Recommended</Badge>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Pro</CardTitle>
            <CardDescription>For serious developers & teams</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="mb-6">
              <span className="text-5xl font-extrabold">$15</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-foreground font-medium">
                <Check className="h-4 w-4 text-primary" />
                <span>Unlimited repositories</span>
              </li>
              <li className="flex items-center gap-3 text-foreground font-medium">
                <Check className="h-4 w-4 text-primary" />
                <span>Unlimited AI reviews</span>
              </li>
              <li className="flex items-center gap-3 text-foreground font-medium">
                <Check className="h-4 w-4 text-primary" />
                <span>Deep codebase indexing</span>
              </li>
              <li className="flex items-center gap-3 text-foreground font-medium">
                <Check className="h-4 w-4 text-primary" />
                <span>Priority queue processing</span>
              </li>
              <li className="flex items-center gap-3 text-foreground font-medium">
                <Check className="h-4 w-4 text-primary" />
                <span>Premium email support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-md transition-all">
              Upgrade to Pro
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
