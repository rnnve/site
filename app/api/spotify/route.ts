import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const response = await fetch("https://spotify.maplenan.org/api/spotify", {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; site-v2/1.0)",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch from API" },
      { status: 500 }
    );
  }
}