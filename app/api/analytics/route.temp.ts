import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Count total messages grouped by channel (SMS / WHATSAPP)
    const grouped = await prisma.message.groupBy({
      by: ["channel"],
      _count: { channel: true },
    });

    const stats = grouped.map((g) => ({
      channel: g.channel,
      count: g._count.channel,
    }));

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load analytics" },
      { status: 500 }
    );
  }
}
