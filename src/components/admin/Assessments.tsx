"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog";
import { 
  Search, 
  Eye, 
  Download, 
  RefreshCw, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  Sparkles,
  BarChart3,
  Calendar,
  CheckCircle2,
  Lock
} from "lucide-react";

// 8 Pillars of the Future Farms Framework
const PILLARS = [
  "Soil & Fertility",
  "Water & Irrigation",
  "Crop Protection & IPM",
  "Renewable Energy",
  "Labor & Worker Safety",
  "Supply Chain & Traceability",
  "Waste & Circularity",
  "Financial Viability",
];

interface Assessment {
  id: string;
  businessName: string;
  userName: string;
  email: string;
  location: string;
  overallScore: number; // Out of 100
  maturityLevel: "Level 1 (Basic)" | "Level 2 (Emerging)" | "Level 3 (Established)" | "Level 4 (Advanced)" | "Level 5 (Leader)";
  pillarScores: Record<string, number>; // 0 to 100 for each pillar
  lastAssessedAt: string; // ISO Date
  nextEligibleDate: string; // ISO Date (90-day window)
  isEligibleForReassessment: boolean;
  status: "COMPLETED" | "IN_PROGRESS" | "EXPIRED";
}

const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: "ASM-88201",
    businessName: "GreenValley Farms Ltd",
    userName: "Alice Wanjiku",
    email: "alice@greenvalley.com",
    location: "Kiambu / Central Highlands",
    overallScore: 82,
    maturityLevel: "Level 4 (Advanced)",
    pillarScores: {
      "Soil & Fertility": 88,
      "Water & Irrigation": 92,
      "Crop Protection & IPM": 75,
      "Renewable Energy": 80,
      "Labor & Worker Safety": 85,
      "Supply Chain & Traceability": 78,
      "Waste & Circularity": 70,
      "Financial Viability": 88,
    },
    lastAssessedAt: "2026-07-10T09:00:00Z",
    nextEligibleDate: "2026-10-08T09:00:00Z", // Passed 90 days
    isEligibleForReassessment: true,
    status: "COMPLETED",
  },
  {
    id: "ASM-88202",
    businessName: "Rift Valley Organics",
    userName: "Brian Kiprop",
    email: "brian@riftorganics.co.ke",
    location: "Naivasha Lakeside",
    overallScore: 64,
    maturityLevel: "Level 3 (Established)",
    pillarScores: {
      "Soil & Fertility": 72,
      "Water & Irrigation": 68,
      "Crop Protection & IPM": 85,
      "Renewable Energy": 45,
      "Labor & Worker Safety": 60,
      "Supply Chain & Traceability": 55,
      "Waste & Circularity": 62,
      "Financial Viability": 65,
    },
    lastAssessedAt: "2026-09-01T14:30:00Z",
    nextEligibleDate: "2026-11-30T14:30:00Z", // In window
    isEligibleForReassessment: false,
    status: "COMPLETED",
  },
  {
    id: "ASM-88203",
    businessName: "Highland Dairy Co.",
    userName: "Mercy Chebet",
    email: "mercy@highlanddairy.com",
    location: "Eldoret / Plateau",
    overallScore: 42,
    maturityLevel: "Level 2 (Emerging)",
    pillarScores: {
      "Soil & Fertility": 45,
      "Water & Irrigation": 50,
      "Crop Protection & IPM": 38,
      "Renewable Energy": 30,
      "Labor & Worker Safety": 40,
      "Supply Chain & Traceability": 42,
      "Waste & Circularity": 48,
      "Financial Viability": 43,
    },
    lastAssessedAt: "2026-08-15T11:20:00Z",
    nextEligibleDate: "2026-11-13T11:20:00Z",
    isEligibleForReassessment: false,
    status: "COMPLETED",
  },
];

function fmtDate(v: string | null) {
  if (!v) return "—";
  try {
    return new Date(v).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return "—";
  }
}

function calculateDaysRemaining(targetDateStr: string) {
  const target = new Date(targetDateStr).getTime();
  const now = new Date("2026-10-12").getTime(); // Current system context
  const diff = Math.ceil((target - now) / (1000 * 3600 * 24));
  return diff > 0 ? diff : 0;
}

