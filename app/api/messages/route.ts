// app/api/messages/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMessage } from "@/lib/integrations/twilio";

export async function POST(req: Request) {
  const { to, content } = await req.json();

  if (!to || !content)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  // save outgoing message in DB
  const msg = await prisma.message.create({
    data: {
      content,
      channel: to.includes("whatsapp") ? "WHATSAPP" : "SMS",
      direction: "OUTBOUND",
      contact: {
        connectOrCreate: {
          where: { phone: to },
          create: { phone: to },
        },
      },
    },
  });

  try {
    await sendMessage(to, content);
    await prisma.message.update({
      where: { id: msg.id },
      data: { status: "delivered" },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Twilio send error:", e);
    await prisma.message.update({
      where: { id: msg.id },
      data: { status: "failed" },
    });
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
