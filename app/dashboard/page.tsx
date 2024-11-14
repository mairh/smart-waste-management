import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Device, Reading, AverageFullness } from "@/types/common";
import { Overview } from "./components/overview";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Smart Waste Management System",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const fetchDevices = async (): Promise<Device[]> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/devices`
    );
    return response.json();
  };

  const fetchReadings = async (deviceId: string): Promise<Reading[]> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/devices/${deviceId}/readings`
    );
    return response.json();
  };

  const fetchAverageFullness = async (): Promise<AverageFullness[]> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/readings/average`
    );
    return response.json();
  };

  const devices = await fetchDevices();
  const readings: { [key: string]: Reading[] } = {};
  await Promise.all(
    devices.map(async (device) => {
      const deviceReadings = await fetchReadings(device.device_id);
      if (deviceReadings) {
        readings[device.device_id] = deviceReadings;
      }
    })
  );
  const averageFullness = await fetchAverageFullness();

  return (
    <Overview
      devices={devices}
      readings={readings}
      averageFullness={averageFullness}
    />
  );
}