export function Assessments() {
  const [assessments, setAssessments] = useState<Assessment[]>(INITIAL_ASSESSMENTS);
  const [search, setSearch] = useState("");
  const [selectedAsm, setSelectedAsm] = useState<Assessment | null>(null);

  const filteredAssessments = assessments.filter((a) =>
    a.businessName.toLowerCase().includes(search.toLowerCase()) ||
    a.userName.toLowerCase().includes(search.toLowerCase()) ||
    a.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleGrantOverride = (id: string) => {
    setAssessments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, isEligibleForReassessment: true } : a
      )
    );
    if (selectedAsm && selectedAsm.id === id) {
      setSelectedAsm({ ...selectedAsm, isEligibleForReassessment: true });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            8-Pillar Farm Framework Assessments
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor sustainability scores, pillar maturity metrics, and enforce the 90-day re-assessment cadence.
          </p>
        </div>
        <Button className="gap-2 shadow-xs cursor-pointer">
          <Download className="h-4 w-4" /> Export Framework Benchmark
        </Button>
      </div>

      {/* Senior UX Key Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border bg-card p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Avg Sustainability Score</p>
            <h3 className="text-2xl font-black text-foreground">62.6 / 100</h3>
            <span className="text-xs text-emerald-600 font-semibold">+4.2% overall growth</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <BarChart3 className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Completed Audits</p>
            <h3 className="text-2xl font-black text-foreground">148 Farms</h3>
            <span className="text-xs text-muted-foreground">Across 8 Pillars</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Re-Assessment Ready</p>
            <h3 className="text-2xl font-black text-foreground">
              {assessments.filter(a => a.isEligibleForReassessment).length} Farmers
            </h3>
            <span className="text-xs text-emerald-600 font-semibold">Passed 90-day window</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <RefreshCw className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Cadence Locked</p>
            <h3 className="text-2xl font-black text-foreground">
              {assessments.filter(a => !a.isEligibleForReassessment).length} Farmers
            </h3>
            <span className="text-xs text-amber-600 font-semibold">In 90-day cool-off</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Lock className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-card p-4 rounded-2xl border shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search farm business, user name, or assessment ID..."
            className="pl-10 w-full"
          />
        </div>
      </div>

      {/* Assessments Table */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="px-5 font-bold">Audit Ref</TableHead>
              <TableHead className="px-5 font-bold">Farm &amp; User</TableHead>
              <TableHead className="px-5 font-bold">Framework Maturity</TableHead>
              <TableHead className="px-5 font-bold">Score</TableHead>
              <TableHead className="px-5 font-bold">Last Assessed</TableHead>
              <TableHead className="px-5 font-bold">90-Day Cadence Status</TableHead>
              <TableHead className="px-5 font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border/40">
            {filteredAssessments.map((a) => {
              const daysLeft = calculateDaysRemaining(a.nextEligibleDate);

              return (
                <TableRow key={a.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="px-5 font-mono text-xs font-bold text-primary">
                    {a.id}
                  </TableCell>
                  <TableCell className="px-5">
                    <div className="font-semibold text-foreground">{a.businessName}</div>
                    <div className="text-xs text-muted-foreground">{a.userName} ({a.location})</div>
                  </TableCell>
                  <TableCell className="px-5">
                    <Badge variant="outline" className="font-semibold text-xs border-primary/30 text-primary">
                      {a.maturityLevel}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-foreground text-sm">{a.overallScore}</span>
                      <span className="text-xs text-muted-foreground">/ 100</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 text-xs text-muted-foreground">
                    {fmtDate(a.lastAssessedAt)}
                  </TableCell>
                  <TableCell className="px-5">
                    {a.isEligibleForReassessment ? (
                      <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 gap-1 hover:bg-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" /> Eligible to Re-assess
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" /> Locked ({daysLeft} days remaining)
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-5 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedAsm(a)}
                      className="h-8 px-2.5 text-xs cursor-pointer font-semibold"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" /> View Radar
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* 8-Pillar Assessment Radar & Audit Modal */}
      <Dialog open={!!selectedAsm} onOpenChange={(open) => !open && setSelectedAsm(null)}>
        <DialogContent className="sm:max-w-2xl rounded-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary mb-1">
              <Sparkles className="h-5 w-5" />
              <DialogTitle className="text-lg font-bold">Framework Assessment Audit - {selectedAsm?.id}</DialogTitle>
            </div>
            <DialogDescription>
              8 Pillars evaluation breakdown and 90-day re-assessment eligibility governance.
            </DialogDescription>
          </DialogHeader>

          {selectedAsm && (
            <div className="space-y-5 text-sm py-2">
              {/* Profile Card */}
              <div className="bg-muted/50 p-4 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 border border-border/60">
                <div>
                  <h4 className="font-bold text-foreground text-base">{selectedAsm.businessName}</h4>
                  <p className="text-xs text-muted-foreground">{selectedAsm.userName} • {selectedAsm.email}</p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-2xl font-black text-primary">{selectedAsm.overallScore} <span className="text-xs font-medium text-muted-foreground">/ 100</span></div>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                    {selectedAsm.maturityLevel}
                  </Badge>
                </div>
              </div>

              {/* 8-Pillar Score Breakdown UX */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">8 Pillars Score Distribution</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PILLARS.map((pillar) => {
                    const score = selectedAsm.pillarScores[pillar] || 0;
                    return (
                      <div key={pillar} className="bg-card p-3 rounded-xl border border-border/60 space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-foreground">{pillar}</span>
                          <span className="font-bold text-primary">{score}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${score >= 75 ? "bg-emerald-500" : score >= 50 ? "bg-primary" : "bg-amber-500"}`} 
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 90-Day Cadence Governance Control */}
              <div className="bg-muted/30 p-4 rounded-2xl border border-border/60 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" /> 90-Day Cadence Policy
                  </span>
                  {selectedAsm.isEligibleForReassessment ? (
                    <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                      Eligible to Re-assess
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-amber-600">
                      Locked Until {fmtDate(selectedAsm.nextEligibleDate)}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Farmers can conduct self-assessments or request formal audits once every 90 days. Admins can grant an override if major capital investments have been verified.
                </p>
                {!selectedAsm.isEligibleForReassessment && (
                  <Button 
                    onClick={() => handleGrantOverride(selectedAsm.id)}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-semibold cursor-pointer gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Grant Early Re-assessment Eligibility
                  </Button>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button variant="outline" onClick={() => alert("Exporting diagnostic PDF...")} className="cursor-pointer text-xs">
              <Download className="h-3.5 w-3.5 mr-1" /> Export Report PDF
            </Button>
            <Button onClick={() => setSelectedAsm(null)} className="cursor-pointer text-xs">
              Close Audit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}