import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/toast";
import { usersApi } from "@/lib/api";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName]   = useState(user?.name ?? "");
  const [title, setTitle] = useState(user?.title ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await usersApi.update(user._id, { name, title });
      toast({ title: "Profile updated", variant: "success" });
    } catch (e: unknown) {
      toast({ title: "Update failed", description: (e as Error).message, variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader title="Profile" description="Manage your account settings" />
      <Card className="max-w-xl">
        <CardHeader><CardTitle>Personal information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Full name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email ?? ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>Department</Label>
            <Input value={user?.department ?? ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>Job title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
