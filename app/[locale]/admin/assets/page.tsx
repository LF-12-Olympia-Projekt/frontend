// app/[locale]/admin/assets/page.tsx | Task: FE-004 | Admin medal asset management page
"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/locale-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, Image, CheckCircle } from "lucide-react"
import * as adminApi from "@/lib/api/admin"
import type { MedalAssetInfo } from "@/types/admin"

const medalColors: Record<string, string> = {
  gold: "text-yellow-500",
  silver: "text-gray-400",
  bronze: "text-amber-700",
}

export default function AdminAssetsPage() {
  const { getToken } = useAuth()
  const { dictionary } = useTranslation()
  const t = dictionary.admin?.assets ?? {}

  const [assets, setAssets] = useState<MedalAssetInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const fetchAssets = useCallback(async () => {
    const token = getToken()
    if (!token) return
    try {
      const data = await adminApi.getMedalAssets(token)
      setAssets(data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

  const handleUpload = async (type: string, file: File) => {
    const token = getToken()
    if (!token) return
    setUploading(type)
    try {
      await adminApi.updateMedalAsset(token, type, file)
      fetchAssets()
    } catch {
      // handle
    } finally {
      setUploading(null)
    }
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{t.title ?? "Medal Assets"}</h1>
          <p className="text-muted-foreground mt-1">{t.subtitle ?? "Manage medal SVG assets"}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-3">
            {assets.map((asset) => (
              <Card key={asset.type}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-lg capitalize ${medalColors[asset.type] ?? ""}`}>
                    {asset.type} {t.medal ?? "Medal"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* SVG Preview */}
                  <div className="h-32 border rounded-lg flex items-center justify-center bg-muted/30">
                    {asset.exists ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${asset.url}`}
                        alt={`${asset.type} medal`}
                        className="h-24 w-24 object-contain"
                      />
                    ) : (
                      <Image className="h-12 w-12 text-muted-foreground/30" />
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant={asset.exists ? "outline" : "secondary"}>
                      {asset.exists
                        ? <><CheckCircle className="h-3 w-3 mr-1" />{t.uploaded ?? "Uploaded"}</>
                        : (t.missing ?? "Missing")}
                    </Badge>
                    {asset.hasBackup && (
                      <span className="text-xs text-muted-foreground">{t.backupAvailable ?? "Backup available"}</span>
                    )}
                  </div>

                  {asset.lastModified && (
                    <p className="text-xs text-muted-foreground">
                      {t.lastModified ?? "Last modified"}: {new Date(asset.lastModified).toLocaleDateString()}
                    </p>
                  )}

                  {/* Upload */}
                  <input
                    type="file"
                    accept=".svg"
                    className="hidden"
                    ref={(el) => { fileInputRefs.current[asset.type] = el }}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleUpload(asset.type, file)
                    }}
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => fileInputRefs.current[asset.type]?.click()}
                    disabled={uploading === asset.type}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading === asset.type
                      ? (t.uploading ?? "Uploading...")
                      : (t.replace ?? "Replace SVG")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
