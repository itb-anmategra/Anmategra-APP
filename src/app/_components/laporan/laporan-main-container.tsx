"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Search, LayoutGrid, AlignLeft } from "lucide-react";
import { Droppable } from "./board/droppable";
import { Draggable } from "./board/draggable";
import { KanbanBoard, KanbanBoardProps } from "./board/kanban-board";
import { LaporanHeader } from "./laporan-header";

interface LaporanProps extends KanbanBoardProps {}

export const LaporanMainContainer = (Laporan : LaporanProps) => {

  return (
    <div className="container mx-auto p-4">
      <LaporanHeader/>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Cari laporan"
          className="w-full rounded-md border px-4 py-2 pl-10"
        />
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
      </div>

      <KanbanBoard kanbanData={Laporan.kanbanData}/>
    </div>
  );
};