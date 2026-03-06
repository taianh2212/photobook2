"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import type { PhotoboothLayout, FrameTemplate, StickerItem, TextItem, FrameDecoration } from "@/lib/types"
import { PHOTOBOOTH_LAYOUTS } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
    ArrowLeft,
    Type,
    Smile,
    Trash2,
    Bold,
    Italic,
    RotateCw,
    Plus,
    Minus,
    Save,
    Palette,
} from "lucide-react"

interface FrameCreatorProps {
    layout: PhotoboothLayout
    onSave: (frame: FrameTemplate) => void
    onBack: () => void
}

const STICKER_LIST = [
    "star", "heart", "sparkle", "flower", "cloud", "sun",
    "moon", "rainbow", "fire", "music", "camera", "gift",
    "crown", "diamond", "lightning", "peace",
]

const STICKER_SVG: Record<string, string> = {
    star: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
    heart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    sparkle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41L12 0z"/></svg>`,
    flower: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="5" r="3" opacity="0.7"/><circle cx="17" cy="8" r="3" opacity="0.7"/><circle cx="17" cy="16" r="3" opacity="0.7"/><circle cx="12" cy="19" r="3" opacity="0.7"/><circle cx="7" cy="16" r="3" opacity="0.7"/><circle cx="7" cy="8" r="3" opacity="0.7"/></svg>`,
    cloud: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
    sun: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/></svg>`,
    moon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    rainbow: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 17a10 10 0 0 0-20 0"/><path d="M19 17a7 7 0 0 0-14 0"/><path d="M16 17a4 4 0 0 0-8 0"/></svg>`,
    fire: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 23c-3.87 0-7-3.13-7-7 0-2.38 1.19-4.47 3-5.74C10.39 8.54 12 5.78 12 3c1.76 2.08 4 5.16 4 8 0 1.1-.45 2.1-1.17 2.83A4.98 4.98 0 0 1 19 16c0 3.87-3.13 7-7 7z"/></svg>`,
    music: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
    camera: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4" fill="white" opacity="0.5"/></svg>`,
    gift: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="8" width="18" height="4" rx="1"/><rect x="5" y="12" width="14" height="9" rx="1"/><line x1="12" y1="8" x2="12" y2="21" stroke="white" stroke-width="1.5" opacity="0.5"/><path d="M12 8C12 8 8 2 6 4s2 4 6 4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 8C12 8 16 2 18 4s-2 4-6 4" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
    crown: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2 20h20L19 8l-4 5-3-7-3 7-4-5z"/></svg>`,
    diamond: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12l10 10 10-10L12 2z"/></svg>`,
    lightning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    peace: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="2" x2="12" y2="22"/><path d="M12 12l-7 7"/><path d="M12 12l7 7"/></svg>`,
}

const FONT_LIST = [
    { label: "Inter", value: "var(--font-inter), sans-serif" },
    { label: "Roboto", value: "var(--font-roboto), sans-serif" },
    { label: "Montserrat", value: "var(--font-montserrat), sans-serif" },
    { label: "Poppins", value: "var(--font-poppins), sans-serif" },
    { label: "Pacifico", value: "var(--font-pacifico), cursive" },
    { label: "Dancing Script", value: "var(--font-dancing-script), cursive" },
    { label: "Lobster", value: "var(--font-lobster), cursive" },
    { label: "Sans Serif", value: "sans-serif" },
    { label: "Serif", value: "serif" },
    { label: "Arial", value: "Arial, sans-serif" },
]

const COLOR_PALETTE = [
    "#ffffff", "#000000", "#333333", "#666666", "#999999",
    "#e94560", "#ff6b9d", "#f39c12", "#2ecc71", "#3498db",
    "#9b59b6", "#1abc9c", "#e74c3c", "#f1c40f", "#e67e22",
    "#1a1a2e", "#16213e", "#533483", "#0f3460", "#1e3a5f",
    "#ff1493", "#00ff00", "#00bfff", "#ff4500", "#ffd700",
    "#ff00ff", "#39ff14", "#00ffff", "#ff6600", "#ffff00",
    "#ffb3ba", "#baffc9", "#bae1ff", "#ffffba", "#ffdfba",
]

const BACKGROUND_COLORS = [
    "#ffffff", "#f5f5f5", "#1a1a2e", "#0f0f0f", "#ffe4ec",
    "#fdf6ec", "#e8f5e9", "#e3f2fd", "#f3e5f5", "#fff3e0",
    "#263238", "#37474f", "#455a64", "#546e7a", "#607d8b",
]

type ActiveTab = "sticker" | "text" | "background"

// Calculate photo slots based on layout
function calculateSlots(layout: PhotoboothLayout, width: number, height: number, padding: number, gap: number) {
    switch (layout) {
        case 'vertical': {
            const slotCount = 4
            const slotWidth = width - padding * 2
            const totalGap = gap * (slotCount - 1)
            const slotHeight = (height - padding * 2 - totalGap) / slotCount
            return Array.from({ length: slotCount }, (_, i) => ({
                x: padding,
                y: padding + i * (slotHeight + gap),
                width: slotWidth,
                height: slotHeight,
            }))
        }
        case 'grid-2x2': {
            const slotWidth = (width - padding * 2 - gap) / 2
            const slotHeight = (height - padding * 2 - gap) / 2
            return [
                { x: padding, y: padding, width: slotWidth, height: slotHeight },
                { x: padding + slotWidth + gap, y: padding, width: slotWidth, height: slotHeight },
                { x: padding, y: padding + slotHeight + gap, width: slotWidth, height: slotHeight },
                { x: padding + slotWidth + gap, y: padding + slotHeight + gap, width: slotWidth, height: slotHeight },
            ]
        }
        case 'grid-2x3': {
            const cols = 2
            const rows = 3
            const slotWidth = (width - padding * 2 - gap * (cols - 1)) / cols
            const slotHeight = (height - padding * 2 - gap * (rows - 1)) / rows
            const slots = []
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    slots.push({
                        x: padding + c * (slotWidth + gap),
                        y: padding + r * (slotHeight + gap),
                        width: slotWidth,
                        height: slotHeight,
                    })
                }
            }
            return slots
        }
        case 'horizontal': {
            const slotCount = 3
            const totalGap = gap * (slotCount - 1)
            const slotWidth = (width - padding * 2 - totalGap) / slotCount
            const slotHeight = height - padding * 2
            return Array.from({ length: slotCount }, (_, i) => ({
                x: padding + i * (slotWidth + gap),
                y: padding,
                width: slotWidth,
                height: slotHeight,
            }))
        }
        default:
            return []
    }
}

export function FrameCreator({ layout, onSave, onBack }: FrameCreatorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Get dimensions from layout info
    const layoutInfo = PHOTOBOOTH_LAYOUTS.find(l => l.id === layout) || PHOTOBOOTH_LAYOUTS[0]
    const dimensions = { width: layoutInfo.width, height: layoutInfo.height }
    const padding = 40
    const gap = 24
    const slots = calculateSlots(layout, dimensions.width, dimensions.height, padding, gap)

    const [frameName, setFrameName] = useState("")
    const [backgroundColor, setBackgroundColor] = useState("#ffffff")
    const [stickers, setStickers] = useState<StickerItem[]>([])
    const [texts, setTexts] = useState<TextItem[]>([])
    const [activeTab, setActiveTab] = useState<ActiveTab>("sticker")
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
    const [selectedItemType, setSelectedItemType] = useState<"sticker" | "text" | null>(null)

    // Text editing state
    const [newText, setNewText] = useState("")
    const [newFontFamily, setNewFontFamily] = useState("sans-serif")
    const [newColor, setNewColor] = useState("#ffffff")
    const [newBold, setNewBold] = useState(false)
    const [newItalic, setNewItalic] = useState(false)

    // Sticker color state
    const [stickerColor, setStickerColor] = useState("#e94560")

    // Drag state
    const [dragging, setDragging] = useState<string | null>(null)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

    const [canvasScale, setCanvasScale] = useState(1)

    // Draw the preview canvas
    const drawCanvas = useCallback(async () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = dimensions.width
        canvas.height = dimensions.height

        // Draw background
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const loadImage = (src: string): Promise<HTMLImageElement> =>
            new Promise((resolve, reject) => {
                const img = new Image()
                img.crossOrigin = "anonymous"
                img.onload = () => resolve(img)
                img.onerror = reject
                img.src = src
            })

        // Draw photo slots placeholders
        for (const slot of slots) {
            ctx.fillStyle = "rgba(150,150,150,0.2)"
            ctx.fillRect(slot.x, slot.y, slot.width, slot.height)

            ctx.strokeStyle = "rgba(150,150,150,0.5)"
            ctx.setLineDash([8, 4])
            ctx.lineWidth = 2
            ctx.strokeRect(slot.x, slot.y, slot.width, slot.height)
            ctx.setLineDash([])
        }

        // Draw stickers
        for (const sticker of stickers) {
            const svgStr = STICKER_SVG[sticker.emoji]
            if (!svgStr) continue
            const coloredSvg = svgStr.replace(/currentColor/g, sticker.color)
            const blob = new Blob([coloredSvg], { type: "image/svg+xml" })
            const url = URL.createObjectURL(blob)
            try {
                const img = await loadImage(url)
                ctx.save()
                ctx.translate(sticker.x + sticker.size / 2, sticker.y + sticker.size / 2)
                ctx.rotate((sticker.rotation * Math.PI) / 180)
                ctx.drawImage(img, -sticker.size / 2, -sticker.size / 2, sticker.size, sticker.size)
                ctx.restore()
            } catch {
                // skip
            }
            URL.revokeObjectURL(url)
        }

        // Draw text items
        for (const item of texts) {
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

        // Selection highlight
        if (selectedItemId) {
            const sticker = stickers.find((s) => s.id === selectedItemId)
            if (sticker) {
                ctx.save()
                ctx.translate(sticker.x + sticker.size / 2, sticker.y + sticker.size / 2)
                ctx.rotate((sticker.rotation * Math.PI) / 180)
                ctx.strokeStyle = "#3498db"
                ctx.lineWidth = 3
                ctx.setLineDash([6, 4])
                ctx.strokeRect(-sticker.size / 2 - 4, -sticker.size / 2 - 4, sticker.size + 8, sticker.size + 8)
                ctx.restore()
            }
            const text = texts.find((t) => t.id === selectedItemId)
            if (text) {
                ctx.save()
                ctx.translate(text.x, text.y)
                ctx.rotate((text.rotation * Math.PI) / 180)
                let fontStr = ""
                if (text.italic) fontStr += "italic "
                if (text.bold) fontStr += "bold "
                fontStr += `${text.fontSize}px ${text.fontFamily}`
                ctx.font = fontStr
                const metrics = ctx.measureText(text.text)
                ctx.strokeStyle = "#3498db"
                ctx.lineWidth = 3
                ctx.setLineDash([6, 4])
                ctx.strokeRect(-4, -4, metrics.width + 8, text.fontSize + 8)
                ctx.restore()
            }
        }
    }, [dimensions, backgroundColor, stickers, texts, selectedItemId, slots])

    useEffect(() => {
        drawCanvas()
    }, [drawCanvas])

    // Calculate scale for display
    useEffect(() => {
        const updateScale = () => {
            if (!containerRef.current) return
            const containerWidth = containerRef.current.clientWidth
            const maxWidth = Math.min(containerWidth, 500)
            setCanvasScale(maxWidth / dimensions.width)
        }
        updateScale()
        window.addEventListener("resize", updateScale)
        return () => window.removeEventListener("resize", updateScale)
    }, [dimensions.width])

    const getCanvasCoords = useCallback(
        (clientX: number, clientY: number) => {
            const canvas = canvasRef.current
            if (!canvas) return { x: 0, y: 0 }
            const rect = canvas.getBoundingClientRect()
            const displayScale = rect.width / canvas.width
            return {
                x: (clientX - rect.left) / displayScale,
                y: (clientY - rect.top) / displayScale,
            }
        },
        []
    )

    const findItemAtPosition = useCallback(
        (x: number, y: number): { id: string; type: "sticker" | "text" } | null => {
            for (let i = texts.length - 1; i >= 0; i--) {
                const t = texts[i]
                const canvas = canvasRef.current
                if (!canvas) continue
                const ctx = canvas.getContext("2d")
                if (!ctx) continue
                let fontStr = ""
                if (t.italic) fontStr += "italic "
                if (t.bold) fontStr += "bold "
                fontStr += `${t.fontSize}px ${t.fontFamily}`
                ctx.font = fontStr
                const w = ctx.measureText(t.text).width
                const h = t.fontSize
                if (x >= t.x && x <= t.x + w && y >= t.y && y <= t.y + h) {
                    return { id: t.id, type: "text" }
                }
            }
            for (let i = stickers.length - 1; i >= 0; i--) {
                const s = stickers[i]
                if (x >= s.x && x <= s.x + s.size && y >= s.y && y <= s.y + s.size) {
                    return { id: s.id, type: "sticker" }
                }
            }
            return null
        },
        [texts, stickers]
    )

    const handlePointerDown = useCallback(
        (e: React.PointerEvent) => {
            const { x, y } = getCanvasCoords(e.clientX, e.clientY)
            const item = findItemAtPosition(x, y)
            if (item) {
                setSelectedItemId(item.id)
                setSelectedItemType(item.type)
                setDragging(item.id)
                if (item.type === "sticker") {
                    const s = stickers.find((s) => s.id === item.id)
                    if (s) setDragOffset({ x: x - s.x, y: y - s.y })
                } else {
                    const t = texts.find((t) => t.id === item.id)
                    if (t) setDragOffset({ x: x - t.x, y: y - t.y })
                }
                ; (e.target as HTMLElement).setPointerCapture?.(e.pointerId)
            } else {
                setSelectedItemId(null)
                setSelectedItemType(null)
            }
        },
        [getCanvasCoords, findItemAtPosition, stickers, texts]
    )

    const handlePointerMove = useCallback(
        (e: React.PointerEvent) => {
            if (!dragging) return
            const { x, y } = getCanvasCoords(e.clientX, e.clientY)
            const nx = x - dragOffset.x
            const ny = y - dragOffset.y

            setStickers((prev) =>
                prev.map((s) => (s.id === dragging ? { ...s, x: nx, y: ny } : s))
            )
            setTexts((prev) =>
                prev.map((t) => (t.id === dragging ? { ...t, x: nx, y: ny } : t))
            )
        },
        [dragging, dragOffset, getCanvasCoords]
    )

    const handlePointerUp = useCallback(() => {
        setDragging(null)
    }, [])

    // Sticker actions
    const addSticker = useCallback((emoji: string) => {
        const newSticker: StickerItem = {
            id: `sticker-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            emoji,
            x: dimensions.width / 2 - 40,
            y: dimensions.height / 2 - 40,
            size: 80,
            rotation: 0,
            color: stickerColor,
        }
        setStickers((prev) => [...prev, newSticker])
        setSelectedItemId(newSticker.id)
        setSelectedItemType("sticker")
    }, [dimensions.width, dimensions.height, stickerColor])

    // Text actions
    const addText = useCallback(() => {
        if (!newText.trim()) return
        const item: TextItem = {
            id: `text-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            text: newText.trim(),
            x: dimensions.width / 2 - 100,
            y: dimensions.height / 2,
            fontSize: 48,
            fontFamily: newFontFamily,
            color: newColor,
            rotation: 0,
            bold: newBold,
            italic: newItalic,
        }
        setTexts((prev) => [...prev, item])
        setSelectedItemId(item.id)
        setSelectedItemType("text")
        setNewText("")
    }, [newText, newFontFamily, newColor, newBold, newItalic, dimensions.width, dimensions.height])

    // Modify selected item
    const deleteSelected = useCallback(() => {
        if (!selectedItemId) return
        setStickers((prev) => prev.filter((s) => s.id !== selectedItemId))
        setTexts((prev) => prev.filter((t) => t.id !== selectedItemId))
        setSelectedItemId(null)
        setSelectedItemType(null)
    }, [selectedItemId])

    const rotateSelected = useCallback((delta: number) => {
        if (!selectedItemId) return
        setStickers((prev) =>
            prev.map((s) => (s.id === selectedItemId ? { ...s, rotation: s.rotation + delta } : s))
        )
        setTexts((prev) =>
            prev.map((t) => (t.id === selectedItemId ? { ...t, rotation: t.rotation + delta } : t))
        )
    }, [selectedItemId])

    const resizeSelected = useCallback((delta: number) => {
        if (!selectedItemId) return
        setStickers((prev) =>
            prev.map((s) =>
                s.id === selectedItemId ? { ...s, size: Math.max(20, s.size + delta) } : s
            )
        )
        setTexts((prev) =>
            prev.map((t) =>
                t.id === selectedItemId
                    ? { ...t, fontSize: Math.max(12, t.fontSize + delta) }
                    : t
            )
        )
    }, [selectedItemId])

    const updateStickerColor = useCallback((color: string) => {
        if (!selectedItemId || selectedItemType !== "sticker") return
        setStickers((prev) =>
            prev.map((s) => (s.id === selectedItemId ? { ...s, color } : s))
        )
        setStickerColor(color)
    }, [selectedItemId, selectedItemType])

    // Save frame
    const handleSave = useCallback(() => {
        const name = frameName.trim() || `Khung ${layoutInfo.name} - ${Date.now()}`

        const frame: FrameTemplate = {
            id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            name,
            width: dimensions.width,
            height: dimensions.height,
            backgroundColor,
            borderColor: "#cccccc",
            borderWidth: 0,
            cornerRadius: 0,
            padding,
            gap,
            layout,
            slots,
            isCustom: true,
            decoration: { stickers, texts },
        }

        onSave(frame)
    }, [frameName, layout, layoutInfo.name, dimensions, backgroundColor, stickers, texts, slots, onSave])

    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                </Button>
                <h2 className="text-xl font-semibold text-foreground">
                    Tạo khung ảnh - {layoutInfo.name}
                </h2>
                <Button
                    onClick={handleSave}
                    className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                >
                    <Save className="w-4 h-4" />
                    Lưu khung
                </Button>
            </div>

            {/* Frame name input */}
            <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-foreground" htmlFor="frame-name">
                    Tên khung:
                </label>
                <input
                    id="frame-name"
                    type="text"
                    value={frameName}
                    onChange={(e) => setFrameName(e.target.value)}
                    placeholder="Nhập tên cho khung ảnh..."
                    className="flex-1 max-w-sm px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
                {/* Canvas area */}
                <div ref={containerRef} className="flex justify-center">
                    <canvas
                        ref={canvasRef}
                        className="rounded-xl border border-border shadow-lg cursor-crosshair"
                        style={{
                            width: dimensions.width * canvasScale,
                            height: dimensions.height * canvasScale,
                            maxWidth: "100%",
                        }}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                    />
                </div>

                {/* Tools panel */}
                <div className="flex flex-col gap-4 bg-card rounded-xl border border-border p-4">
                    {/* Tabs */}
                    <div className="flex gap-1 bg-secondary rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => setActiveTab("sticker")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === "sticker"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <Smile className="w-4 h-4" />
                            Sticker
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("text")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === "text"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <Type className="w-4 h-4" />
                            Chữ
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("background")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === "background"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <Palette className="w-4 h-4" />
                            Nền
                        </button>
                    </div>

                    {/* Sticker tab */}
                    {activeTab === "sticker" && (
                        <div className="flex flex-col gap-3">
                            <p className="text-sm text-muted-foreground">
                                Thêm sticker vào khung ảnh
                            </p>
                            <div className="grid grid-cols-4 gap-2">
                                {STICKER_LIST.map((emoji) => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => addSticker(emoji)}
                                        className="aspect-square rounded-lg border border-border bg-secondary/50 hover:bg-secondary hover:border-primary/40 transition-colors flex items-center justify-center p-2"
                                        title={emoji}
                                    >
                                        <div
                                            className="w-8 h-8"
                                            style={{ color: stickerColor }}
                                            dangerouslySetInnerHTML={{ __html: STICKER_SVG[emoji] || "" }}
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Sticker color picker */}
                            <div className="flex flex-col gap-2 pt-2 border-t border-border">
                                <span className="text-sm font-medium text-foreground">Màu sticker</span>
                                <div className="grid grid-cols-10 gap-1.5">
                                    {COLOR_PALETTE.slice(0, 20).map((color) => (
                                        <button
                                            key={`sticker-${color}`}
                                            type="button"
                                            onClick={() => {
                                                setStickerColor(color)
                                                if (selectedItemId && selectedItemType === "sticker") {
                                                    updateStickerColor(color)
                                                }
                                            }}
                                            className={`w-6 h-6 rounded-md border-2 transition-transform hover:scale-110 ${stickerColor === color ? "border-primary scale-110" : "border-border"
                                                }`}
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Text tab */}
                    {activeTab === "text" && (
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-foreground" htmlFor="text-input">
                                    Nội dung
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        id="text-input"
                                        type="text"
                                        value={newText}
                                        onChange={(e) => setNewText(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && addText()}
                                        placeholder="Nhập chữ..."
                                        className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                    <Button onClick={addText} size="sm" disabled={!newText.trim()}>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-foreground" htmlFor="font-select">
                                    Phông chữ
                                </label>
                                <select
                                    id="font-select"
                                    value={newFontFamily}
                                    onChange={(e) => setNewFontFamily(e.target.value)}
                                    className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    {FONT_LIST.map((f) => (
                                        <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                                            {f.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setNewBold(!newBold)}
                                    className={`w-9 h-9 p-0 ${newBold ? "bg-primary text-primary-foreground" : ""}`}
                                >
                                    <Bold className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setNewItalic(!newItalic)}
                                    className={`w-9 h-9 p-0 ${newItalic ? "bg-primary text-primary-foreground" : ""}`}
                                >
                                    <Italic className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-medium text-foreground">Màu chữ</span>
                                <div className="grid grid-cols-10 gap-1.5">
                                    {COLOR_PALETTE.slice(0, 20).map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setNewColor(color)}
                                            className={`w-6 h-6 rounded-md border-2 transition-transform hover:scale-110 ${newColor === color ? "border-primary scale-110" : "border-border"
                                                }`}
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Background tab */}
                    {activeTab === "background" && (
                        <div className="flex flex-col gap-3">
                            <p className="text-sm text-muted-foreground">
                                Chọn màu nền cho khung ảnh
                            </p>
                            <div className="grid grid-cols-5 gap-2">
                                {BACKGROUND_COLORS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setBackgroundColor(color)}
                                        className={`aspect-square rounded-lg border-2 transition-all hover:scale-105 ${backgroundColor === color ? "border-primary ring-2 ring-primary/30" : "border-border"
                                            }`}
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <label className="text-xs text-muted-foreground" htmlFor="bg-custom-color">
                                    Màu tự chọn:
                                </label>
                                <input
                                    id="bg-custom-color"
                                    type="color"
                                    value={backgroundColor}
                                    onChange={(e) => setBackgroundColor(e.target.value)}
                                    className="w-10 h-10 rounded border border-input cursor-pointer"
                                />
                            </div>
                        </div>
                    )}

                    {/* Selected item controls */}
                    {selectedItemId && (
                        <div className="border-t border-border pt-4 flex flex-col gap-3">
                            <p className="text-sm font-medium text-foreground">
                                Chỉnh sửa {selectedItemType === "sticker" ? "sticker" : "chữ"} đã chọn
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                                <Button variant="outline" size="sm" onClick={() => resizeSelected(10)} className="gap-1">
                                    <Plus className="w-3 h-3" /> Phóng to
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => resizeSelected(-10)} className="gap-1">
                                    <Minus className="w-3 h-3" /> Thu nhỏ
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => rotateSelected(15)} className="gap-1">
                                    <RotateCw className="w-3 h-3" /> Xoay
                                </Button>
                                <Button variant="outline" size="sm" onClick={deleteSelected} className="text-destructive gap-1">
                                    <Trash2 className="w-3 h-3" /> Xóa
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Item count */}
                    <div className="mt-auto pt-4 border-t border-border text-sm text-muted-foreground">
                        {stickers.length} sticker, {texts.length} chữ đã thêm
                    </div>
                </div>
            </div>
        </div>
    )
}
