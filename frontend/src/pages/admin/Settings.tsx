import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import * as React from "react";

export default function Settings() {
  const { toast } = useToast();
  const [cycleDuration, setCycleDuration] = React.useState("quarterly");
  return (
    <>
      <PageHeader title="Settings" description="Configure portal preferences and policies" />
      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader><CardTitle>Goal policies</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Maximum goals per employee</Label>
              <Input type="number" defaultValue={8} />
            </div>
            <div className="space-y-2">
              <Label>Default cycle duration</Label>
              <Select
                value={cycleDuration}
                onValueChange={setCycleDuration}
                options={[
                  { value: "quarterly", label: "Quarterly" },
                  { value: "biannual", label: "Bi-annual" },
                  { value: "annual", label: "Annual" },
                ]}
              />
            </div>
            <Button onClick={() => toast({ title: "Settings saved", variant: "success" })}>Save</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
