"use client"

import { useState, useCallback } from "react"
import type { CapturedPhoto, FrameTemplate } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, RotateCcw } from "lucide-react"

interface PhotoSelectorProps {
  photos: CapturedPhoto[]
  frame: FrameTemplate
  onComplete: (selectedPhotos: (CapturedPhoto | null)[]) => void
  onBack: () => void
}

export function PhotoSelector({ photos, frame, onComplete, onBack }: PhotoSelectorProps) {
  const slotCount = frame.slots.length
  const [assignments, setAssignments] = useState<(CapturedPhoto | null)[]>(
    Array(slotCount).fill(null)
  )
  const [activeSlot, setActiveSlot] = useState<number>(0)

  const assignPhoto = useCallback(
    (photo: CapturedPhoto) => {
      setAssignments((prev) => {
        const newAssignments = [...prev]
        // Remove this photo from any other slot
        for (let i = 0; i < newAssignments.length; i++) {
          if (newAssignments[i]?.id === photo.id) {
            newAssignments[i] = null
          }
        }
        newAssignments[activeSlot] = photo
        return newAssignments
      })
      // Move to next empty slot
      setActiveSlot((prev) => {
        const next = assignments.findIndex((a, i) => i > prev && a === null)
        if (next !== -1) return next
        const first = assignments.findIndex((a, i) => i !== prev && a === null)
        return first !== -1 ? first : prev
      })
    },
    [activeSlot, assignments]
  )

  const clearSlot = useCallback((index: number) => {
    setAssignments((prev) => {
      const newAssignments = [...prev]
      newAssignments[index] = null
      return newAssignments
    })
    setActiveSlot(index)
  }, [])

  const isPhotoUsed = useCallback(
    (photoId: string) => {
      return assignments.some((a) => a?.id === photoId)
    },
    [assignments]
  )

  const allSlotsFilled = assignments.every((a) => a !== null)

  const resetAll = useCallback(() => {
    setAssignments(Array(slotCount).fill(null))
    setActiveSlot(0)
  }, [slotCount])

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lai
        </Button>
        <h2 className="text-xl font-semibold text-foreground">Chon anh cho khung</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={resetAll}
          className="ml-auto bg-transparent text-muted-foreground"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Dat lai
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Frame slots preview */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Khung anh - {frame.name} ({slotCount} vi tri)
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {frame.slots.map((_, index) => {
              const assigned = assignments[index]
              const isActive = activeSlot === index
              return (
                <button
                  key={`slot-${frame.id}-${index}`}
                  type="button"
                  onClick={() => (assigned ? clearSlot(index) : setActiveSlot(index))}
                  className={`relative aspect-[4/3] rounded-lg border-2 overflow-hidden transition-all ${
                    isActive
                      ? "border-primary shadow-lg shadow-primary/20"
                      : assigned
                        ? "border-border"
                        : "border-dashed border-border"
                  }`}
                >
                  {assigned ? (
                    <>
                      <img
                        src={assigned.dataUrl || "/placeholder.svg"}
                        alt={`Vi tri ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-background/0 hover:bg-background/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                        <span className="text-xs bg-background/80 text-foreground px-2 py-1 rounded">
                          Nhan de xoa
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                      <span className="text-lg font-bold text-muted-foreground">{index + 1}</span>
                    </div>
                  )}
                  {isActive && !assigned && (
                    <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Available photos */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Anh da chup ({photos.length} anh) - Chon anh cho vi tri {activeSlot + 1}
          </h3>
          <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto">
            {photos.map((photo, i) => {
              const used = isPhotoUsed(photo.id)
              return (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => assignPhoto(photo)}
                  className={`relative aspect-[4/3] rounded-lg overflow-hidden transition-all ${
                    used ? "opacity-40 ring-2 ring-primary" : "hover:ring-2 hover:ring-primary/50"
                  }`}
                >
                  <img
                    src={photo.dataUrl || "/placeholder.svg"}
                    alt={`Anh ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {used && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                  <div className="absolute bottom-1 left-1 bg-background/80 text-foreground text-xs px-1.5 py-0.5 rounded">
                    {i + 1}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Continue button */}
      <div className="flex justify-center">
        <Button
          onClick={() => onComplete(assignments)}
          disabled={!allSlotsFilled}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 disabled:opacity-50"
        >
          {allSlotsFilled ? "Xem truoc thanh pham" : `Con ${assignments.filter((a) => !a).length} vi tri chua chon`}
        </Button>
      </div>
    </div>
  )
}
