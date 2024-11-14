// Pages directory is created to run vercel cron job which is not yet supported in newer app directory
// Since we are using public broker the connection might be refused if you abuse the broker
// Working brokers are: mqtt://broker.hivemq.com and mqtt://test.mosquitto.org
import { VercelRequest, VercelResponse } from "@vercel/node";
import mqtt from "mqtt";
import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

const client = mqtt.connect("mqtt://test.mosquitto.org");
const supabase = createClient();

export interface Device {
  device_id: string;
  location_name: string;
  latitude: number;
  longitude: number;
}

async function createDevices(): Promise<void> {
  const devices: Device[] = [
    {
      device_id: "compactor_1",
      location_name: "Helsinki",
      latitude: 60.1695,
      longitude: 24.9354,
    },
    {
      device_id: "compactor_2",
      location_name: "Espoo",
      latitude: 60.2055,
      longitude: 24.6559,
    },
    {
      device_id: "compactor_3",
      location_name: "Tampere",
      latitude: 61.4978,
      longitude: 23.761,
    },
    {
      device_id: "compactor_4",
      location_name: "Oulu",
      latitude: 65.0121,
      longitude: 25.4651,
    },
  ];

  for (const device of devices) {
    await supabase.from("devices").upsert(device);
  }
}

function getRandomFullness(): number {
  return Math.floor(Math.random() * 101);
}

async function sendData(): Promise<void> {
  const { data: devices, error } = await supabase.from("devices").select("*");

  if (error) {
    console.error("Error fetching devices:", error);
    return;
  }

  if (!devices) {
    console.error("No devices found");
    return;
  }

  for (const device of devices) {
    const fullness = getRandomFullness();
    const timestamp = new Date().toISOString();

    // Publish data to MQTT broker
    client.publish(
      `trash/${device.device_id}`,
      JSON.stringify({ fullness, timestamp })
    );

    // Store data in Supabase
    const { error: insertError } = await supabase
      .from("readings")
      .insert([{ device_id: device.device_id, fullness_level: fullness, timestamp }]);

    if (insertError) {
      console.error("Error inserting reading:", insertError);
    }

    // Check for alert condition
    if (fullness > 80) {
      console.log(`Alert: ${device.device_id} is ${fullness}% full!`);
    }
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    client.on("connect", async () => {
      console.log("Connected to MQTT broker");
      await createDevices();
      await sendData();
      res.status(200).json({ message: "IoT simulation executed successfully" });
    });

    client.on("error", (err) => {
      console.error("MQTT connection error:", err);
      res.status(500).json({ error: "MQTT connection error" });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Unexpected error occurred" });
  }
}
