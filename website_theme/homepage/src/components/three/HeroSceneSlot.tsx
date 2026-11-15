import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";

const HeroScene = lazy(() => import("./HeroScene"));

function Fallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="size-56 animate-pulse rounded-full bg-sky-soft shadow-lift" />
    </div>
  );
}

export function HeroSceneSlot() {
  return (
    <ClientOnly fallback={<Fallback />}>
      <Suspense fallback={<Fallback />}>
        <HeroScene />
      </Suspense>
    </ClientOnly>
  );
}
