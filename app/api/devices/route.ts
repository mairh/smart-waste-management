import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

/**
 * GET /api/devices
 * Returns a list of all devices in the database.
 *
 * Responds with a JSON object containing the devices data.
 *
 * @returns {NextResponse} A JSON response with the devices data.
 * @throws {NextResponse} A JSON response with an error message if the request fails, with a 500 status code.
 */
export async function GET(req: NextRequest) {
  try {
    const { data: devicesData, error: devicesError } = await supabase
      .from("devices")
      .select("*");

    if (devicesError) {
      console.error("Error fetching devices:", devicesError);
      return NextResponse.json(
        { error: `Error fetching devices: ${devicesError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(devicesData, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
