'use client';

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCorners,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';

import { Droppable } from './droppable';
import { type Report, ReportCard } from './report-card';
import {
  type ColumnProps,
  type ColumnType,
  ReportColumn,
} from './report-column';

export interface KanbanBoardProps {
  kanbanData: ColumnProps[];
  displayedColumn: ColumnType[];
  hideColumnAction: (type: ColumnType) => void;
}

/**
 *
 * @param data Props
 * @returns Convert data to Record<ColumnType, Report[]> to convert data to be used in useState
 */
function handleConvertDataToRecord(data: ColumnProps[]) {
  return data.reduce(
    (acc, column) => {
      acc[column.title] = column.reports;
      return acc;
    },
    {} as Record<ColumnType, Report[]>,
  );
}

export const KanbanBoard = ({
  kanbanData,
  hideColumnAction,
  displayedColumn,
}: KanbanBoardProps) => {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      distance: 5,
      delay: 150,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const [reports, setReports] = useState<Record<ColumnType, Report[]>>(() =>
    handleConvertDataToRecord(kanbanData),
  );

  const [activeReport, setActiveReport] = useState<Report | null>(null);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveReport(null);
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const sourceColumn = findColumnByReportId(activeId);
    if (!sourceColumn) return;

    // over.id bisa berupa id report ATAU id kolom (karena SortableContext punya id kolom)
    const destinationColumn = (Object.keys(reports) as ColumnType[]).includes(
      overId as ColumnType,
    )
      ? (overId as ColumnType)
      : findColumnByReportId(overId);

    if (!destinationColumn) return;

    // === reorder dalam kolom sama ===
    if (sourceColumn === destinationColumn) {
      const items = reports[sourceColumn];
      const oldIndex = items.findIndex((item) => item.id === activeId);
      const newIndex = items.findIndex((item) => item.id === overId);

      if (oldIndex !== newIndex && newIndex !== -1) {
        setReports((prev) => ({
          ...prev,
          [sourceColumn]: arrayMove(prev[sourceColumn], oldIndex, newIndex),
        }));
      }
      return;
    }

    // === pindah antar kolom ===
    const movedItem = reports[sourceColumn].find(
      (item) => item.id === activeId,
    );
    if (!movedItem) return;

    const sourceItems = reports[sourceColumn];
    const destItems = reports[destinationColumn] ?? [];

    const overIndex = destItems.findIndex((item) => item.id === overId);
    const insertIndex = overIndex === -1 ? destItems.length : overIndex;

    setReports((prev) => ({
      ...prev,
      [sourceColumn]: sourceItems.filter((item) => item.id !== activeId),
      [destinationColumn]: [
        ...destItems.slice(0, insertIndex),
        movedItem,
        ...destItems.slice(insertIndex),
      ],
    }));
  };

  const findColumnByReportId = (id: string) => {
    return (Object.keys(reports) as ColumnType[]).find((column) =>
      reports[column].some((report) => report.id === id),
    );
  };

  return (
    <div className="container mx-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={(event) => {
          const { active } = event;
          const column = findColumnByReportId(active.id.toString());
          if (column) {
            const item = reports[column]?.find((item) => item.id === active.id);
            setActiveReport(item ?? null);
          }
        }}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveReport(null)}
      >
        <div className="flex flex-col gap-4 overflow-x-scroll md:flex-row">
          {(Object.keys(reports) as ColumnType[]).map((columnId) => (
            <Droppable id={columnId} key={columnId}>
              <ReportColumn
                key={columnId}
                title={columnId}
                reports={reports[columnId]}
                hideColumn={hideColumnAction}
                displayedStatus={displayedColumn}
                activeReportId={activeReport?.id}
              />
            </Droppable>
          ))}
        </div>
        <DragOverlay>
          {activeReport ? <ReportCard report={activeReport} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
