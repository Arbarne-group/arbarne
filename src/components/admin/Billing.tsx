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
  Download, 
  Eye, 
  CreditCard, 
  Wallet, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowUpRight,
  Receipt
} from "lucide-react";

// Realistic dummy data using KES and M-Pesa / Card gateways
const INITIAL_TRANSACTIONS = [
  {
    id: "TRX-98234",
    businessName: "GreenValley Farms Ltd",
    userName: "Alice Wanjiku",
    email: "alice@greenvalley.com",
    plan: "Enterprise Tier",
    amount: 38500,
    status: "SUCCESSFUL",
    date: "2026-10-12T10:30:00Z",
    paymentMethod: "M-Pesa",
    channelDetails: "MPESA Express (254712***890)",
  },
  {
    id: "TRX-98233",
    businessName: "Rift Valley Organics",
    userName: "Brian Kiprop",
    email: "brian@riftorganics.co.ke",
    plan: "Growth Plan",
    amount: 15400,
    status: "SUCCESSFUL",
    date: "2026-10-11T16:15:00Z",
    paymentMethod: "Card",
    channelDetails: "Visa/Mastercard (•••• 4242)",
  },
  {
    id: "TRX-98232",
    businessName: "Highland Dairy Co.",
    userName: "Mercy Chebet",
    email: "mercy@highlanddairy.com",
    plan: "Pro Plan",
    amount: 10500,
    status: "PENDING",
    date: "2026-10-11T09:45:00Z",
    paymentMethod: "M-Pesa",
    channelDetails: "Paybill STK Push (254733***112)",
  },
  {
    id: "TRX-98231",
    businessName: "Sunbelt Produce",
    userName: "John Odhiambo",
    email: "john@sunbelt.org",
    plan: "Starter Plan",
    amount: 5800,
    status: "FAILED",
    date: "2026-10-10T14:20:00Z",
    paymentMethod: "Card",
    channelDetails: "Mastercard (•••• 8810)",
  },
  {
    id: "TRX-98230",
    businessName: "Savannah Agro",
    userName: "Esther Muthoni",
    email: "esther@savannahagro.com",
    plan: "Enterprise Tier",
    amount: 38500,
    status: "SUCCESSFUL",
    date: "2026-10-09T08:10:00Z",
    paymentMethod: "M-Pesa",
    channelDetails: "MPESA Express (254722***456)",
  },
];

