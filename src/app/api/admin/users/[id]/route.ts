import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff, ALL_ROLES } from "@/lib/access";
import { runWithAuditContext } from "@/lib/audit";

/** FFAdmin/FFDeveloper: change a user's role. */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireStaff();
  if ("response" in gate) return gate.response;
  if (!["FFDeveloper", "FFAdmin"].includes(gate.user.role)) {
    return NextResponse.json(
      { error: "Only FFAdmin or FFDeveloper can change roles." },
      { status: 403 }
    );
  }
  try {
    const { id } = await params;
    const body = await request.json();
    const role = String(body.role || "");
    const otherRoleLabel = String(body.otherRoleLabel || "").trim() || null;
    if (!ALL_ROLES.includes(role)) {
      return NextResponse.json({ error: "Select a valid role." }, { status: 400 });
    }
    if (role === "Other" && !otherRoleLabel) {
      return NextResponse.json({ error: "Describe the role when choosing Other." }, { status: 400 });
    }
    if (id === gate.user.id) {
      return NextResponse.json({ error: "You cannot change your own role." }, { status: 400 });
    }
    const user = await runWithAuditContext({ actorId: gate.user.id }, async () =>
      prisma.user.update({ where: { id }, data: { role, otherRoleLabel: role === "Other" ? otherRoleLabel : null } })
    );
    return NextResponse.json({ success: true, user: { id: user.id, role: user.role } });
  } catch (error: any) {
    if (String(error?.code) === "P2025") {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Could not update role." }, { status: 500 });
  }
}
