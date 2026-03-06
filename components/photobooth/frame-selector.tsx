"use client"

import { useRef, useEffect, useCallback } from "react"
import type { FrameTemplate } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface FrameSelectorProps {
  frames: FrameTemplate[]
  selectedFrame: FrameTemplate | null
  onSelect: (frame: FrameTemplate) => void
  onBack: () => void
  onContinue: () => void
}

function FramePreview({ frame, isSelected, onClick }: { frame: FrameTemplate; isSelected: boolean; onClick: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const scale = 200 / Math.max(frame.width, frame.height)
    canvas.width = frame.width * scale
    canvas.height = frame.height * scale

    ctx.fillStyle = frame.backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (const slot of frame.slots) {
      const sx = slot.x * scale
      const sy = slot.y * scale
      const sw = slot.width * scale
      const sh = slot.height * scale

      ctx.fillStyle = "rgba(150, 150, 150, 0.3)"
      ctx.fillRect(sx, sy, sw, sh)

      ctx.strokeStyle = "rgba(150, 150, 150, 0.5)"
      ctx.lineWidth = 1
      ctx.strokeRect(sx, sy, sw, sh)

      // Draw cross lines
      ctx.beginPath()
      ctx.moveTo(sx, sy)
      ctx.lineTo(sx + sw, sy + sh)
      ctx.moveTo(sx + sw, sy)
      ctx.lineTo(sx, sy + sh)
      ctx.strokeStyle = "rgba(150, 150, 150, 0.2)"
      ctx.stroke()
    }
  }, [frame])

  useEffect(() => {
    drawPreview()
  }, [drawPreview])

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
        isSelected
          ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
          : "border-border bg-card hover:border-primary/40 hover:bg-card/80"
      }`}
    >
      <canvas ref={canvasRef} className="rounded-lg max-h-48 w-auto" />
      <div className="text-center">
        <p className={`text-sm font-medium ${isSelected ? "text-primary" : "text-card-foreground"}`}>
          {frame.name}
        </p>
        <p className="text-xs text-muted-foreground">{frame.slots.length} anh</p>
      </div>
    </button>
  )
}

export function FrameSelector({ frames, selectedFrame, onSelect, onBack, onContinue }: FrameSelectorProps) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lai
        </Button>
        <h2 className="text-xl font-semibold text-foreground">Chon khung anh</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {frames.map((frame) => (
          <FramePreview
            key={frame.id}
            frame={frame}
            isSelected={selectedFrame?.id === frame.id}
            onClick={() => onSelect(frame)}
          />
        ))}
      </div>

      {selectedFrame && (
        <div className="flex justify-center">
          <Button
            onClick={onContinue}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-12"
          >
            Tiep tuc voi "{selectedFrame.name}"
          </Button>
        </div>
      )}
    </div>
  )
}