function fmtCurrency(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

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

export default function AdminBillingPage() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [search, setSearch] = useState("");
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  const filteredTransactions = transactions.filter((tx) => 
    tx.businessName.toLowerCase().includes(search.toLowerCase()) ||
    tx.userName.toLowerCase().includes(search.toLowerCase()) ||
    tx.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            Billing & Transactions
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor revenue streams, active platform subscriptions, and paymentgateway logs.
          </p>
        </div>
        <Button className="gap-2 shadow-xs cursor-pointer">
          <Download className="h-4 w-4" /> Export CSV Report
        </Button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border bg-card p-5 shadow-xs flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Revenue (MTD)</p>
            <h3 className="text-2xl font-black text-foreground">{fmtCurrency(108700)}</h3>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 gap-1 pt-1">
              <TrendingUp className="h-3.5 w-3.5" /> +14.2% from last month
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Wallet className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-xs flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Subscriptions</p>
            <h3 className="text-2xl font-black text-foreground">42 Accounts</h3>
            <span className="inline-flex items-center text-xs font-semibold text-muted-foreground gap-1 pt-1">
              38 M-Pesa • 4 Cards
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
            <CreditCard className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-xs flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pending Paybills</p>
            <h3 className="text-2xl font-black text-foreground">3 Invoices</h3>
            <span className="inline-flex items-center text-xs font-semibold text-amber-600 gap-1 pt-1">
              Awaiting STK confirmation
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Clock className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-card p-4 rounded-2xl border shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by business name, user, or transaction code (e.g. TRX-98234)…"
            className="pl-10 w-full"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="px-5 font-bold">Transaction ID</TableHead>
              <TableHead className="px-5 font-bold">Business & User</TableHead>
              <TableHead className="px-5 font-bold">Channel</TableHead>
              
              <TableHead className="px-5 font-bold">Amount</TableHead>
              <TableHead className="px-5 font-bold">Status</TableHead>
              <TableHead className="px-5 font-bold">Date</TableHead>
              <TableHead className="px-5 font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border/40">
            {filteredTransactions.map((tx) => (
              <TableRow key={tx.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="px-5 font-mono text-xs font-bold text-foreground">
                  {tx.id}
                </TableCell>
                <TableCell className="px-5">
                  <div className="font-semibold text-foreground">{tx.businessName}</div>
                  <div className="text-xs text-muted-foreground">{tx.userName}</div>
                </TableCell>
                <TableCell className="px-5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    tx.paymentMethod === "M-Pesa" 
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" 
                      : "bg-blue-500/10 text-blue-700 dark:text-blue-400"
                  }`}>
                    {tx.paymentMethod === "M-Pesa" ? <Wallet className="h-3 w-3" /> : <CreditCard className="h-3 w-3" />}
                    {tx.paymentMethod}
                  </span>
                </TableCell>
                
                <TableCell className="px-5 font-black text-foreground">
                  {fmtCurrency(tx.amount)}
                </TableCell>
                <TableCell className="px-5">
                  <Badge 
                    variant={
                      tx.status === "SUCCESSFUL" ? "default" : 
                      tx.status === "PENDING" ? "secondary" : "destructive"
                    }
                    className="gap-1.5 font-semibold"
                  >
                    {tx.status === "SUCCESSFUL" && <CheckCircle2 className="h-3 w-3" />}
                    {tx.status === "PENDING" && <Clock className="h-3 w-3" />}
                    {tx.status === "FAILED" && <AlertCircle className="h-3 w-3" />}
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-5 text-xs text-muted-foreground">
                  {fmtDate(tx.date)}
                </TableCell>
                <TableCell className="px-5 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTx(tx)}
                    className="h-8 px-2.5 text-xs cursor-pointer font-semibold"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" /> View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredTransactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-28 text-center text-muted-foreground">
                  No matching billing transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Transaction Details Receipt Modal */}
      <Dialog open={!!selectedTx} onOpenChange={(open) => !open && setSelectedTx(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary mb-1">
              <Receipt className="h-5 w-5" />
              <DialogTitle className="text-lg font-bold">Transaction Receipt</DialogTitle>
            </div>
            <DialogDescription>Gateway verification info and audit trail.</DialogDescription>
          </DialogHeader>
          {selectedTx && (
            <div className="space-y-4 text-sm py-2">
              <div className="bg-muted/50 p-4 rounded-2xl space-y-3 border border-border/60">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Reference ID:</span>
                  <span className="font-mono font-bold text-foreground">{selectedTx.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-xs">Total Amount:</span>
                  <span className="font-black text-foreground text-lg">{fmtCurrency(selectedTx.amount)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Payment Status:</span>
                  <span className="font-bold text-foreground">{selectedTx.status}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs px-1">
                <p className="flex justify-between"><strong className="text-muted-foreground">Business Name:</strong> <span className="text-foreground font-semibold">{selectedTx.businessName}</span></p>
                <p className="flex justify-between"><strong className="text-muted-foreground">Account User:</strong> <span className="text-foreground">{selectedTx.userName} ({selectedTx.email})</span></p>
                <p className="flex justify-between"><strong className="text-muted-foreground">Subscription Tier:</strong> <span className="text-foreground">{selectedTx.plan}</span></p>
                <p className="flex justify-between"><strong className="text-muted-foreground">Gateway Channel:</strong> <span className="text-foreground">{selectedTx.paymentMethod}</span></p>
                <p className="flex justify-between"><strong className="text-muted-foreground">Channel Metadata:</strong> <span className="font-mono text-foreground">{selectedTx.channelDetails}</span></p>
                <p className="flex justify-between"><strong className="text-muted-foreground">Timestamp:</strong> <span className="text-foreground">{fmtDate(selectedTx.date)}</span></p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button variant="outline" onClick={() => alert("PDF receipt download started...")} className="cursor-pointer">
              Download PDF
            </Button>
            <Button onClick={() => setSelectedTx(null)} className="cursor-pointer">
              Close Window
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}