// app/api/readings/average/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

/**
 * GET /api/readings/average
 * Calculates the average fullness for each device in the database, based on the
 * readings from the current day.
 *
 * @returns {NextResponse} A JSON response containing the average fullness for
 * each device, with a 200 status code. Returns a JSON response with an error
 * message if there is an error calculating the average fullness, with a 500
 * status code.
 */
export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase.rpc("get_daily_average_fullness");

    if (error) {
      console.error("Error calculating daily average fullness:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
