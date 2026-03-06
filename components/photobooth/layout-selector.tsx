"use client"

import { PhotoboothLayout, PHOTOBOOTH_LAYOUTS } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronRight } from "lucide-react"

interface LayoutSelectorProps {
    onSelect: (layout: PhotoboothLayout) => void
    onBack: () => void
    title?: string
    description?: string
}

export function LayoutSelector({
    onSelect,
    onBack,
    title = "Chọn kiểu khung photobooth",
    description = "Chọn kiểu bố cục khung ảnh phù hợp với nhu cầu của bạn",
}: LayoutSelectorProps) {
    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 w-full">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                </Button>
                <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            </div>

            <p className="text-muted-foreground text-center">{description}</p>

            {/* Layout grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {PHOTOBOOTH_LAYOUTS.map((layoutInfo) => {
                    // Calculate preview dimensions maintaining aspect ratio
                    const maxPreviewSize = 120
                    let previewW: number
                    let previewH: number
                    const ratio = layoutInfo.width / layoutInfo.height

                    if (ratio > 1) {
                        previewW = maxPreviewSize
                        previewH = Math.round(maxPreviewSize / ratio)
                    } else {
                        previewH = maxPreviewSize
                        previewW = Math.round(maxPreviewSize * ratio)
                    }

                    // Generate slot preview based on layout
                    const renderSlotPreview = () => {
                        switch (layoutInfo.id) {
                            case 'vertical':
                                return (
                                    <div className="flex flex-col gap-1 w-full h-full p-1.5">
                                        {[0, 1, 2, 3].map((i) => (
                                            <div key={i} className="flex-1 bg-muted-foreground/30 rounded-sm" />
                                        ))}
                                    </div>
                                )
                            case 'grid-2x2':
                                return (
                                    <div className="grid grid-cols-2 gap-1 w-full h-full p-1.5">
                                        {[0, 1, 2, 3].map((i) => (
                                            <div key={i} className="bg-muted-foreground/30 rounded-sm" />
                                        ))}
                                    </div>
                                )
                            case 'grid-2x3':
                                return (
                                    <div className="grid grid-cols-2 grid-rows-3 gap-1 w-full h-full p-1.5">
                                        {[0, 1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className="bg-muted-foreground/30 rounded-sm" />
                                        ))}
                                    </div>
                                )
                            case 'horizontal':
                                return (
                                    <div className="flex flex-row gap-1 w-full h-full p-1.5">
                                        {[0, 1, 2].map((i) => (
                                            <div key={i} className="flex-1 bg-muted-foreground/30 rounded-sm" />
                                        ))}
                                    </div>
                                )
                            default:
                                return null
                        }
                    }

                    return (
                        <button
                            key={layoutInfo.id}
                            type="button"
                            onClick={() => onSelect(layoutInfo.id)}
                            className="group flex items-center gap-6 p-6 rounded-xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-left"
                        >
                            {/* Preview box */}
                            <div
                                className="bg-secondary border-2 border-primary/30 rounded-lg flex-shrink-0 transition-all group-hover:border-primary group-hover:bg-primary/10"
                                style={{ width: previewW, height: previewH }}
                            >
                                {renderSlotPreview()}
                            </div>

                            <div className="flex-1">
                                <p className="font-semibold text-foreground text-lg">{layoutInfo.name}</p>
                                <p className="text-sm text-muted-foreground mt-1">{layoutInfo.description}</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {layoutInfo.width} x {layoutInfo.height}px • {layoutInfo.photoCount} ảnh
                                </p>
                            </div>

                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
