"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reading } from "@/types/common";

const Rechart = dynamic(() => import("@/components/rechart"), {
  ssr: false,
});

interface ChartsProps {
  readings: { [key: string]: Reading[] };
}

export function Charts({ readings }: ChartsProps) {
  return (
    <>
      {Object.keys(readings).map((deviceId) => (
        <Card className="col-span-4" key={deviceId}>
          <CardHeader>
            <CardTitle>{deviceId}</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Rechart
              key={deviceId}
              deviceId={deviceId}
              readings={readings[deviceId]}
            />
          </CardContent>
        </Card>
      ))}
    </>
  );
}
