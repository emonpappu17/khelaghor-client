import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-secondary">
          404 error
        </p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          The page you’re looking for doesn’t exist or has been moved. Check the URL
          or head back to the homepage.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button className="px-6 py-3" variant="default" size="lg">
              Back to Home
            </Button>
          </Link>
          <Link href="/">
            <Button className="px-6 py-3" variant="outline" size="lg">
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
