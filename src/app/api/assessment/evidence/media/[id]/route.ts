import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Delete one uploaded media file. Only the owning farmer, via ?email=. */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const user = await getOrCreateCurrentUser(
      searchParams.get("email") || undefined
    );
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }
    const media = await prisma.ffvMedia.findUnique({
      where: { id },
      include: { evidence: { include: { assessment: true } } },
    });
    if (!media || media.evidence.assessment.userId !== user.id) {
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }
    // A verification must always keep at least one file on record.
    const total = await prisma.ffvMedia.count({
      where: { evidenceId: media.evidenceId },
    });
    if (total <= 1) {
      return NextResponse.json(
        { error: "Each verification must keep at least one file. Upload a replacement first, then remove this one." },
        { status: 400 }
      );
    }
    await prisma.ffvMedia.delete({ where: { id } });
    const remaining = await prisma.ffvMedia.count({
      where: { evidenceId: media.evidenceId },
    });
    return NextResponse.json({ success: true, remaining });
  } catch (error: any) {
    console.error("Error deleting FFV media:", error);
    return NextResponse.json(
      { error: "Could not delete the file." },
      { status: 500 }
    );
  }
}
