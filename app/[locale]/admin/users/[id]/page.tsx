// app/[locale]/admin/users/[id]/page.tsx | Task: FE-004 | Admin user detail page
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/locale-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RoleBadge } from "@/components/admin/RoleBadge"
import { DelegationPanel } from "@/components/admin/DelegationPanel"
import { ConfirmModal } from "@/components/judge/ConfirmModal"
import { ArrowLeft, Lock, Unlock, Save } from "lucide-react"
import * as adminApi from "@/lib/api/admin"
import type { AdminUserDetail, UpdateUserRequest } from "@/types/admin"

export default function AdminUserDetailPage() {
  const { getToken } = useAuth()
  const { locale, dictionary } = useTranslation()
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string
  const t = dictionary.admin?.users ?? {}

  const [user, setUser] = useState<AdminUserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [editForm, setEditForm] = useState<UpdateUserRequest>({})
  const [confirmLock, setConfirmLock] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken()
      if (!token) return
      try {
        const data = await adminApi.getUser(token, userId)
        setUser(data)
        setEditForm({ email: data.email, role: data.roles[0] })
      } catch {
        // handle error
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [getToken, userId])

  const handleSave = async () => {
    const token = getToken()
    if (!token || !user) return
    setSaving(true)
    try {
      const updated = await adminApi.updateUser(token, userId, editForm)
      setUser(updated)
    } catch {
      // handle error
    } finally {
      setSaving(false)
    }
  }

  const handleLockToggle = async () => {
    const token = getToken()
    if (!token || !user) return
    try {
      if (!user.isLocked) {
        await adminApi.lockUser(token, userId)
      } else {
        await adminApi.unlockUser(token, userId)
      }
      const updated = await adminApi.getUser(token, userId)
      setUser(updated)
      setConfirmLock(false)
    } catch {
      // handle error
    }
  }

  const handleDelegate = async (validUntil: string) => {
    const token = getToken()
    if (!token) return
    try {
      await adminApi.delegateReviewer(token, userId, { validUntil })
      const updated = await adminApi.getUser(token, userId)
      setUser(updated)
    } catch {
      // handle error
    }
  }

  const handleRevokeDelegation = async () => {
    const token = getToken()
    if (!token) return
    try {
      // Revoke by setting past date
      await adminApi.delegateReviewer(token, userId, { validUntil: new Date(0).toISOString() })
      const updated = await adminApi.getUser(token, userId)
      setUser(updated)
    } catch {
      // handle error
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </ProtectedRoute>
    )
  }

  if (!user) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <p>{t.notFound ?? "User not found"}</p>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push(`/${locale}/admin/users`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t.backToUsers ?? "Back to Users"}
        </Button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{user.userName}</h1>
            <p className="text-muted-foreground mt-1">{user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            {user.roles.map((role) => (
              <RoleBadge key={role} role={role} />
            ))}
            <Badge variant={!user.isLocked ? "outline" : "destructive"}>
              {!user.isLocked ? (t.active ?? "Active") : (t.locked ?? "Locked")}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle>{t.editProfile ?? "Edit Profile"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t.email ?? "Email"}</Label>
                <Input
                  value={editForm.email ?? ""}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.role ?? "Role"}</Label>
                <select
                  className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm"
                  value={editForm.role ?? ""}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                >
                  <option value="Judge">Judge</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? (t.saving ?? "Saving...") : (t.save ?? "Save")}
                </Button>
                <Button
                  variant={!user.isLocked ? "destructive" : "outline"}
                  onClick={() => setConfirmLock(true)}
                >
                  {!user.isLocked
                    ? <><Lock className="h-4 w-4 mr-2" />{t.lock ?? "Lock Account"}</>
                    : <><Unlock className="h-4 w-4 mr-2" />{t.unlock ?? "Unlock Account"}</>}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info + Delegation */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.accountInfo ?? "Account Info"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.createdAt ?? "Created"}</span>
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.lastLogin ?? "Last Login"}</span>
                  <span>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "–"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.updatedAt ?? "Updated"}</span>
                  <span>{new Date(user.updatedAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {user.roles.includes("Judge") && (
              <DelegationPanel
                currentDelegation={user.delegatedReviewerUntil}
                delegatedBy={user.delegatedBy}
                onDelegate={handleDelegate}
                onRevoke={handleRevokeDelegation}
                labels={t.delegation}
              />
            )}
          </div>
        </div>

        <ConfirmModal
          open={confirmLock}
          title={!user.isLocked ? (t.lockTitle ?? "Lock User?") : (t.unlockTitle ?? "Unlock User?")}
          message={!user.isLocked
            ? (t.lockMessage ?? "This user will be unable to log in.")
            : (t.unlockMessage ?? "This user will be able to log in again.")}
          danger={!user.isLocked}
          onConfirm={handleLockToggle}
          onCancel={() => setConfirmLock(false)}
        />
      </div>
    </ProtectedRoute>
  )
}
