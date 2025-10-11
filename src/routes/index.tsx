import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import logoColor from "@/assets/logos/logo-color.png";
import textColor from "@/assets/logos/text-color.png";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="flex flex-col mx-5">
        <main className="min-h-[100dvh] bg-background text-foreground relative">
          <header className="w-full border-b z-0 absolute">
            <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  aria-hidden
                  className="size-8 flex items-center justify-center"
                >
                  <img src={logoColor} />
                </div>
                <img className="w-[20%]" src={textColor} />
              </div>
            </div>
          </header>
          <section className="min-h-[100dvh] w-full flex items-center">
            <div className="mx-auto h-full max-w-3xl px-4 text-center">
              <h1 className="text-3xl font-semibold md:text-5xl">
                {"LeNS'Z"} — A solution for eyeglasses inventory with efficient,
                seamless RFID integration
              </h1>
              <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
                Track frames in real time and audit stock in minutes — simple,
                accurate, RFID‑ready from day one.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <a href="/login" aria-label="Sign in to LeNS'Z">
                    Login
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-transparent"
                >
                  <a href="/register" aria-label="Register for LeNS'Z">
                    Register
                  </a>
                </Button>
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                No clutter. Just the essentials for RFID-powered inventory.
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
