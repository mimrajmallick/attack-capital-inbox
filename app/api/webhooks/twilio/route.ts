// app/api/webhooks/twilio/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Webhook to receive inbound SMS/WhatsApp from Twilio.
 */
export async function POST(req: Request) {
  const form = await req.formData();
  const from = form.get("From")?.toString();
  const body = form.get("Body")?.toString();
  const channel = from?.includes("whatsapp") ? "WHATSAPP" : "SMS";

  if (!from || !body)
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  await prisma.message.create({
    data: {
      content: body,
      channel,
      direction: "INBOUND",
      status: "delivered",
      contact: {
        connectOrCreate: {
          where: { phone: from },
          create: { phone: from },
        },
      },
    },
  });

  return new NextResponse("<Response></Response>", {
    headers: { "Content-Type": "text/xml" },
  });
}
