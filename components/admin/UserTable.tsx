// components/admin/UserTable.tsx | Task: FE-004 | Paginated admin user table
"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RoleBadge } from "./RoleBadge"
import { Lock, Unlock, Eye, UserCog, Trash2 } from "lucide-react"
import type { AdminUserListItem } from "@/types/admin"

interface UserTableProps {
  users: AdminUserListItem[]
  onView: (user: AdminUserListItem) => void
  onLock: (user: AdminUserListItem) => void
  onUnlock: (user: AdminUserListItem) => void
  onDelete: (user: AdminUserListItem) => void
  labels?: Record<string, string>
}

export function UserTable({ users, onView, onLock, onUnlock, onDelete, labels }: UserTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{labels?.username ?? "Username"}</TableHead>
          <TableHead>{labels?.email ?? "Email"}</TableHead>
          <TableHead>{labels?.role ?? "Role"}</TableHead>
          <TableHead>{labels?.status ?? "Status"}</TableHead>
          <TableHead>{labels?.lastLogin ?? "Last Login"}</TableHead>
          <TableHead>{labels?.delegation ?? "Delegation"}</TableHead>
          <TableHead className="text-right">{labels?.actions ?? "Actions"}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.userName}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              {user.roles.map((role) => (
                <RoleBadge key={role} role={role} className="mr-1" />
              ))}
            </TableCell>
            <TableCell>
              <Badge variant={!user.isLocked ? "outline" : "destructive"}>
                {!user.isLocked
                  ? (labels?.active ?? "Active")
                  : (labels?.locked ?? "Locked")}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {user.lastLogin
                ? new Date(user.lastLogin).toLocaleDateString()
                : "–"}
            </TableCell>
            <TableCell className="text-sm">
              {user.delegatedReviewerUntil
                ? (
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                    <UserCog className="h-3 w-3 mr-1" />
                    {new Date(user.delegatedReviewerUntil).toLocaleDateString()}
                  </Badge>
                )
                : "–"}
            </TableCell>
            <TableCell className="text-right space-x-1">
              <Button size="sm" variant="ghost" onClick={() => onView(user)} title={labels?.view ?? "View"}>
                <Eye className="h-4 w-4" />
              </Button>
              {!user.isLocked ? (
                <Button size="sm" variant="ghost" onClick={() => onLock(user)} title={labels?.lock ?? "Lock"}>
                  <Lock className="h-4 w-4" />
                </Button>
              ) : (
                <Button size="sm" variant="ghost" onClick={() => onUnlock(user)} title={labels?.unlock ?? "Unlock"}>
                  <Unlock className="h-4 w-4" />
                </Button>
              )}
              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => onDelete(user)} title={labels?.delete ?? "Delete"}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
