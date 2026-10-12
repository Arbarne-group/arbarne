"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Wallet, 
  Headphones, 
  ShieldCheck, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  RefreshCw,
  BarChart3,
  ChevronRight
} from "lucide-react";

// Localized Currency Formatter
function fmtCurrency(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function Dashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-card p-6 md:p-8 rounded-3xl border border-border shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Future Farms Admin Desk</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Platform Command Center
          </h1>
          <p className="text-sm text-muted-foreground">
            Real-time operational summary across farm accounts, billing, support tickets, and framework assessments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/a/users">
            <Button className="gap-2 shadow-xs cursor-pointer">
              <Plus className="h-4 w-4" /> Add User
            </Button>
          </Link>
          <Link href="/a/support">
            <Button variant="outline" className="gap-2 cursor-pointer">
              <Headphones className="h-4 w-4" /> Open Tickets
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Level Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Users */}
        <Link href="/a/users" className="group">
          <div className="rounded-2xl border bg-card p-5 shadow-xs transition-all hover:shadow-md hover:border-primary/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Farm Accounts</span>
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-foreground">152 Users</h3>
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="h-3.5 w-3.5" /> +12 new this month
              </p>
            </div>
          </div>
        </Link>

        {/* Metric 2: MTD Revenue */}
        <Link href="/a/billing" className="group">
          <div className="rounded-2xl border bg-card p-5 shadow-xs transition-all hover:shadow-md hover:border-primary/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Revenue (MTD)</span>
              <div className="h-10 w-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center group-hover:scale-105 transition-transform">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-foreground">{fmtCurrency(108700)}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                38 M-Pesa • 4 Cards
              </p>
            </div>
          </div>
        </Link>

        {/* Metric 3: Active Support Tickets */}
        <Link href="/a/support" className="group">
          <div className="rounded-2xl border bg-card p-5 shadow-xs transition-all hover:shadow-md hover:border-primary/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Action Tickets</span>
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Headphones className="h-5 w-5" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-foreground">2 Open</h3>
              <p className="text-xs text-amber-600 font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="h-3.5 w-3.5" /> 1 High Urgency
              </p>
            </div>
          </div>
        </Link>

        {/* Metric 4: Framework Maturity Score */}
        <Link href="/a/assessments" className="group">
          <div className="rounded-2xl border bg-card p-5 shadow-xs transition-all hover:shadow-md hover:border-primary/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Avg Pillar Score</span>
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-foreground">62.6 / 100</h3>
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <BarChart3 className="h-3.5 w-3.5" /> 148 Audits Completed
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Content Grid: Recent Activity & Action Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols): Pending Tickets & Recent Billing */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Urgent Support Tickets Module */}
          <div className="rounded-3xl border bg-card shadow-xs overflow-hidden">
            <div className="p-5 border-b flex justify-between items-center">
              <div>
                <h3 className="text-base font-extrabold text-foreground">Recent Service &amp; Field Requests</h3>
                <p className="text-xs text-muted-foreground">Dispatched agronomists, lab tests, and diagnostics</p>
              </div>
              <Link href="/a/support" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                View All <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-border/40 text-xs">
              <div className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-primary">#SRV-2026-090</span>
                    <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/30">
                      High Urgency
                    </Badge>
                  </div>
                  <p className="font-semibold text-foreground">On-Farm Agronomist Inspection</p>
                  <p className="text-muted-foreground">Rift Valley Organics • Brian Kiprop (Naivasha)</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="gap-1 mb-1">
                    <Clock className="h-3 w-3" /> PENDING
                  </Badge>
                  <p className="text-muted-foreground text-[10px]">Requested Today</p>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-primary">#SRV-2026-089</span>
                    <Badge variant="outline" className="text-[10px] text-blue-600 border-blue-500/30">
                      Normal Urgency
                    </Badge>
                  </div>
                  <p className="font-semibold text-foreground">Lab Soil &amp; Irrigation Water Analysis</p>
                  <p className="text-muted-foreground">GreenValley Farms Ltd • Alice Wanjiku (Kiambu)</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-blue-500/10 text-blue-600 gap-1 mb-1">
                    <AlertCircle className="h-3 w-3" /> IN PROGRESS
                  </Badge>
                  <p className="text-muted-foreground text-[10px]">Assigned: Dr. E. Muthoni</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions Module */}
          <div className="rounded-3xl border bg-card shadow-xs overflow-hidden">
            <div className="p-5 border-b flex justify-between items-center">
              <div>
                <h3 className="text-base font-extrabold text-foreground">Recent Transactions</h3>
                <p className="text-xs text-muted-foreground">Latest subscription renewals and payment gateway logs</p>
              </div>
              <Link href="/a/billing" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                View All <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-border/40 text-xs">
              <div className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="space-y-1">
                  <p className="font-bold text-foreground">GreenValley Farms Ltd</p>
                  <p className="text-muted-foreground">Enterprise Tier • M-Pesa Express</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-foreground text-sm">{fmtCurrency(38500)}</p>
                  <span className="text-[10px] font-semibold text-emerald-600">Successful</span>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="space-y-1">
                  <p className="font-bold text-foreground">Rift Valley Organics</p>
                  <p className="text-muted-foreground">Growth Plan • Visa (•••• 4242)</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-foreground text-sm">{fmtCurrency(15400)}</p>
                  <span className="text-[10px] font-semibold text-emerald-600">Successful</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (1 col): 8-Pillar Status & Quick Navigation */}
        <div className="space-y-6">

          {/* 8-Pillar Framework Benchmark Progress */}
          <div className="rounded-3xl border bg-card p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-foreground">Framework Cadence</h3>
              <p className="text-xs text-muted-foreground">90-Day re-assessment readiness across farm network</p>
            </div>

            <div className="bg-muted/40 p-4 rounded-2xl border space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">Re-assessment Eligible</span>
                <span className="font-bold text-emerald-600">12 Farms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">Locked (In 90-day window)</span>
                <span className="font-bold text-amber-600">136 Farms</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "8%" }} />
              </div>
            </div>

            <Link href="/a/assessments">
              <Button variant="outline" className="w-full text-xs font-semibold cursor-pointer gap-1.5 mt-2">
                <RefreshCw className="h-3.5 w-3.5" /> Manage Assessment Overrides
              </Button>
            </Link>
          </div>

          {/* Quick Action Navigation Card */}
          <div className="rounded-3xl border bg-card p-6 shadow-xs space-y-3">
            <h3 className="text-base font-extrabold text-foreground">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/a/users" className="block">
                <div className="p-3 rounded-xl border hover:bg-muted/50 transition-colors flex justify-between items-center text-xs font-semibold text-foreground">
                  <span>Manage Accounts</span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
              <Link href="/a/billing" className="block">
                <div className="p-3 rounded-xl border hover:bg-muted/50 transition-colors flex justify-between items-center text-xs font-semibold text-foreground">
                  <span>View Revenue Statements</span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
              <Link href="/a/support" className="block">
                <div className="p-3 rounded-xl border hover:bg-muted/50 transition-colors flex justify-between items-center text-xs font-semibold text-foreground">
                  <span>Dispatch Field Specialists</span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}