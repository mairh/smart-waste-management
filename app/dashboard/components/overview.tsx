"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

import { Device, Reading, AverageFullness } from "@/types/common";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Devices } from "./devices";
import { Charts } from "./charts";
import { Maps } from "./maps";
import { Alerts } from "./alerts";

export function Overview({
  devices,
  readings,
  averageFullness,
}: {
  devices: Device[];
  readings: { [key: string]: Reading[] };
  averageFullness: AverageFullness[];
}) {
  const [updatedDevices, setUpdatedDevices] = useState(devices);
  const [updatedReadings, setUpdatedReadings] = useState(readings);

  useEffect(() => {
    const fetchSupabaseClient = async () => {
      const supabase = await createClient();

      const fetchDevices = async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/devices`
        );
        const data = await response.json();
        setUpdatedDevices(data);
      };

      const fetchReadings = async () => {
        const readings: { [key: string]: Reading[] } = {};
        await Promise.all(
          updatedDevices.map(async (device) => {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/devices/${device.device_id}/readings`
            );
            const data = await response.json();
            readings[device.device_id] = data;
          })
        );
        setUpdatedReadings(readings);
      };

      const subscriptionDevices = supabase
        .channel("public:devices")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "devices" },
          () => {
            fetchDevices(); // Re-fetch devices data on any change
          }
        )
        .subscribe();

      const subscriptionReadings = supabase
        .channel("public:readings")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "readings" },
          () => {
            fetchReadings(); // Re-fetch readings data on any change
          }
        )
        .subscribe();

      // Clean up subscription on component unmount
      return () => {
        supabase.removeChannel(subscriptionDevices);
        supabase.removeChannel(subscriptionReadings);
      };
    };

    fetchSupabaseClient();
  }, [updatedDevices]);

  return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Devices
            devices={updatedDevices}
            readings={updatedReadings}
            averageFullness={averageFullness}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Device Locations</CardTitle>
              <CardDescription>
                Track the current device location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Maps devices={updatedDevices} />
            </CardContent>
          </Card>
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Alerts</CardTitle>
              <CardDescription>
                Alerts are shown when the capacity is above 80%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alerts devices={updatedDevices} readings={updatedReadings} />
            </CardContent>
          </Card>
          <Charts readings={updatedReadings} />
        </div>
      </div>
    </div>
  );
}
