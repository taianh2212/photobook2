export interface PhotoSlot {
  x: number
  y: number
  width: number
  height: number
}

// Photobooth layout types - defines number and arrangement of photo slots
export type PhotoboothLayout = 'vertical' | 'grid-2x2' | 'grid-2x3' | 'horizontal' | 'custom'

export interface PhotoboothLayoutInfo {
  id: PhotoboothLayout
  name: string
  description: string
  photoCount: number
  width: number
  height: number
}

// Available photobooth layouts
export const PHOTOBOOTH_LAYOUTS: PhotoboothLayoutInfo[] = [
  { id: 'vertical', name: 'Strip Dọc (4 ảnh)', description: '4 ảnh xếp dọc kiểu photobooth cổ điển', photoCount: 4, width: 600, height: 1800 },
  { id: 'grid-2x2', name: 'Lưới 2x2 (4 ảnh)', description: '4 ảnh bố cục lưới vuông', photoCount: 4, width: 1200, height: 1200 },
  { id: 'grid-2x3', name: 'Lưới 2x3 (6 ảnh)', description: '6 ảnh bố cục lưới đứng', photoCount: 6, width: 1200, height: 1800 },
  { id: 'horizontal', name: 'Strip Ngang (3 ảnh)', description: '3 ảnh xếp ngang', photoCount: 3, width: 1800, height: 600 },
]

export interface FrameTemplate {
  id: string
  name: string
  width: number
  height: number
  slots: PhotoSlot[]
  backgroundColor: string
  borderColor: string
  borderWidth: number
  cornerRadius: number
  padding: number
  gap: number
  layout: PhotoboothLayout
  overlayImage?: string // base64 or URL of the frame overlay
  isCustom?: boolean
  decoration?: FrameDecoration // pre-saved stickers and texts for custom frames
}

export type AppStep =
  | 'home'
  | 'select-layout'  // Select photobooth layout before choosing frame
  | 'select-frame'
  | 'capture'
  | 'select-photos'
  | 'design'
  | 'preview'
  | 'create-frame-layout'  // Select layout for creating custom frame
  | 'create-frame-design'  // Design custom frame with stickers/text

export interface CapturedPhoto {
  id: string
  dataUrl: string
  timestamp: number
}

export interface StickerItem {
  id: string
  emoji: string
  x: number
  y: number
  size: number
  rotation: number
  color: string
}

export interface TextItem {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  fontFamily: string
  color: string
  rotation: number
  bold: boolean
  italic: boolean
}

export interface FrameDecoration {
  stickers: StickerItem[]
  texts: TextItem[]
}
