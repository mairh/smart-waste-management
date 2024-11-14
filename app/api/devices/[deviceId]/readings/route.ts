import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

/**
 * GET /api/devices/[deviceId]/readings
 * Retrieves the latest 30 readings for a specified device from the database.
 *
 * @param {NextRequest} req - The incoming request object, which should contain a query parameter 'deviceId'.
 * @returns {NextResponse} A JSON response containing the device readings with a 200 status code.
 * Returns a JSON response with an error message if the 'deviceId' is missing with a 400 status code,
 * or if there is an error fetching the readings with a 500 status code.
 */

export async function GET(req: NextRequest) {
  try {
    const { pathname } = new URL(req.url);
    const deviceId = pathname.split("/").slice(-2, -1)[0];

    if (!deviceId) {
      console.error("Device ID is missing in the request"); // Add logging
      return NextResponse.json(
        { error: "Device ID is required" },
        { status: 400 }
      );
    }

    const { data: readings, error: readingsError } = await supabase
      .from("readings")
      .select("*")
      .eq("device_id", deviceId)
      .order("timestamp", { ascending: false })
      .limit(30);

    if (readingsError) {
      console.error(
        `Error fetching readings for device ${deviceId}:`,
        readingsError
      );
      return NextResponse.json(
        {
          error: `Error fetching readings for device ${deviceId}: ${readingsError.message}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(readings, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
