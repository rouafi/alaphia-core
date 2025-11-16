import { UploadCloud } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageHeader } from "@/components/ui/PageHeader"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const notificationSettings = [
  {
    label: "Weekly workspace digest",
    description: "Highlights, reviewer velocity, and AI insights.",
    key: "digest",
    enabled: true,
  },
  {
    label: "Contact mentions",
    description: "When a champion is tagged in a recording.",
    key: "mentions",
    enabled: true,
  },
  {
    label: "Billing reminders",
    description: "Invoices, usage alerts, and upgrades.",
    key: "billing",
    enabled: false,
  },
]

const formSections = [
  {
    title: "Profile identity",
    description: "Update how collaborators see you in recordings and comments.",
    fields: [
      { label: "Full name", value: "Reda Saad", type: "text" },
      { label: "Workspace role", value: "Product Design Lead", type: "text" },
      { label: "Email", value: "reda@claap.com", type: "email" },
    ],
  },
  {
    title: "Localization",
    description: "Control timezone and language for AI summaries.",
    fields: [
      { label: "Timezone", value: "GMT+1 · Paris", type: "text" },
      { label: "Language", value: "English (UK)", type: "text" },
    ],
  },
  {
    title: "Security",
    description: "Keep the workspace safe with approvals and multi-factor.",
    fields: [
      { label: "Password", value: "••••••••••", type: "password" },
      { label: "Backup email", value: "reda.backup@claap.com", type: "email" },
    ],
  },
]

export default function AccountSettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Account settings"
        description="Manage your Aphilia profile, workspace preferences, and secure notifications."
        actions={
          <Button className="bg-[#3B82F6] text-white hover:bg-[#3B82F6]/90">
            Save changes
          </Button>
        }
      />

      <div className="space-y-6">
        <Card className="p-0">
          <div className="flex flex-col gap-6 rounded-t-2xl bg-[#111827] p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-16 border border-white/10">
                <AvatarFallback className="bg-[#3B82F6]/20 text-xl text-white">
                  RS
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold text-white">Reda Saad</p>
                <p className="text-sm text-white/60">Workspace Admin · Aphilia</p>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/40">
                  Profile avatar
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm text-white/70">
              <p>Recommended: 400x400px PNG with transparent background.</p>
              <Button
                variant="outline"
                className="w-fit rounded-md border-white/10 bg-[#1F2937] text-white/90 hover:bg-white/5"
              >
                <UploadCloud className="mr-2 size-4" />
                Upload new avatar
              </Button>
            </div>
          </div>

          <Separator className="bg-white/5" />

          <form className="space-y-10 p-6">
            {formSections.map((section, sectionIndex) => (
              <div key={section.title} className="space-y-6">
                <div>
                  <p className="text-lg font-semibold text-white">
                    {section.title}
                  </p>
                  <p className="mt-1 text-sm text-white/60">
                    {section.description}
                  </p>
                </div>
                <div className="space-y-5">
                  {section.fields.map((field) => (
                    <div
                      key={field.label}
                      className="grid items-center gap-3 md:grid-cols-[220px_1fr]"
                    >
                      <Label className="text-sm font-medium text-white/70">
                        {field.label}
                      </Label>
                      <Input
                        defaultValue={field.value}
                        type={field.type}
                        className="rounded-md border border-white/10 bg-[#1F2937] text-white placeholder:text-white/40"
                      />
                    </div>
                  ))}
                </div>
                {sectionIndex < formSections.length - 1 && (
                  <Separator className="bg-white/5" />
                )}
              </div>
            ))}
          </form>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card
            title="Notifications"
            description="Aphilia pushes, email summaries, and mention alerts."
          >
            <div className="space-y-4">
              {notificationSettings.map((setting) => (
                <div
                  key={setting.key}
                  className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/5 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {setting.label}
                    </p>
                    <p className="text-xs text-white/60">
                      {setting.description}
                    </p>
                  </div>
                  <Switch defaultChecked={setting.enabled} />
                </div>
              ))}
            </div>
          </Card>

          <Card
            title="Billing overview"
            description="Workspace seat usage and current plan."
            padding="md"
            actions={
              <Button variant="ghost" className="text-white/70 hover:text-white">
                Manage plan
              </Button>
            }
          >
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-lg border border-white/5 px-3 py-2">
                <span>Plan</span>
                <span className="font-semibold text-white">Aphilia Pro</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/5 px-3 py-2">
                <span>Seats used</span>
                <span className="font-semibold text-white">18 / 20</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/5 px-3 py-2">
                <span>Next invoice</span>
                <span className="font-semibold text-white">Dec 28 · €420</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

