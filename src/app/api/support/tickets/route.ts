import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";
import { sendMail, appBaseUrl } from "@/lib/mailer";
import { supportTicketEmail } from "@/lib/emailTemplates";
import {
  TICKET_CATEGORIES,
  TICKET_STATUSES,
  newTicketSlug,
  newTicketNumber,
} from "@/lib/supportTickets";

export const dynamic = "force-dynamic";

const VALID_STATUSES: Set<string> = new Set(TICKET_STATUSES.map((s) => s.value));

/** List my tickets, newest first. Filters: ?status=&category=&q= */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user = await getOrCreateCurrentUser(
      searchParams.get("email") || undefined
    );
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }
    const status = searchParams.get("status") || "";
    const category = searchParams.get("category") || "";
    const q = (searchParams.get("q") || "").trim();
    const tickets = await prisma.supportTicket.findMany({
      where: {
        userId: user.id,
        ...(status && VALID_STATUSES.has(status) ? { status } : {}),
        ...(category &&
        (TICKET_CATEGORIES as readonly string[]).includes(category)
          ? { category }
          : {}),
        ...(q
          ? {
              OR: [
                { subject: { contains: q, mode: "insensitive" } },
                { ticketNumber: { contains: q, mode: "insensitive" } },
                { message: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ success: true, tickets });
  } catch (error: any) {
    console.error("Error listing support tickets:", error);
    return NextResponse.json(
      { error: "Could not load tickets." },
      { status: 500 }
    );
  }
}

/** Open a ticket. Emails the client their ticket number + tracking link. */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await getOrCreateCurrentUser(
      String(body.email || "").trim() || undefined
    );
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }
    const category = String(body.category || "").trim();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();
    if (!(TICKET_CATEGORIES as readonly string[]).includes(category)) {
      return NextResponse.json(
        { error: "Please choose a department." },
        { status: 400 }
      );
    }
    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required." },
        { status: 400 }
      );
    }
    if (subject.length > 140 || message.length > 5000) {
      return NextResponse.json(
        { error: "Subject (140) or message (5000 chars) too long." },
        { status: 400 }
      );
    }

    // Unique ticket number with a bounded retry (no sequential counter races).
    let ticket: Awaited<ReturnType<typeof prisma.supportTicket.create>> | null =
      null;
    for (let attempt = 0; attempt < 5 && !ticket; attempt += 1) {
      try {
        ticket = await prisma.supportTicket.create({
          data: {
            ticketNumber: newTicketNumber(),
            slug: newTicketSlug(),
            userId: user.id,
            category,
            subject,
            message,
          },
        });
      } catch (e: any) {
        if (String(e?.code) !== "P2002") throw e;
      }
    }
    if (!ticket) {
      return NextResponse.json(
        { error: "Could not issue a ticket number, please try again." },
        { status: 500 }
      );
    }

    const trackingLink = `${appBaseUrl()}/support/tickets/${ticket.slug}`;
    try {
      const mail = supportTicketEmail({
        name: user.name || undefined,
        ticketNumber: ticket.ticketNumber,
        category: ticket.category,
        subject: ticket.subject,
        trackingLink,
      });
      await sendMail({ to: user.email, subject: mail.subject, text: mail.text, html: mail.html });
    } catch (e) {
      console.error("Ticket email failed (ticket kept):", e);
    }

    return NextResponse.json(
      { success: true, ticket, trackingLink },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating support ticket:", error);
    return NextResponse.json(
      { error: "Could not submit your ticket." },
      { status: 500 }
    );
  }
}
