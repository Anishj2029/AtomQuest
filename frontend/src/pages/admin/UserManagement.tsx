import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { SearchBar } from "@/components/shared/SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { usersApi, authApi, type ApiUser } from "@/lib/api";
import { UserPlus } from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ApiUser | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("employee");
  const [department, setDepartment] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchUsers = () => {
    setLoading(true);
    usersApi.list().then(setUsers).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAdd = () => {
    setEditingUser(null);
    setName("");
    setEmail("");
    setRole("employee");
    setDepartment("");
    setDialogOpen(true);
  };

  const openEdit = (u: ApiUser) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
    setDepartment(u.department || "");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingUser) {
        await usersApi.update(editingUser._id, { name, role: role as never, department });
        toast({ title: "User updated", variant: "success" });
      } else {
        await authApi.register({ name, email, password: "password123", role, department });
        toast({ title: "User created", description: "Default password is password123", variant: "success" });
      }
      setDialogOpen(false);
      fetchUsers();
    } catch (e: unknown) {
      toast({ title: "Save failed", description: (e as Error).message, variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { key: "name", header: "Name", cell: (u: ApiUser) => <span className="font-medium">{u.name}</span> },
    { key: "email", header: "Email", cell: (u: ApiUser) => u.email },
    { key: "role", header: "Role", cell: (u: ApiUser) => <span className="capitalize">{u.role}</span> },
    { key: "dept", header: "Department", cell: (u: ApiUser) => u.department || "—" },
    {
      key: "status",
      header: "Status",
      cell: (u: ApiUser) => (
        <Badge variant={u.isActive ? "success" : "neutral"}>{u.isActive ? "Active" : "Inactive"}</Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (u: ApiUser) => <Button variant="ghost" size="sm" onClick={() => openEdit(u)}>Edit</Button>,
    },
  ];

  return (
    <>
      <PageHeader
        title="User Management"
        description="Manage employees, managers, and administrators"
        actions={<Button onClick={openAdd}><UserPlus className="h-4 w-4" /> Add user</Button>}
      />
      <SearchBar value={search} onChange={setSearch} className="mb-6 max-w-sm" />
      <DataTable columns={columns} data={filtered.map((u) => ({ ...u, id: u._id }))} loading={loading} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} disabled={!!editingUser} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={role}
                onValueChange={setRole}
                options={[
                  { value: "employee", label: "Employee" },
                  { value: "manager", label: "Manager" },
                  { value: "admin", label: "Admin" },
                ]}
              />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Input value={department} onChange={(e) => setDepartment(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !name || !email}>{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
