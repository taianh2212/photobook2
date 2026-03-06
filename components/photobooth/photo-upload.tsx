"use client"

import React from "react"

import { useState, useCallback, useRef } from "react"
import type { CapturedPhoto } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Upload, X, ImagePlus, ArrowLeft } from "lucide-react"

interface PhotoUploadProps {
  onComplete: (photos: CapturedPhoto[]) => void
  onBack: () => void
  maxPhotos?: number
}

export function PhotoUpload({ onComplete, onBack, maxPhotos = 8 }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<CapturedPhoto[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    (files: FileList) => {
      const remaining = maxPhotos - photos.length
      const filesToProcess = Array.from(files).slice(0, remaining)

      for (const file of filesToProcess) {
        if (!file.type.startsWith("image/")) continue
        const reader = new FileReader()
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string
          setPhotos((prev) => {
            if (prev.length >= maxPhotos) return prev
            return [
              ...prev,
              {
                id: `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                dataUrl,
                timestamp: Date.now(),
              },
            ]
          })
        }
        reader.readAsDataURL(file)
      }
    },
    [photos.length, maxPhotos]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const removePhoto = useCallback((id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-4 w-full">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lai
        </Button>
        <h2 className="text-xl font-semibold text-foreground">Tai anh len</h2>
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="w-full border-2 border-dashed border-border rounded-xl p-12 flex flex-col items-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-secondary/50 transition-colors"
        role="button"
        tabIndex={0}
        aria-label="Khu vuc keo tha anh"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click()
        }}
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Upload className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-foreground font-medium">Keo tha anh vao day</p>
          <p className="text-sm text-muted-foreground mt-1">
            hoac nhan de chon anh (toi da {maxPhotos} anh)
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-4 gap-3 w-full">
          {photos.map((photo, i) => (
            <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden group">
              <img
                src={photo.dataUrl || "/placeholder.svg"}
                alt={`Anh ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(photo.id)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-background/80 text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Xoa anh ${i + 1}`}
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute bottom-1 left-1 bg-background/80 text-foreground text-xs px-1.5 py-0.5 rounded">
                {i + 1}
              </div>
            </div>
          ))}
          {photos.length < maxPhotos && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-primary/50 transition-colors"
              aria-label="Them anh"
            >
              <ImagePlus className="w-6 h-6 text-muted-foreground" />
            </button>
          )}
        </div>
      )}

      {/* Continue button */}
      {photos.length > 0 && (
        <Button
          onClick={() => onComplete(photos)}
          className="w-full max-w-sm bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg"
        >
          Tiep tuc voi {photos.length} anh
        </Button>
      )}
    </div>
  )
}
