import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import logoColor from "@/assets/logos/logo-color.png";
import logoTextColor from "@/assets/logos/logo-text-color.png";
import textColor from "@/assets/logos/text-color.png";
import background from "@/assets/images/pexels-glassesshop-gs-1317359316-26050120.jpg";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="flex flex-col">
        <main className="min-h-[100dvh] flex flex-col bg-background text-foreground relative">
          <header className="w-full border-b z-0 bg-white">
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
          <section
            className="w-full flex flex-1 items-center bg-white/80"
            style={{
              backgroundImage: `url(${background})`,
              backgroundSize: "cover",
              backgroundBlendMode: "overlay",
            }}
          >
            <div className="mx-auto h-full max-w-3xl items-center px-4 text-center flex flex-col">
              <img
                src={logoTextColor}
                className="w-48"
                style={{ filter: "drop-shadow(0 0 1.2rem rgba(0,0,210,0.28))" }}
              />
              <h1 className="text-3xl font-semibold">
                Solution for eyeglasses inventory with efficient, seamless RFID
                integration
              </h1>
              <p className="mt-2 text-pretty text-muted-foreground">
                Track frames in real time and audit stock in minutes.
              </p>
              <p className="text-pretty text-muted-foreground">
                Simple, accurate, RFID‑ready from day one.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
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
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
