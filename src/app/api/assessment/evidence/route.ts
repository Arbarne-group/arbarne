import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";
import assessmentData from "@/data/assessmentData.json";

export const dynamic = "force-dynamic";

export const MAX_MEDIA_PER_QUESTION = 5;

// Criteria configuration
const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
];

const IMAGE_MIMES = ["image/png", "image/jpeg", "image/jpg"];
const DOCUMENT_MIMES = ["application/pdf"];

const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".pdf"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

type IncomingFile = {
  fileName?: string;
  fileType?: string;
  fileSize?: number | string;
  fileData?: string;
};

function questionFlags(questionId: string): {
  requiresVerification: boolean;
  allowedEvidenceTypes: string[];
} {
  const q: any = (assessmentData.questions as any[]).find(
    (item) => item.id === questionId
  );
  if (!q) return { requiresVerification: false, allowedEvidenceTypes: [] };
  const allowed = Array.isArray(q.allowedEvidenceTypes)
    ? q.allowedEvidenceTypes.map(String)
    : ["image", "document"];
  return {
    requiresVerification: q.requiresVerification !== false,
    allowedEvidenceTypes: allowed,
  };
}

function fileKind(fileType: string): "image" | "document" | null {
  const t = fileType.toLowerCase();
  if (IMAGE_MIMES.includes(t)) return "image";
  if (DOCUMENT_MIMES.includes(t)) return "document";
  return null;
}

function validateFile(f: IncomingFile): string | null {
  const fileName = String(f.fileName || "");
  const fileType = String(f.fileType || "");
  const sizeNumber = Number(f.fileSize) || 0;
  if (!fileName || typeof f.fileData !== "string" || !f.fileData.startsWith("data:")) {
    return "Each file needs a name and valid encoded data.";
  }
  if (sizeNumber > MAX_FILE_SIZE_BYTES) {
    return `"${fileName}" exceeds the 10MB limit (${(sizeNumber / (1024 * 1024)).toFixed(2)} MB).`;
  }
  const lowerFileName = fileName.toLowerCase();
  if (!ALLOWED_EXTENSIONS.some((ext) => lowerFileName.endsWith(ext))) {
    return `"${fileName}": only PNG, JPG and PDF files are accepted.`;
  }
  if (fileType && !ALLOWED_MIME_TYPES.includes(fileType.toLowerCase())) {
    return `"${fileName}": invalid file type ${fileType}.`;
  }
  return null;
}

