// components/judge/InvalidateModal.tsx | Task: FE-003 | Modal for invalidating results with reason
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
import { Textarea } from "@/components/ui/textarea"

interface InvalidateModalProps {
  open: boolean
  title?: string
  message?: string
  placeholder?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: (reason: string) => void
  onCancel: () => void
}

export function InvalidateModal({
  open,
  title = "Invalidate Result",
  message = "Please provide the reason for invalidation.",
  placeholder = "Enter reason...",
  confirmLabel = "Invalidate",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: InvalidateModalProps) {
  const [reason, setReason] = useState("")

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason.trim())
      setReason("")
    }
  }

  const handleCancel = () => {
    setReason("")
    onCancel()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="resize-none"
        />
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {cancelLabel}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!reason.trim()}
            variant="destructive"
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
