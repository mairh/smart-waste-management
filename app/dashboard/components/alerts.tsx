"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Device, Reading, AlertDevice } from "@/types/common";

interface AlertsProps {
  devices: Device[];
  readings: { [key: string]: Reading[] };
}

// Helper function to get the shortened device ID
const getShortenedDeviceId = (deviceId: string) => {
  const parts = deviceId.split("_");
  return `${parts[0].charAt(0).toUpperCase()}${parts[1]}`;
};

export function Alerts({ devices, readings }: AlertsProps) {
  const alerts = devices
    .map((device) => {
      const latestReading = readings[device.device_id]?.[0];
      if (latestReading && latestReading.fullness_level > 80) {
        return { ...device, fullness_level: latestReading.fullness_level };
      }
      return null;
    })
    .filter(Boolean) as AlertDevice[];

  const renderAlertCard = (alert: AlertDevice) => (
    <div key={alert.device_id} className="flex items-center space-x-4">
      <Avatar>
        <AvatarFallback>{getShortenedDeviceId(alert.device_id)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium">{alert.location_name}</p>
        <p className="text-xs text-muted-foreground">
          Fullness Level: {alert.fullness_level}%
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {alerts.length === 0 ? (
        <div className="mb-4">
          <div>
            <p className="font-bold">No Alerts</p>
          </div>
        </div>
      ) : (
        alerts.map(renderAlertCard)
      )}
    </div>
  );
}
