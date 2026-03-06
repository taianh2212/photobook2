import type { FrameTemplate, PhotoboothLayout } from './types'

function calculateSlots(
  template: Pick<FrameTemplate, 'layout' | 'width' | 'height' | 'padding' | 'gap' | 'cornerRadius'>
): FrameTemplate['slots'] {
  const { layout, width, height, padding, gap } = template

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

export const defaultFrameTemplates: FrameTemplate[] = [
  (() => {
    const base = {
      id: 'classic-strip-4',
      name: 'Classic Strip (4 ảnh)',
      width: 600,
      height: 1800,
      backgroundColor: '#ffffff',
      borderColor: '#e5e5e5',
      borderWidth: 0,
      cornerRadius: 0,
      padding: 40,
      gap: 24,
      layout: 'vertical' as PhotoboothLayout,
      slots: [] as FrameTemplate['slots'],
    }
    base.slots = calculateSlots(base)
    return base
  })(),
  (() => {
    const base = {
      id: 'grid-2x2',
      name: 'Grid 2x2 (4 ảnh)',
      width: 1200,
      height: 1200,
      backgroundColor: '#1a1a2e',
      borderColor: '#e94560',
      borderWidth: 0,
      cornerRadius: 0,
      padding: 40,
      gap: 24,
      layout: 'grid-2x2' as PhotoboothLayout,
      slots: [] as FrameTemplate['slots'],
    }
    base.slots = calculateSlots(base)
    return base
  })(),
  (() => {
    const base = {
      id: 'grid-2x3',
      name: 'Grid 2x3 (6 ảnh)',
      width: 1200,
      height: 1800,
      backgroundColor: '#fdf6ec',
      borderColor: '#d4a574',
      borderWidth: 0,
      cornerRadius: 0,
      padding: 40,
      gap: 24,
      layout: 'grid-2x3' as PhotoboothLayout,
      slots: [] as FrameTemplate['slots'],
    }
    base.slots = calculateSlots(base)
    return base
  })(),
  (() => {
    const base = {
      id: 'horizontal-3',
      name: 'Horizontal Strip (3 ảnh)',
      width: 1800,
      height: 600,
      backgroundColor: '#f0f0f0',
      borderColor: '#333333',
      borderWidth: 0,
      cornerRadius: 0,
      padding: 40,
      gap: 24,
      layout: 'horizontal' as PhotoboothLayout,
      slots: [] as FrameTemplate['slots'],
    }
    base.slots = calculateSlots(base)
    return base
  })(),
  (() => {
    const base = {
      id: 'pink-strip-4',
      name: 'Pink Strip (4 ảnh)',
      width: 600,
      height: 1800,
      backgroundColor: '#ffe4ec',
      borderColor: '#ff6b9d',
      borderWidth: 0,
      cornerRadius: 0,
      padding: 40,
      gap: 24,
      layout: 'vertical' as PhotoboothLayout,
      slots: [] as FrameTemplate['slots'],
    }
    base.slots = calculateSlots(base)
    return base
  })(),
  (() => {
    const base = {
      id: 'dark-grid-2x2',
      name: 'Dark Grid 2x2 (4 ảnh)',
      width: 1200,
      height: 1200,
      backgroundColor: '#0f0f0f',
      borderColor: '#333333',
      borderWidth: 0,
      cornerRadius: 0,
      padding: 40,
      gap: 24,
      layout: 'grid-2x2' as PhotoboothLayout,
      slots: [] as FrameTemplate['slots'],
    }
    base.slots = calculateSlots(base)
    return base
  })(),
]
