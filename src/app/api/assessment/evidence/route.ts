import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Criteria configuration
const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
];

const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".pdf"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

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
      notes,
    } = body;

    if (!questionId || !pillarId || !capabilityId) {
      return NextResponse.json(
        { error: "Missing required fields: questionId, pillarId, capabilityId" },
        { status: 400 }
      );
    }

    // Validate file if evidenceType is "digital"
    if (evidenceType === "digital") {
      if (!fileName || !fileData) {
        return NextResponse.json(
          { error: "Please select a file to upload as digital evidence." },
          { status: 400 }
        );
      }

      // Check file size (10MB maximum)
      const sizeNumber = Number(fileSize) || 0;
      if (sizeNumber > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          {
            error: `File exceeds the 10MB limit. (Selected file: ${(sizeNumber / (1024 * 1024)).toFixed(2)} MB). Please select a file up to 10MB.`,
          },
          { status: 400 }
        );
      }

      // Check file extension
      const lowerFileName = fileName.toLowerCase();
      const hasValidExt = ALLOWED_EXTENSIONS.some((ext) => lowerFileName.endsWith(ext));
      if (!hasValidExt) {
        return NextResponse.json(
          {
            error: `Invalid file format. Only PNG, JPG, and PDF files are accepted. (${fileName})`,
          },
          { status: 400 }
        );
      }

      // Check MIME type if provided
      if (fileType && !ALLOWED_MIME_TYPES.includes(fileType.toLowerCase())) {
        return NextResponse.json(
          {
            error: `Invalid file type: ${fileType}. Only PNG, JPG, and PDF files are accepted.`,
          },
          { status: 400 }
        );
      }

      // Check Base64 payload structure
      if (typeof fileData !== "string" || !fileData.startsWith("data:")) {
        return NextResponse.json(
          { error: "Invalid file encoding. File must be encoded as a valid data URL." },
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
        fileName: fileName || null,
        fileType: fileType || null,
        fileSize: fileSize ? Number(fileSize) : null,
        fileData: fileData || null,
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
        fileName: fileName || null,
        fileType: fileType || null,
        fileSize: fileSize ? Number(fileSize) : null,
        fileData: fileData || null,
        notes: notes || null,
        status: "submitted",
      },
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
        fileName: evidence.fileName,
        fileType: evidence.fileType,
        fileSize: evidence.fileSize,
        notes: evidence.notes,
        status: evidence.status,
        createdAt: evidence.createdAt,
        updatedAt: evidence.updatedAt,
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
