// components/admin/DelegationPanel.tsx | Task: FE-004 | Reviewer delegation management panel
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserCog, Calendar, X } from "lucide-react"

interface DelegationPanelProps {
  currentDelegation: string | null
  delegatedBy: string | null
  onDelegate: (validUntil: string) => void
  onRevoke: () => void
  labels?: Record<string, string>
}

export function DelegationPanel({
  currentDelegation,
  delegatedBy,
  onDelegate,
  onRevoke,
  labels,
}: DelegationPanelProps) {
  const [validUntil, setValidUntil] = useState("")

  const isActive = currentDelegation && new Date(currentDelegation) > new Date()

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <UserCog className="h-4 w-4" />
          {labels?.title ?? "Reviewer Delegation"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isActive ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className="bg-purple-500/10 text-purple-600 border-purple-500/20"
              >
                {labels?.active ?? "Active Delegation"}
              </Badge>
              <Button size="sm" variant="ghost" onClick={onRevoke}>
                <X className="h-4 w-4 mr-1" />
                {labels?.revoke ?? "Revoke"}
              </Button>
            </div>
            <div className="text-sm space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {labels?.expiresAt ?? "Expires"}: {new Date(currentDelegation!).toLocaleString()}
              </div>
              {delegatedBy && (
                <p className="text-muted-foreground">
                  {labels?.delegatedBy ?? "Delegated by"}: {delegatedBy}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {labels?.noDelegation ?? "No active reviewer delegation"}
            </p>
            <div className="space-y-2">
              <Label>{labels?.validUntil ?? "Valid until"}</Label>
              <Input
                type="datetime-local"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <Button
              onClick={() => {
                if (validUntil) onDelegate(new Date(validUntil).toISOString())
              }}
              disabled={!validUntil}
              className="w-full"
            >
              <UserCog className="h-4 w-4 mr-2" />
              {labels?.delegate ?? "Delegate Reviewer Rights"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
