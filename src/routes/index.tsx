import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="flex flex-col mx-5">
        <main className="min-h-[100dvh] bg-background text-foreground">
          <header className="w-full border-b border-border">
            <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  aria-hidden
                  className="size-8 rounded-md bg-primary/10 flex items-center justify-center"
                >
                  <span className="text-sm font-semibold text-primary">LZ</span>
                </div>
                <span className="font-semibold tracking-tight">{"LeNS'Z"}</span>
              </div>
            </div>
          </header>

          <section className="mx-auto max-w-3xl px-4 py-16 md:py-24 text-center">
            <h1
            >
              {"LeNS'Z"} — A solution for eyeglasses inventory with efficient,
              seamless RFID integration
            </h1>
            <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
              Track frames in real time and audit stock in minutes — simple,
              accurate, RFID‑ready from day one.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <a href="/register" aria-label="Register for LeNS'Z">
                  Register
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-transparent"
              >
                <a href="/sign-in" aria-label="Sign in to LeNS'Z">
                  Sign in
                </a>
              </Button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              No clutter. Just the essentials for RFID-powered inventory.
            </p>
          </section>
        </main>
      </div>
    </>
  );
}
