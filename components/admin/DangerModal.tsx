// components/admin/DangerModal.tsx | Task: FE-004 | High-stakes confirmation modal with typed confirm
"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface DangerModalProps {
  open: boolean
  title: string
  message: string
  confirmPhrase?: string
  requireReason?: boolean
  reasonLabel?: string
  reasonMinLength?: number
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: (reason?: string) => void
  onCancel: () => void
}

export function DangerModal({
  open,
  title,
  message,
  confirmPhrase = "CONFIRM",
  requireReason = false,
  reasonLabel = "Reason",
  reasonMinLength = 0,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: DangerModalProps) {
  const [typed, setTyped] = useState("")
  const [reason, setReason] = useState("")

  const phraseValid = typed === confirmPhrase
  const reasonValid = !requireReason || reason.length >= reasonMinLength

  const handleConfirm = () => {
    if (phraseValid && reasonValid) {
      onConfirm(requireReason ? reason : undefined)
      setTyped("")
      setReason("")
    }
  }

  const handleCancel = () => {
    setTyped("")
    setReason("")
    onCancel()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {requireReason && (
            <div className="space-y-2">
              <Label>{reasonLabel} {reasonMinLength > 0 && `(min. ${reasonMinLength} characters)`}</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={reasonLabel}
                className="min-h-[80px]"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label>Type <span className="font-mono font-bold text-red-600">{confirmPhrase}</span> to confirm</Label>
            <Input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={confirmPhrase}
              className="font-mono"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!phraseValid || !reasonValid}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
