// app/[locale]/admin/users/page.tsx | Task: FE-004 | Admin user management page
"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/locale-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { UserTable } from "@/components/admin/UserTable"
import { ConfirmModal } from "@/components/judge/ConfirmModal"
import { UserPlus } from "lucide-react"
import * as adminApi from "@/lib/api/admin"
import type { AdminUserListItem, CreateUserRequest } from "@/types/admin"

export default function AdminUsersPage() {
  const { getToken } = useAuth()
  const { locale, dictionary } = useTranslation()
  const router = useRouter()
  const t = dictionary.admin?.users ?? {}

  const [users, setUsers] = useState<AdminUserListItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [roleFilter, setRoleFilter] = useState<string>("")
  const [loading, setLoading] = useState(true)

  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState<CreateUserRequest>({
    userName: "",
    email: "",
    role: "Judge",
    temporaryPassword: "",
  })

  const [confirmAction, setConfirmAction] = useState<{
    user: AdminUserListItem
    action: "lock" | "unlock"
  } | null>(null)

  const fetchUsers = useCallback(async () => {
    const token = getToken()
    if (!token) return
    setLoading(true)
    try {
      const res = await adminApi.getUsers(token, {
        role: roleFilter || undefined,
        page,
        pageSize: 20,
      })
      setUsers(res.data)
      setTotal(res.total)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [getToken, page, roleFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleCreate = async () => {
    const token = getToken()
    if (!token) return
    try {
      await adminApi.createUser(token, createForm)
      setShowCreate(false)
      setCreateForm({ userName: "", email: "", role: "Judge", temporaryPassword: "" })
      fetchUsers()
    } catch {
      // handle error
    }
  }

  const handleLockUnlock = async () => {
    if (!confirmAction) return
    const token = getToken()
    if (!token) return
    try {
      if (confirmAction.action === "lock") {
        await adminApi.lockUser(token, confirmAction.user.id)
      } else {
        await adminApi.unlockUser(token, confirmAction.user.id)
      }
      setConfirmAction(null)
      fetchUsers()
    } catch {
      // handle error
    }
  }

  const roleOptions = ["", "Admin", "Judge"]

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t.title ?? "User Management"}</h1>
            <p className="text-muted-foreground mt-1">{t.subtitle ?? "Manage system users"}</p>
          </div>
          <Button onClick={() => setShowCreate(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            {t.createUser ?? "Create User"}
          </Button>
        </div>

        <div className="flex gap-2 mb-4">
          {roleOptions.map((role) => (
            <Button
              key={role || "all"}
              variant={roleFilter === role ? "default" : "outline"}
              size="sm"
              onClick={() => { setRoleFilter(role); setPage(1) }}
            >
              {role || (t.allRoles ?? "All")}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            <UserTable
              users={users}
              onView={(u) => router.push(`/${locale}/admin/users/${u.id}`)}
              onLock={(u) => setConfirmAction({ user: u, action: "lock" })}
              onUnlock={(u) => setConfirmAction({ user: u, action: "unlock" })}
              labels={t.table}
            />
            {total > 20 && (
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  ←
                </Button>
                <span className="text-sm py-2">
                  {page} / {Math.ceil(total / 20)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= Math.ceil(total / 20)}
                  onClick={() => setPage(page + 1)}
                >
                  →
                </Button>
              </div>
            )}
          </>
        )}

        {/* Create User Modal */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t.createUser ?? "Create User"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t.username ?? "Username"}</Label>
                <Input
                  value={createForm.userName}
                  onChange={(e) => setCreateForm({ ...createForm, userName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.email ?? "Email"}</Label>
                <Input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.role ?? "Role"}</Label>
                <select
                  className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm"
                  value={createForm.role}
                  onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                >
                  <option value="Judge">Judge</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>{t.temporaryPassword ?? "Temporary Password"}</Label>
                <Input
                  type="password"
                  value={createForm.temporaryPassword}
                  onChange={(e) => setCreateForm({ ...createForm, temporaryPassword: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreate(false)}>
                {t.cancel ?? "Cancel"}
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!createForm.userName || !createForm.email || !createForm.temporaryPassword}
              >
                {t.create ?? "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Lock/Unlock Confirmation */}
        <ConfirmModal
          open={!!confirmAction}
          title={confirmAction?.action === "lock"
            ? (t.lockTitle ?? "Lock User?")
            : (t.unlockTitle ?? "Unlock User?")}
          message={confirmAction?.action === "lock"
            ? (t.lockMessage ?? `Lock account for ${confirmAction?.user.userName}? They will be unable to log in.`)
            : (t.unlockMessage ?? `Unlock account for ${confirmAction?.user.userName}?`)}
          danger={confirmAction?.action === "lock"}
          confirmLabel={confirmAction?.action === "lock" ? (t.lock ?? "Lock") : (t.unlock ?? "Unlock")}
          onConfirm={handleLockUnlock}
          onCancel={() => setConfirmAction(null)}
        />
      </div>
    </ProtectedRoute>
  )
}
