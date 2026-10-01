import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Ticket detail by slug. Login required — farmers only ever see their own. */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const user = await getOrCreateCurrentUser(
      searchParams.get("email") || undefined
    );
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }
    const ticket = await prisma.supportTicket.findUnique({ where: { slug } });
    // 404 either way — never confirm another farmer's ticket exists.
    if (!ticket || ticket.userId !== user.id) {
      return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, ticket });
  } catch (error: any) {
    console.error("Error loading support ticket:", error);
    return NextResponse.json(
      { error: "Could not load the ticket." },
      { status: 500 }
    );
  }
}
