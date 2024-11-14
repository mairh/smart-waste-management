"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Device, Reading, AverageFullness } from "@/types/common";

interface DevicesProps {
  devices: Device[];
  readings: { [key: string]: Reading[] };
  averageFullness: AverageFullness[];
}

export function Devices({ devices, readings, averageFullness }: DevicesProps) {
  const renderDeviceCard = (device: Device) => {
    const latestReading = readings[device.device_id]?.[0];
    const average =
      averageFullness
        .find((avg) => avg.device_id === device.device_id)
        ?.average_fullness?.toFixed(2) ?? null;
    return (
      <Card key={device.device_id}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {device.location_name}
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{device.device_id}</div>
          <p className="text-xs text-muted-foreground my-2">
            Current Fullness Level: {latestReading?.fullness_level}%
          </p>
          <p className="text-xs text-muted-foreground my-2">
            Daily Avg Fullness Level: {average}%
          </p>
        </CardContent>
      </Card>
    );
  };

  const renderSkeletonCard = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );

  return (
    <>
      {devices.length === 0
        ? Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="mb-4">
              {renderSkeletonCard()}
            </div>
          ))
        : devices.map(renderDeviceCard)}
    </>
  );
}
