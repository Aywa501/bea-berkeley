'use client'

import React from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'

interface SortableTableProps {
  items: any[]
  onReorder: (items: any[]) => void
  renderRow: (item: any) => React.ReactNode
  renderHeaders: () => React.ReactNode
  disabled?: boolean
}

export function SortableTable({ items, onReorder, renderRow, renderHeaders, disabled = false }: SortableTableProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex(item => item.id === active.id)
      const newIndex = items.findIndex(item => item.id === over?.id)

      const newItems = arrayMove(items, oldIndex, newIndex)
      onReorder(newItems)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(item => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <Table>
          <TableHeader>
            <TableRow>
              {!disabled && <TableHead className="w-10"></TableHead>}
              {renderHeaders()}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <SortableTableRow key={item.id} id={item.id} disabled={disabled}>
                {renderRow(item)}
              </SortableTableRow>
            ))}
          </TableBody>
        </Table>
      </SortableContext>
    </DndContext>
  )
}

interface SortableTableRowProps {
  id: string
  children: React.ReactNode
  disabled?: boolean
}

export function SortableTableRow({ id, children, disabled }: SortableTableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'opacity-50 bg-gray-100' : ''}
    >
      {!disabled && (
        <TableCell className="w-10 p-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
        </TableCell>
      )}
      {children}
    </TableRow>
  )
} 