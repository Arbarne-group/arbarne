"use client";

import { useState, useEffect, useCallback } from "react";
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
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, Search, Trash2, Eye } from "lucide-react";

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

export function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedUser, setSelectedUser] = useState<any | null>(null); // For View Details
  const [isAddOpen, setIsAddOpen] = useState(false);                  // For Add User

  // Add user form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newBusiness, setNewBusiness] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [formMsg, setFormMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.set("search", search);
      const res = await fetch(`/api/admin/users?${q.toString()}`);
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    setFormMsg("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          businessName: newBusiness,
          location: newLocation,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormMsg(data.error || "Failed to add user.");
        return;
      }
      setFormMsg("User added successfully!");
      setNewName("");
      setNewEmail("");
      setNewBusiness("");
      setNewLocation("");
      setIsAddOpen(false);
      load();
    } catch (err) {
      setFormMsg("An error occurred.");
    }
  }

  async function handleDeleteUser(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        alert(d.error || "Could not delete user.");
        return;
      }
      load();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top bar: Search & Add User Button */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search business name, user name, or email…"
            className="pl-9 w-full"
          />
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" /> Add New User
        </Button>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading users…</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Business Name</TableHead>
                <TableHead>User Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">
                    {u.businessName || <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">{u.name}</div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {u.location || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.accountStatus === "ACTIVE" || !u.accountStatus ? "default" : "secondary"}>
                      {u.accountStatus || "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {fmtDate(u.createdAt)}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedUser(u)}
                      className="h-8 px-2 text-xs"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" /> View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(u.id)}
                      className="h-8 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* View Details Modal */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Detailed account and business information.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-3 text-sm py-2">
              <div className="grid grid-cols-3 gap-1">
                <span className="font-semibold text-muted-foreground">User Name:</span>
                <span className="col-span-2 text-foreground font-medium">{selectedUser.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="font-semibold text-muted-foreground">Email:</span>
                <span className="col-span-2 text-foreground">{selectedUser.email}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="font-semibold text-muted-foreground">Business:</span>
                <span className="col-span-2 text-foreground">{selectedUser.businessName || "—"}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="font-semibold text-muted-foreground">Location:</span>
                <span className="col-span-2 text-foreground">{selectedUser.location || "—"}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="font-semibold text-muted-foreground">Status:</span>
                <span className="col-span-2 text-foreground">{selectedUser.accountStatus || "Active"}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="font-semibold text-muted-foreground">Joined:</span>
                <span className="col-span-2 text-foreground">{fmtDate(selectedUser.createdAt)}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUser(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user profile manually in the system.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">User Name</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                placeholder="Full Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                placeholder="user@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business">Business Name</Label>
              <Input
                id="business"
                value={newBusiness}
                onChange={(e) => setNewBusiness(e.target.value)}
                placeholder="Company / Farm Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="City / Region"
              />
            </div>
            {formMsg && <p className="text-xs font-semibold text-destructive">{formMsg}</p>}
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}