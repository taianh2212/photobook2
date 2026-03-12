"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import type { CapturedPhoto, FrameTemplate, FrameDecoration } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Download, RotateCcw, ArrowLeft } from "lucide-react"

const STICKER_SVG: Record<string, string> = {
  star: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  sparkle: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41L12 0z"/></svg>`,
  flower: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="5" r="3" opacity="0.7"/><circle cx="17" cy="8" r="3" opacity="0.7"/><circle cx="17" cy="16" r="3" opacity="0.7"/><circle cx="12" cy="19" r="3" opacity="0.7"/><circle cx="7" cy="16" r="3" opacity="0.7"/><circle cx="7" cy="8" r="3" opacity="0.7"/></svg>`,
  cloud: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  rainbow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 17a10 10 0 0 0-20 0"/><path d="M19 17a7 7 0 0 0-14 0"/><path d="M16 17a4 4 0 0 0-8 0"/></svg>`,
  fire: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 23c-3.87 0-7-3.13-7-7 0-2.38 1.19-4.47 3-5.74C10.39 8.54 12 5.78 12 3c1.76 2.08 4 5.16 4 8 0 1.1-.45 2.1-1.17 2.83A4.98 4.98 0 0 1 19 16c0 3.87-3.13 7-7 7z"/></svg>`,
  music: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  camera: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4" fill="white" opacity="0.5"/></svg>`,
  gift: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="8" width="18" height="4" rx="1"/><rect x="5" y="12" width="14" height="9" rx="1"/></svg>`,
  crown: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 20h20L19 8l-4 5-3-7-3 7-4-5z"/></svg>`,
  diamond: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12l10 10 10-10L12 2z"/></svg>`,
  lightning: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  peace: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="2" x2="12" y2="22"/><path d="M12 12l-7 7"/><path d="M12 12l7 7"/></svg>`,
}

const STICKER_COLORS: Record<string, string> = {
  heart: "#e94560", star: "#f1c40f", fire: "#e74c3c", sun: "#f39c12",
  moon: "#9b59b6", sparkle: "#ffd700", flower: "#ff6b9d", crown: "#f39c12",
  diamond: "#3498db", lightning: "#f1c40f", cloud: "#87ceeb", rainbow: "#e94560",
  music: "#1abc9c", camera: "#555", gift: "#e94560", peace: "#2ecc71",
}

interface PhotoPreviewProps {
  frame: FrameTemplate
  photos: (CapturedPhoto | null)[]
  decoration?: FrameDecoration
  onBack: () => void
  onRestart: () => void
}

export function PhotoPreview({ frame, photos, decoration, onBack, onRestart }: PhotoPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [compositeUrl, setCompositeUrl] = useState<string | null>(null)
  const [isRendering, setIsRendering] = useState(true)

  const renderComposite = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = frame.width
    canvas.height = frame.height

    // Draw background
    ctx.fillStyle = frame.backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw photos into slots
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
      })
    }

    for (let i = 0; i < frame.slots.length; i++) {
      const slot = frame.slots[i]
      const photo = photos[i]

      if (photo) {
        try {
          const img = await loadImage(photo.dataUrl)

          // Calculate cover fit
          const imgRatio = img.width / img.height
          const slotRatio = slot.width / slot.height

          let sx = 0
          let sy = 0
          let sw = img.width
          let sh = img.height

          if (imgRatio > slotRatio) {
            sw = img.height * slotRatio
            sx = (img.width - sw) / 2
          } else {
            sh = img.width / slotRatio
            sy = (img.height - sh) / 2
          }

          // Draw with rounded corners if needed
          if (frame.cornerRadius > 0) {
            ctx.save()
            const r = frame.cornerRadius
            ctx.beginPath()
            ctx.moveTo(slot.x + r, slot.y)
            ctx.lineTo(slot.x + slot.width - r, slot.y)
            ctx.quadraticCurveTo(slot.x + slot.width, slot.y, slot.x + slot.width, slot.y + r)
            ctx.lineTo(slot.x + slot.width, slot.y + slot.height - r)
            ctx.quadraticCurveTo(
              slot.x + slot.width,
              slot.y + slot.height,
              slot.x + slot.width - r,
              slot.y + slot.height
            )
            ctx.lineTo(slot.x + r, slot.y + slot.height)
            ctx.quadraticCurveTo(slot.x, slot.y + slot.height, slot.x, slot.y + slot.height - r)
            ctx.lineTo(slot.x, slot.y + r)
            ctx.quadraticCurveTo(slot.x, slot.y, slot.x + r, slot.y)
            ctx.closePath()
            ctx.clip()
            ctx.drawImage(img, sx, sy, sw, sh, slot.x, slot.y, slot.width, slot.height)
            ctx.restore()
          } else {
            ctx.drawImage(img, sx, sy, sw, sh, slot.x, slot.y, slot.width, slot.height)
          }
        } catch {
          // Draw placeholder for failed images
          ctx.fillStyle = "rgba(150, 150, 150, 0.3)"
          ctx.fillRect(slot.x, slot.y, slot.width, slot.height)
        }
      } else {
        ctx.fillStyle = "rgba(150, 150, 150, 0.3)"
        ctx.fillRect(slot.x, slot.y, slot.width, slot.height)
      }
    }

    // Draw frame overlay if exists
    if (frame.overlayImage) {
      try {
        const overlayImg = await loadImage(frame.overlayImage)
        ctx.drawImage(overlayImg, 0, 0, canvas.width, canvas.height)
      } catch {
        // Overlay failed, continue without it
      }
    }

    // Draw decorations from FrameDesigner (already includes frame's built-in decorations from initialDecoration)
    const allStickers = decoration?.stickers || []
    const allTexts = decoration?.texts || []

    // Draw all stickers
    for (const sticker of allStickers) {
      const svgStr = STICKER_SVG[sticker.emoji]
      if (!svgStr) continue
      // Use sticker's own color if available, otherwise fallback to preset
      const stickerColor = sticker.color || STICKER_COLORS[sticker.emoji] || "#e94560"
      const coloredSvg = svgStr.replace(/currentColor/g, stickerColor)
      const blob = new Blob([coloredSvg], { type: "image/svg+xml" })
      const url = URL.createObjectURL(blob)
      try {
        const sImg = await loadImage(url)
        ctx.save()
        ctx.translate(sticker.x + sticker.size / 2, sticker.y + sticker.size / 2)
        ctx.rotate((sticker.rotation * Math.PI) / 180)
        ctx.drawImage(sImg, -sticker.size / 2, -sticker.size / 2, sticker.size, sticker.size)
        ctx.restore()
      } catch {
        // skip
      }
      URL.revokeObjectURL(url)
    }

    // Draw all texts
    for (const item of allTexts) {
      ctx.save()
      ctx.translate(item.x, item.y)
      ctx.rotate((item.rotation * Math.PI) / 180)
      let fontStr = ""
      if (item.italic) fontStr += "italic "
      if (item.bold) fontStr += "bold "
      fontStr += `${item.fontSize}px ${item.fontFamily}`
      ctx.font = fontStr
      ctx.fillStyle = item.color
      ctx.textBaseline = "top"
      ctx.shadowColor = "rgba(0,0,0,0.4)"
      ctx.shadowBlur = 4
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2
      ctx.fillText(item.text, 0, 0)
      ctx.restore()
    }

    // Draw border
    if (frame.borderWidth > 0) {
      ctx.strokeStyle = frame.borderColor
      ctx.lineWidth = frame.borderWidth
      ctx.strokeRect(0, 0, canvas.width, canvas.height)
    }

    setCompositeUrl(canvas.toDataURL("image/png"))
    setIsRendering(false)
  }, [frame, photos, decoration])

  useEffect(() => {
    renderComposite()
  }, [renderComposite])

  const handleDownload = useCallback(() => {
    if (!compositeUrl) return
    const link = document.createElement("a")
    link.download = `photobooth-${Date.now()}.png`
    link.href = compositeUrl
    link.click()
  }, [compositeUrl])

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-3xl mx-auto">
      <div className="flex items-center gap-4 w-full">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lai chon anh
        </Button>
        <h2 className="text-xl font-semibold text-foreground">Thanh pham</h2>
      </div>

      {/* Canvas preview */}
      <div className="relative w-full flex justify-center">
        <canvas ref={canvasRef} className="hidden" />
        {compositeUrl ? (
          <div className="rounded-xl overflow-hidden shadow-2xl border border-border max-h-[60vh] sm:max-h-[70vh] w-full flex justify-center">
            <img
              src={compositeUrl || "/placeholder.svg"}
              alt="Thanh pham photobooth"
              className="max-w-full max-h-[60vh] sm:max-h-[70vh] object-contain"
            />
          </div>
        ) : (
          <div className="w-full aspect-[3/4] bg-secondary rounded-xl flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-muted-foreground text-sm">Dang tao anh...</span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button
          onClick={handleDownload}
          disabled={isRendering}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
        >
          <Download className="w-5 h-5" />
          Tai anh PNG
        </Button>

        <Button
          onClick={onRestart}
          variant="outline"
          size="lg"
          className="gap-2 bg-transparent text-foreground"
        >
          <RotateCcw className="w-5 h-5" />
          Chup moi
        </Button>
      </div>
    </div>
  )
}
