// components/judge/ProtestModal.tsx | Task: FE-003 | Modal for filing protests with reason textarea
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

interface ProtestModalProps {
  open: boolean
  title?: string
  message?: string
  placeholder?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: (reason: string) => void
  onCancel: () => void
}

export function ProtestModal({
  open,
  title = "File Protest",
  message = "Please provide the reason for your protest (max. 1000 characters).",
  placeholder = "Enter reason...",
  confirmLabel = "Submit Protest",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ProtestModalProps) {
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
          onChange={(e) => setReason(e.target.value.slice(0, 1000))}
          placeholder={placeholder}
          rows={4}
          className="resize-none"
        />
        <div className="text-xs text-muted-foreground text-right">
          {reason.length}/1000
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {cancelLabel}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