const MEDIA_SELECT = {
  id: true,
  fileName: true,
  fileType: true,
  fileSize: true,
  createdAt: true,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      pillarId,
      capabilityId,
      questionId,
      claimText,
      evidenceType = "digital",
      fileName,
      fileType,
      fileSize,
      fileData,
      files,
      notes,
    } = body;

    if (!questionId || !pillarId || !capabilityId) {
      return NextResponse.json(
        { error: "Missing required fields: questionId, pillarId, capabilityId" },
        { status: 400 }
      );
    }

    const flags = questionFlags(String(questionId));
    if (!flags.requiresVerification || flags.allowedEvidenceTypes.length === 0) {
      return NextResponse.json(
        { error: "This question does not require verification media." },
        { status: 400 }
      );
    }

    // New multi-file payload, with the legacy single file mapped onto it.
    const incoming: IncomingFile[] = Array.isArray(files) && files.length > 0
      ? files
      : fileName || fileData
        ? [{ fileName, fileType, fileSize, fileData }]
        : [];

    if (evidenceType === "digital" && incoming.length === 0) {
      return NextResponse.json(
        { error: "Please select at least one file to upload as evidence." },
        { status: 400 }
      );
    }

    for (const f of incoming) {
      const problem = validateFile(f);
      if (problem) {
        return NextResponse.json({ error: problem }, { status: 400 });
      }
      const kind = fileKind(String(f.fileType || ""));
      // Extension-only uploads (no MIME sniffed): infer kind from extension.
      const inferred =
        kind ||
        (String(f.fileName || "").toLowerCase().endsWith(".pdf") ? "document" : "image");
      if (!flags.allowedEvidenceTypes.includes(inferred)) {
        const want =
          flags.allowedEvidenceTypes.includes("document") && !flags.allowedEvidenceTypes.includes("image")
            ? "only documents (PDF)"
            : "only photos (PNG/JPG)";
        return NextResponse.json(
          { error: `This question accepts ${want}. "${f.fileName}" was rejected.` },
          { status: 400 }
        );
      }
    }

    const user = await getOrCreateCurrentUser(email || undefined);
    if (!user) {
      return NextResponse.json(
        { error: "User not found or unauthenticated" },
        { status: 401 }
      );
    }

    // Find or create assessment for this user in Neon
    let assessment = await prisma.assessment.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!assessment) {
      assessment = await prisma.assessment.create({
        data: {
          userId: user.id,
          status: "IN_PROGRESS",
        },
      });
    }

    const existing = await prisma.ffvEvidence.findUnique({
      where: { assessmentId_questionId: { assessmentId: assessment.id, questionId } },
      include: { media: { select: { id: true } } },
    });
    const existingCount = existing?.media.length || 0;
    if (existingCount + incoming.length > MAX_MEDIA_PER_QUESTION) {
      return NextResponse.json(
        {
          error: `A maximum of ${MAX_MEDIA_PER_QUESTION} files per question. ${existingCount} already uploaded — remove one to add another.`,
        },
        { status: 400 }
      );
    }

    // Upsert the evidence record in Neon database
    const evidence = await prisma.ffvEvidence.upsert({
      where: {
        assessmentId_questionId: {
          assessmentId: assessment.id,
          questionId,
        },
      },
      update: {
        pillarId: Number(pillarId),
        capabilityId,
        claimText: claimText || null,
        evidenceType,
        notes: notes || null,
        status: "submitted",
        updatedAt: new Date(),
      },
      create: {
        assessmentId: assessment.id,
        pillarId: Number(pillarId),
        capabilityId,
        questionId,
        claimText: claimText || null,
        evidenceType,
        notes: notes || null,
        status: "submitted",
      },
    });

    const createdMedia = await Promise.all(
      incoming.map((f) =>
        prisma.ffvMedia.create({
          data: {
            evidenceId: evidence.id,
            fileName: String(f.fileName),
            fileType: f.fileType ? String(f.fileType) : null,
            fileSize: f.fileSize ? Number(f.fileSize) : null,
            fileData: String(f.fileData),
          },
          select: MEDIA_SELECT,
        })
      )
    );

    const media = await prisma.ffvMedia.findMany({
      where: { evidenceId: evidence.id },
      orderBy: { createdAt: "asc" },
      select: MEDIA_SELECT,
    });

    return NextResponse.json({
      success: true,
      message: "Evidence successfully stored in Neon database",
      evidence: {
        id: evidence.id,
        assessmentId: evidence.assessmentId,
        pillarId: evidence.pillarId,
        capabilityId: evidence.capabilityId,
        questionId: evidence.questionId,
        evidenceType: evidence.evidenceType,
        notes: evidence.notes,
        status: evidence.status,
        createdAt: evidence.createdAt,
        updatedAt: evidence.updatedAt,
        media,
        uploaded: createdMedia,
      },
    });
  } catch (error: any) {
    console.error("Error saving FFV evidence to Neon:", error);
    return NextResponse.json(
      { error: "Failed to store evidence in Neon database", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get("email");
    const pillarParam = searchParams.get("pillarId");

    const user = await getOrCreateCurrentUser(emailParam || undefined);
    if (!user) {
      return NextResponse.json(
        { error: "User not found or unauthenticated" },
        { status: 401 }
      );
    }

    const assessment = await prisma.assessment.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!assessment) {
      return NextResponse.json({ success: true, evidences: [] });
    }

    const whereClause: any = { assessmentId: assessment.id };
    if (pillarParam) {
      whereClause.pillarId = Number(pillarParam);
    }

    const evidences = await prisma.ffvEvidence.findMany({
      where: whereClause,
      include: { media: { orderBy: { createdAt: "asc" }, select: MEDIA_SELECT } },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ success: true, evidences });
  } catch (error: any) {
    console.error("Error retrieving FFV evidences from Neon:", error);
    return NextResponse.json(
      { error: "Failed to retrieve evidences", details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing required fields: id, status" },
        { status: 400 }
      );
    }

    const updated = await prisma.ffvEvidence.update({
      where: { id },
      data: {
        status,
        ...(notes !== undefined ? { notes } : {}),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, evidence: updated });
  } catch (error: any) {
    console.error("Error updating FFV evidence status:", error);
    return NextResponse.json(
      { error: "Failed to update evidence status", details: error.message },
      { status: 500 }
    );
  }
}
