"use client";

import { useState, useEffect, useCallback } from "react";

const ROLES = ["FFDeveloper", "FFAdmin", "FFStaff", "FFFarmer", "FFFarmManager", "Other"];

function fmtDate(v: string | null) {
  if (!v) return "—";
  try {
    return new Date(v).toLocaleString("en-GB", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

/* ================= Users & invites ================= */

export function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [invEmail, setInvEmail] = useState("");
  const [invRole, setInvRole] = useState("FFStaff");
  const [invLabel, setInvLabel] = useState("");
  const [invMsg, setInvMsg] = useState("");
  const [invites, setInvites] = useState<any[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.set("search", search);
      if (roleFilter) q.set("role", roleFilter);
      const res = await fetch(`/api/admin/users?${q.toString()}`);
      const data = await res.json();
      if (data.users) setUsers(data.users);
      const inv = await fetch("/api/admin/invites").then((r) => r.json());
      if (inv.invites) setInvites(inv.invites);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  async function changeRole(id: string, role: string) {
    const otherRoleLabel =
      role === "Other" ? prompt("Describe the role:") || "" : null;
    if (role === "Other" && !otherRoleLabel) return;
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, otherRoleLabel }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      alert(d.error || "Could not change role.");
      return;
    }
    load();
  }

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault();
    setInvMsg("");
    const res = await fetch("/api/admin/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: invEmail, role: invRole, otherRoleLabel: invLabel }),
    });
    const data = await res.json();
    if (!res.ok) {
      setInvMsg(data.error || "Invite failed.");
      return;
    }
    setInvMsg("Invitation sent.");
    setInvEmail("");
    setInvLabel("");
    load();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5">
        <h3 className="text-sm font-bold text-on-surface mb-3">Invite staff / user</h3>
        <form onSubmit={sendInvite} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input value={invEmail} onChange={(e) => setInvEmail(e.target.value)} placeholder="Email" type="email" required
            className="rounded-xl border border-outline-variant px-3 py-2 text-sm bg-surface" />
          <select value={invRole} onChange={(e) => setInvRole(e.target.value)}
            className="rounded-xl border border-outline-variant px-3 py-2 text-sm bg-surface">
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <input value={invLabel} onChange={(e) => setInvLabel(e.target.value)} placeholder="Role label (if Other)"
            className="rounded-xl border border-outline-variant px-3 py-2 text-sm bg-surface" />
          <button className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90 cursor-pointer">
            Send invite
          </button>
        </form>
        {invMsg && <p className="mt-2 text-xs font-semibold text-on-surface-variant">{invMsg}</p>}
        {invites.filter((i) => !i.acceptedAt).length > 0 && (
          <div className="mt-3 text-xs text-on-surface-variant">
            Pending: {invites.filter((i) => !i.acceptedAt).map((i) => `${i.email} (${i.role})`).join(", ")}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email…"
          className="flex-1 rounded-xl border border-outline-variant px-3 py-2 text-sm bg-surface" />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-xl border border-outline-variant px-3 py-2 text-sm bg-surface">
          <option value="">All roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-on-surface-variant">Loading users…</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-outline-variant/40">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="bg-surface-container-low text-xs uppercase tracking-wide text-on-surface-variant">
                <th className="px-4 py-2.5">User</th>
                <th className="px-4 py-2.5">Role</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Presence</th>
                <th className="px-4 py-2.5">Joined</th>
                <th className="px-4 py-2.5">Set role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-outline-variant/30">
                  <td className="px-4 py-2.5">
                    <div className="font-semibold text-on-surface">{u.name}</div>
                    <div className="text-xs text-on-surface-variant">{u.email}</div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="rounded-full bg-surface-container-high px-2.5 py-0.5 text-xs font-bold">
                      {u.role}{u.otherRoleLabel ? ` (${u.otherRoleLabel})` : ""}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs">{u.accountStatus}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${u.online ? "text-emerald-700" : "text-on-surface-variant"}`}>
                      <span className={`h-2 w-2 rounded-full ${u.online ? "bg-emerald-500" : "bg-gray-300"}`} />
                      {u.online ? "Online" : `Seen ${fmtDate(u.lastSeenAt)}`}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs">{fmtDate(u.createdAt)}</td>
                  <td className="px-4 py-2.5">
                    <select defaultValue={u.role} onChange={(e) => changeRole(u.id, e.target.value)}
                      className="rounded-lg border border-outline-variant px-2 py-1 text-xs bg-surface">
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ================= Geography ================= */

export function GeographyTab() {
  const [countries, setCountries] = useState<any[]>([]);
  const [countryCode, setCountryCode] = useState("");
  const [counties, setCounties] = useState<any[]>([]);
  const [countyCode, setCountyCode] = useState("");
  const [towns, setTowns] = useState<any[]>([]);
  const [subCounties, setSubCounties] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [cForm, setCForm] = useState({ initials: "", name: "", dialCode: "", flagEmoji: "" });
  const [coForm, setCoForm] = useState({ code: "", name: "" });
  const [tForm, setTForm] = useState({ code: "", name: "" });
  const [scForm, setScForm] = useState({ code: "", name: "" });

  const reloadCountries = async () => {
    const d = await fetch("/api/geo/countries").then((r) => r.json());
    if (d.countries) setCountries(d.countries);
  };
  const reloadCounties = async (cc: string) => {
    if (!cc) { setCounties([]); return; }
    const d = await fetch(`/api/geo/counties?country=${cc}`).then((r) => r.json());
    if (d.counties) setCounties(d.counties);
  };
  const reloadTowns = async (cc: string, co: string) => {
    if (!cc || !co) { setTowns([]); return; }
    const d = await fetch(`/api/geo/towns?country=${cc}&county=${encodeURIComponent(co)}`).then((r) => r.json());
    if (d.towns) setTowns(d.towns);
  };
  const reloadSubCounties = async (cc: string, co: string) => {
    if (!cc || !co) { setSubCounties([]); return; }
    const d = await fetch(`/api/geo/subcounties?country=${cc}&county=${encodeURIComponent(co)}`).then((r) => r.json());
    if (d.subCounties) setSubCounties(d.subCounties);
  };

  useEffect(() => { reloadCountries(); }, []);
  useEffect(() => { setCountyCode(""); setTowns([]); setSubCounties([]); reloadCounties(countryCode); }, [countryCode]);
  useEffect(() => { reloadTowns(countryCode, countyCode); }, [countryCode, countyCode]);
  useEffect(() => {
    if (!countryCode || !countyCode) return;
    let cancelled = false;
    fetch(`/api/geo/subcounties?country=${countryCode}&county=${encodeURIComponent(countyCode)}`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled && d?.subCounties) setSubCounties(d.subCounties); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [countryCode, countyCode]);

  async function post(url: string, body: any, okMsg: string) {
    setMsg("");
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { setMsg(data.error || "Failed."); return; }
    setMsg(okMsg);
    reloadCountries(); reloadCounties(countryCode); reloadTowns(countryCode, countyCode);
    reloadSubCounties(countryCode, countyCode);
  }
  async function remove(url: string, label: string) {
    if (!confirm(`Delete ${label}?`)) return;
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) { const d = await res.json().catch(() => ({})); setMsg(d.error || "Delete failed."); return; }
    setMsg(`${label} deleted.`);
    if (url.includes("/subcounties/")) reloadSubCounties(countryCode, countyCode);
    else if (url.includes("/towns/")) reloadTowns(countryCode, countyCode);
    else if (url.includes("/counties/")) { setCountyCode(""); reloadCounties(countryCode); }
    else { setCountryCode(""); reloadCountries(); }
  }

  const input = "rounded-xl border border-outline-variant px-3 py-2 text-sm bg-surface w-full";

  return (
    <div className="space-y-6">
      {msg && <p className="text-xs font-semibold text-on-surface">{msg}</p>}

      <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5">
        <h3 className="text-sm font-bold text-on-surface mb-3">Countries ({countries.length})</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {countries.map((c) => (
            <button key={c.initials} type="button" onClick={() => setCountryCode(c.initials)}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold cursor-pointer ${countryCode === c.initials ? "bg-primary text-white border-primary" : "border-outline-variant hover:bg-surface-container-low"}`}>
              {c.flagEmoji ? `${c.flagEmoji} ` : ""}{c.name} ({c.initials})
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <input value={cForm.initials} onChange={(e) => setCForm({ ...cForm, initials: e.target.value })} placeholder="KE" className={input} />
          <input value={cForm.name} onChange={(e) => setCForm({ ...cForm, name: e.target.value })} placeholder="Kenya" className={input} />
          <input value={cForm.dialCode} onChange={(e) => setCForm({ ...cForm, dialCode: e.target.value })} placeholder="+254" className={input} />
          <input value={cForm.flagEmoji} onChange={(e) => setCForm({ ...cForm, flagEmoji: e.target.value })} placeholder="🇰🇪" className={input} />
          <button onClick={() => post("/api/geo/countries", cForm, "Country added.")} className="rounded-xl bg-primary px-3 py-2 text-xs font-bold text-white cursor-pointer">Add</button>
        </div>
      </div>

      <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5">
        <h3 className="text-sm font-bold text-on-surface mb-3">
          Counties / Provinces {countryCode ? `in ${countryCode} (${counties.length})` : "— select a country"}
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {counties.map((c) => (
            <span key={c.code} className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold ${countyCode === c.code ? "bg-secondary text-white border-secondary" : "border-outline-variant"}`}>
              <button type="button" onClick={() => setCountyCode(c.code)} className="cursor-pointer">{c.name}</button>
              <button type="button" onClick={() => remove(`/api/geo/counties/${countryCode}/${encodeURIComponent(c.code)}`, c.name)} className="opacity-60 hover:opacity-100 cursor-pointer">×</button>
            </span>
          ))}
        </div>
        {countryCode && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input value={coForm.code} onChange={(e) => setCoForm({ ...coForm, code: e.target.value })} placeholder="Code e.g. NAKURU" className={input} />
            <input value={coForm.name} onChange={(e) => setCoForm({ ...coForm, name: e.target.value })} placeholder="Nakuru" className={input} />
            <button onClick={() => post("/api/geo/counties", { ...coForm, countryCode }, "County added.")} className="rounded-xl bg-primary px-3 py-2 text-xs font-bold text-white cursor-pointer">Add</button>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5">
        <h3 className="text-sm font-bold text-on-surface mb-1">
          Sub-counties {countyCode ? `in ${countyCode} (${subCounties.length})` : "— select a county"}
        </h3>
        <p className="text-xs text-on-surface-variant mb-3">
          This is the list farmers pick from on the Farm Business Profile.
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {subCounties.map((s) => (
            <span key={s.code} className="inline-flex items-center gap-1 rounded-full border border-outline-variant px-3 py-1.5 text-xs">
              {s.name}
              <button type="button" onClick={() => remove(`/api/geo/subcounties/${countryCode}/${encodeURIComponent(countyCode)}/${encodeURIComponent(s.code)}`, s.name)} className="opacity-60 hover:opacity-100 cursor-pointer">×</button>
            </span>
          ))}
        </div>
        {countryCode && countyCode && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input value={scForm.code} onChange={(e) => setScForm({ ...scForm, code: e.target.value })} placeholder="Code e.g. 047001" className={input} />
            <input value={scForm.name} onChange={(e) => setScForm({ ...scForm, name: e.target.value })} placeholder="Westlands" className={input} />
            <button onClick={() => post("/api/geo/subcounties", { ...scForm, countryCode, countyCode }, "Sub-county added.")} className="rounded-xl bg-primary px-3 py-2 text-xs font-bold text-white cursor-pointer">Add</button>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5">
        <h3 className="text-sm font-bold text-on-surface mb-3">
          Towns {countyCode ? `in ${countyCode} (${towns.length})` : "— select a county"}
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {towns.map((t) => (
            <span key={t.code} className="inline-flex items-center gap-1 rounded-full border border-outline-variant px-3 py-1.5 text-xs">
              {t.name}
              <button type="button" onClick={() => remove(`/api/geo/towns/${countryCode}/${encodeURIComponent(countyCode)}/${encodeURIComponent(t.code)}`, t.name)} className="opacity-60 hover:opacity-100 cursor-pointer">×</button>
            </span>
          ))}
        </div>
        {countryCode && countyCode && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input value={tForm.code} onChange={(e) => setTForm({ ...tForm, code: e.target.value })} placeholder="Code e.g. NAIVASHA" className={input} />
            <input value={tForm.name} onChange={(e) => setTForm({ ...tForm, name: e.target.value })} placeholder="Naivasha" className={input} />
            <button onClick={() => post("/api/geo/towns", { ...tForm, countryCode, countyCode }, "Town added.")} className="rounded-xl bg-primary px-3 py-2 text-xs font-bold text-white cursor-pointer">Add</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= Audit ================= */

export function AuditTab() {
  const [logs, setLogs] = useState<any[]>([]);
  const [model, setModel] = useState("");
  const [action, setAction] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ take: "100" });
      if (model) q.set("model", model);
      if (action) q.set("action", action);
      const d = await fetch(`/api/admin/audit?${q.toString()}`).then((r) => r.json());
      if (d.logs) setLogs(d.logs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [model, action]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Filter model (e.g. User, Town)…"
          className="flex-1 rounded-xl border border-outline-variant px-3 py-2 text-sm bg-surface" />
        <select value={action} onChange={(e) => setAction(e.target.value)}
          className="rounded-xl border border-outline-variant px-3 py-2 text-sm bg-surface">
          <option value="">All actions</option>
          {["CREATE", "UPDATE", "UPSERT", "DELETE"].map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <button onClick={load} className="rounded-xl border border-outline-variant px-4 py-2 text-sm font-bold cursor-pointer">Refresh</button>
      </div>
      {loading ? (
        <p className="text-sm text-on-surface-variant">Loading audit trail…</p>
      ) : (
        <div className="space-y-2">
          {logs.map((l) => (
            <div key={l.id} className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest">
              <button type="button" onClick={() => setOpen(open === l.id ? null : l.id)}
                className="flex w-full flex-wrap items-center gap-2 px-4 py-2.5 text-left text-xs cursor-pointer">
                <span className={`rounded-full px-2 py-0.5 font-bold ${l.action === "DELETE" ? "bg-red-100 text-red-800" : l.action === "CREATE" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>
                  {l.action}
                </span>
                <span className="font-bold text-on-surface">{l.model}</span>
                <span className="font-mono text-on-surface-variant">{String(l.recordId).slice(0, 40)}</span>
                <span className="text-on-surface-variant">
                  by {l.actor ? `${l.actor.name || l.actor.email} (${l.actor.role || "?"})` : "system"}
                </span>
                <span className="ml-auto text-on-surface-variant">{fmtDate(l.at)}</span>
              </button>
              {open === l.id && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 px-4 pb-3">
                  <pre className="overflow-x-auto rounded-lg bg-surface-container-low p-3 text-[11px]">before: {l.before || "—"}</pre>
                  <pre className="overflow-x-auto rounded-lg bg-surface-container-low p-3 text-[11px]">after: {l.after || "—"}</pre>
                </div>
              )}
            </div>
          ))}
          {logs.length === 0 && <p className="text-sm text-on-surface-variant">No audit entries yet.</p>}
        </div>
      )}
    </div>
  );
}

/* ================= Page ================= */
