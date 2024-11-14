// Since we are using public broker the connection might be refused if you abuse the broker
// Working brokers are: mqtt://broker.hivemq.com and mqtt://test.mosquitto.org
import mqtt from "mqtt";
import { createClient } from "@/utils/supabase/client";
import { Device } from "@/types/common";

const client = mqtt.connect("mqtt://test.mosquitto.org");
const supabase = createClient();

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
  const { data: devices } = await supabase.from("devices").select("*");

  if (!devices) {
    console.error("No devices found");
    return;
  }

  devices.forEach(async (device: Device) => {
    const fullness = getRandomFullness();
    const timestamp = new Date().toISOString();

    // Publish data to MQTT broker
    client.publish(
      `trash/${device.device_id}`,
      JSON.stringify({ fullness, timestamp })
    );

    // Store data in Supabase
    await supabase
      .from("readings")
      .insert([
        { device_id: device.device_id, fullness_level: fullness, timestamp },
      ]);

    // Check for alert condition
    if (fullness > 80) {
      console.log(`Alert: ${device.device_id} is ${fullness}% full!`);
    }
  });
}

client.on("connect", async () => {
  console.log("Connected to MQTT broker");
  await createDevices();
  setInterval(sendData, 5 * 1000); // Send data every 5 seconds
});

client.on("error", (err) => {
  console.error("MQTT connection error:", err);
});
