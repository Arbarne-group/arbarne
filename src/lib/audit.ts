import { AsyncLocalStorage } from "async_hooks";
import type { PrismaClient } from "@prisma/client";

export interface AuditContext {
  actorId?: string;
  ip?: string;
}

const auditContext = new AsyncLocalStorage<AuditContext>();

/** Run app code with an audit actor attached (used by API routes). */
export function runWithAuditContext<T>(ctx: AuditContext, fn: () => Promise<T>): Promise<T> {
  return auditContext.run(ctx, fn);
}

export function currentAuditContext(): AuditContext {
  return auditContext.getStore() ?? {};
}

// Models never audited (the log itself).
const EXCLUDED_MODELS = new Set(["AuditLog"]);
// Update payloads touching ONLY these fields are skipped (presence noise).
const NOISE_FIELDS = new Set(["lastSeenAt"]);

const AUDITED_ACTIONS = new Set([
  "create",
  "createMany",
  "update",
  "updateMany",
  "upsert",
  "delete",
  "deleteMany",
]);

function stripMeta(obj: any): any {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(stripMeta);
  const { updatedAt: _u, ...rest } = obj;
  return rest;
}

function recordIdOf(params: any, result: any): string {
  try {
    if (result && typeof result.id === "string") return result.id;
    if (result && typeof result.count === "number")
      return `${result.count} record(s)`;
    const w = params?.args?.where;
    if (w && typeof w === "object") {
      if (typeof w.id === "string") return w.id;
      return JSON.stringify(w);
    }
  } catch {}
  return "?";
}

async function readBefore(client: any, params: any): Promise<any> {
  try {
    const model = params.model;
    const where = params.args?.where;
    if (!model || !where || typeof where !== "object") return null;
    const delegate = (client as any)[model[0].toLowerCase() + model.slice(1)];
    if (!delegate?.findUnique) return null;
    return await delegate.findUnique({ where });
  } catch {
    return null;
  }
}

/**
 * Installs audit-everything middleware on the shared Prisma client. Safe for
 * dev HMR (installs once). Best-effort: audit failures never break writes.
 */
export function installAuditMiddleware(client: PrismaClient) {
  const g = globalThis as any;
  if (g.__FF_AUDIT_INSTALLED__) return;
  g.__FF_AUDIT_INSTALLED__ = true;

  (client as any).$use(async (params: any, next: (p: any) => Promise<any>) => {
    try {
      const model: string | undefined = params.model;
      if (!model || EXCLUDED_MODELS.has(model) || !AUDITED_ACTIONS.has(params.action)) {
        return next(params);
      }

      const data = params.args?.data;
      if (
        params.action === "update" &&
        data &&
        typeof data === "object" &&
        Object.keys(data).every((k) => NOISE_FIELDS.has(k))
      ) {
        return next(params); // presence heartbeat — skip
      }

      const before =
        params.action === "update" ||
        params.action === "delete" ||
        params.action === "upsert"
          ? await readBefore(client, params)
          : null;

      const result = await next(params);

      const ctx = currentAuditContext();
      const after =
        params.action === "delete" || params.action === "deleteMany"
          ? null
          : Array.isArray(result)
          ? { count: result.length }
          : result ?? null;

      try {
        await (client as any).auditLog.create({
          data: {
            actorId: ctx.actorId ?? null,
            ip: ctx.ip ?? null,
            action: params.action.toUpperCase(),
            model,
            recordId: String(recordIdOf(params, result)),
            before: before ? JSON.stringify(stripMeta(before)).slice(0, 20000) : null,
            after: after ? JSON.stringify(stripMeta(after)).slice(0, 20000) : null,
          },
        });
      } catch {
        // Audit write must never break the primary write.
      }

      return result;
    } catch {
      return next(params);
    }
  });
}
