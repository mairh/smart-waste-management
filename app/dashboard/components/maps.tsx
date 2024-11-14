"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Device } from "@/types/common";

const Map = dynamic(() => import("@/components/map"), {
  ssr: false,
});

interface MapsProps {
  devices: Device[];
}

export function Maps({ devices }: MapsProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        {devices.length === 0 ? (
          <Skeleton className="h-96 w-full" />
        ) : (
          <Map devices={devices} />
        )}
      </div>
    </div>
  );
}
