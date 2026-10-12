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
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  UserCheck,
  Send,
  Filter
} from "lucide-react";

interface Ticket {
  id: string;
  serviceName: string;
  category: string;
  businessName: string;
  userName: string;
  email: string;
  location: string;
  requestedDate: string;
  urgency: string;
  notes: string;
  assignedSpecialist: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

const INITIAL_TICKETS: Ticket[] = [
  {
    id: "#SRV-2026-089",
    serviceName: "Lab Soil & Irrigation Water Analysis",
    category: "Lab Testing",
    businessName: "GreenValley Farms Ltd",
    userName: "Alice Wanjiku",
    email: "alice@greenvalley.com",
    location: "Kiambu / Central Highlands",
    requestedDate: "2026-10-10T10:30:00Z",
    urgency: "Normal (3-5 Days)",
    notes: "Need complete 14-parameter breakdown for upcoming tomato rotation greenhouse blocks.",
    assignedSpecialist: "Dr. E. Muthoni",
    status: "IN_PROGRESS",
  },
  {
    id: "#SRV-2026-090",
    serviceName: "On-Farm Agronomist Inspection",
    category: "Agronomy & Audits",
    businessName: "Rift Valley Organics",
    userName: "Brian Kiprop",
    email: "brian@riftorganics.co.ke",
    location: "Naivasha Lakeside",
    requestedDate: "2026-10-11T14:15:00Z",
    urgency: "High (24-48 Hours)",
    notes: "Suspected early blight outbreak spreading across block B capsicum crops.",
    assignedSpecialist: "Unassigned",
    status: "PENDING",
  },
  {
    id: "#SRV-2026-074",
    serviceName: "Renewable Energy & Irrigation Diagnostic",
    category: "Farm Engineering",
    businessName: "Highland Dairy Co.",
    userName: "Mercy Chebet",
    email: "mercy@highlanddairy.com",
    location: "Eldoret / Plateau",
    requestedDate: "2026-10-08T09:00:00Z",
    urgency: "Normal (3-5 Days)",
    notes: "Solar pump inverter throwing error code 4; needs telemetry inspection.",
    assignedSpecialist: "Eng. J. Otieno",
    status: "COMPLETED",
  },
];

const SPECIALISTS = [
  "Dr. E. Muthoni (Agronomist)",
  "Eng. J. Otieno (Field Engineer)",
  "Dr. Sarah Chemutai (Lab Director)",
  "Mark Mwangi (Logistics Lead)",
];

function fmtDate(v: string | null) {
  if (!v) return "—";
  try {
    return new Date(v).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export function SupportTickets() {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [selectedSpecialist, setSelectedSpecialist] = useState("");

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch = 
      t.businessName.toLowerCase().includes(search.toLowerCase()) ||
      t.userName.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.serviceName.toLowerCase().includes(search.toLowerCase());
    
    if (statusFilter === "ALL") return matchesSearch;
    return matchesSearch && t.status === statusFilter;
  });

  const handleUpdateTicket = (newStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED") => {
    if (!selectedTicket) return;

    setTickets(prev => prev.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: newStatus,
          assignedSpecialist: selectedSpecialist || t.assignedSpecialist,
        };
      }
      return t;
    }));

    setSelectedTicket(null);
    setResolutionNotes("");
    setSelectedSpecialist("");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            Service Desk &amp; Ticket Resolution
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage incoming agronomy requests, laboratory samples, equipment diagnostics, and dispatch field specialists.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary inline-block animate-pulse" />
            {tickets.filter(t => t.status !== "COMPLETED").length} Open Action Tickets
          </span>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border bg-card p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pending Dispatch</p>
            <h3 className="text-2xl font-black text-foreground">
              {tickets.filter(t => t.status === "PENDING").length} Tickets
            </h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">In Progress / Testing</p>
            <h3 className="text-2xl font-black text-foreground">
              {tickets.filter(t => t.status === "IN_PROGRESS").length} Tickets
            </h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <AlertCircle className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Resolved This Week</p>
            <h3 className="text-2xl font-black text-foreground">
              {tickets.filter(t => t.status === "COMPLETED").length} Tickets
            </h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-card p-4 rounded-2xl border shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket ID, farm business, user name, or service..."
            className="pl-10 w-full"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground ml-1" />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="px-5 font-bold">Ticket ID</TableHead>
              <TableHead className="px-5 font-bold">Service &amp; Farm</TableHead>
              <TableHead className="px-5 font-bold">Location</TableHead>
              <TableHead className="px-5 font-bold">Specialist</TableHead>
              <TableHead className="px-5 font-bold">Status</TableHead>
              <TableHead className="px-5 font-bold">Requested</TableHead>
              <TableHead className="px-5 font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border/40">
            {filteredTickets.map((t) => (
              <TableRow key={t.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="px-5 font-mono text-xs font-bold text-primary">
                  {t.id}
                </TableCell>
                <TableCell className="px-5">
                  <div className="font-semibold text-foreground">{t.serviceName}</div>
                  <div className="text-xs text-muted-foreground">{t.businessName} ({t.userName})</div>
                </TableCell>
                <TableCell className="px-5 text-xs text-muted-foreground">
                  {t.location}
                </TableCell>
                <TableCell className="px-5 text-xs font-medium text-foreground">
                  {t.assignedSpecialist}
                </TableCell>
                <TableCell className="px-5">
                  <Badge 
                    variant={
                      t.status === "COMPLETED" ? "default" : 
                      t.status === "IN_PROGRESS" ? "secondary" : "outline"
                    }
                    className="gap-1.5 font-semibold text-[10px]"
                  >
                    {t.status === "COMPLETED" && <CheckCircle2 className="h-3 w-3" />}
                    {t.status === "IN_PROGRESS" && <AlertCircle className="h-3 w-3" />}
                    {t.status === "PENDING" && <Clock className="h-3 w-3" />}
                    {t.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="px-5 text-xs text-muted-foreground">
                  {fmtDate(t.requestedDate)}
                </TableCell>
                <TableCell className="px-5 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedTicket(t);
                      setSelectedSpecialist(t.assignedSpecialist === "Unassigned" ? "" : t.assignedSpecialist);
                    }}
                    className="h-8 px-2.5 text-xs cursor-pointer font-semibold"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" /> Resolve
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredTickets.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-28 text-center text-muted-foreground">
                  No support tickets found matching your query.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Ticket Resolution Modal */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="sm:max-w-lg rounded-3xl">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary mb-1">
              <MessageSquare className="h-5 w-5" />
              <DialogTitle className="text-lg font-bold">Resolve Support Ticket {selectedTicket?.id}</DialogTitle>
            </div>
            <DialogDescription>Review user service specifications, assign field staff, and update ticket progress.</DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-4 text-sm py-2">
              <div className="bg-muted/50 p-4 rounded-2xl space-y-2 border border-border/60 text-xs">
                <p className="flex justify-between"><strong className="text-muted-foreground">Service:</strong> <span className="text-foreground font-semibold">{selectedTicket.serviceName}</span></p>
                <p className="flex justify-between"><strong className="text-muted-foreground">Business:</strong> <span className="text-foreground">{selectedTicket.businessName} ({selectedTicket.userName})</span></p>
                <p className="flex justify-between"><strong className="text-muted-foreground">Contact Email:</strong> <span className="text-foreground">{selectedTicket.email}</span></p>
                <p className="flex justify-between"><strong className="text-muted-foreground">Location:</strong> <span className="text-foreground">{selectedTicket.location}</span></p>
                <p className="flex justify-between"><strong className="text-muted-foreground">Urgency Tier:</strong> <span className="text-amber-600 font-bold">{selectedTicket.urgency}</span></p>
              </div>

              <div className="space-y-1.5 text-xs">
                <strong className="text-foreground block">User Notes / Symptoms:</strong>
                <p className="bg-card p-3 rounded-xl border text-muted-foreground italic">
                  &ldquo;{selectedTicket.notes}&rdquo;
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground block">Assign Specialist / Field Officer</label>
                <select
                  value={selectedSpecialist}
                  onChange={(e) => setSelectedSpecialist(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select a specialist...</option>
                  {SPECIALISTS.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground block">Resolution / Dispatch Log Note</label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Type dispatch updates, lab findings, or resolution notes for the user..."
                  className="w-full rounded-xl border border-input bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button 
              variant="outline" 
              onClick={() => handleUpdateTicket("IN_PROGRESS")}
              className="cursor-pointer text-xs"
            >
              Mark In Progress
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => handleUpdateTicket("PENDING")}
              className="cursor-pointer text-xs"
            >
              Keep Pending
            </Button>
            <Button 
              onClick={() => handleUpdateTicket("COMPLETED")} 
              className="cursor-pointer text-xs gap-1.5 bg-primary text-white"
            >
              <Send className="h-3.5 w-3.5" /> Resolve &amp; Close Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}