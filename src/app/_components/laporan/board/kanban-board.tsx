'use client';

import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useState } from 'react';

// import { arrayMove } from "@dnd-kit/sortable";
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
export const KanbanBoard = ({
  kanbanData,
  hideColumnAction,
  displayedColumn,
}: KanbanBoardProps) => {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    }),
  );

  const [reports, setReports] = useState<Record<ColumnType, Report[]>>(() =>
    kanbanData.reduce(
      (acc, col) => {
        acc[col.title] = col.reports;
        return acc;
      },
      {} as Record<ColumnType, Report[]>,
    ),
  );

  const [activeReport, setActiveReport] = useState<Report | null>(null);

  const findColumnByReportId = (id: string): ColumnType | undefined =>
    (Object.keys(reports) as ColumnType[]).find((col) =>
      reports[col].some((r) => r.id === id),
    );

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const sourceColumn = findColumnByReportId(activeId);
    const destinationColumn =
      findColumnByReportId(overId) ?? (overId as ColumnType);
    if (
      !sourceColumn ||
      !destinationColumn ||
      sourceColumn === destinationColumn
    )
      return;

    const activeItem = reports[sourceColumn].find((r) => r.id === activeId);
    if (!activeItem) return;

    setReports((prev) => {
      const sourceItems = prev[sourceColumn].filter((r) => r.id !== activeId);
      const destinationItems = prev[destinationColumn];

      const overIndex = destinationItems.findIndex((r) => r.id === overId);
      const insertIndex = overIndex >= 0 ? overIndex : destinationItems.length;

      return {
        ...prev,
        [sourceColumn]: sourceItems,
        [destinationColumn]: [
          ...destinationItems.slice(0, insertIndex),
          activeItem,
          ...destinationItems.slice(insertIndex),
        ],
      };
    });
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveReport(null);
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const sourceColumn = findColumnByReportId(activeId);
    const destinationColumn =
      findColumnByReportId(overId) ?? (overId as ColumnType);

    if (!sourceColumn || !destinationColumn) return;

    const sourceItems = reports[sourceColumn];
    const destinationItems = reports[destinationColumn];

    const activeIndex = sourceItems.findIndex((r) => r.id === activeId);
    const overIndexInSource = sourceItems.findIndex((r) => r.id === overId);
    const overIndexInDestination = destinationItems
      ? destinationItems.findIndex((r) => r.id === overId)
      : -1;

    if (sourceColumn === destinationColumn) {
      if (activeIndex === -1) return;
      const targetIndex =
        overIndexInSource >= 0 ? overIndexInSource : sourceItems.length - 1;
      if (activeIndex === targetIndex) return;

      const updated = [...sourceItems];
      const [movedItem] = updated.splice(activeIndex, 1);
      if (!movedItem) return;

      // insert at target
      updated.splice(
        targetIndex >= 0 ? targetIndex : updated.length,
        0,
        movedItem,
      );

      setReports((prev) => ({
        ...prev,
        [sourceColumn]: updated,
      }));

      return;
    }

    if (activeIndex === -1) return;
    const activeItem = sourceItems[activeIndex];
    if (!activeItem) return;

    const newSource = sourceItems.filter((r) => r.id !== activeId);
    const insertIndex =
      overIndexInDestination >= 0
        ? overIndexInDestination
        : (destinationItems?.length ?? 0);

    const newDestination = [
      ...(destinationItems?.slice(0, insertIndex) ?? []),
      activeItem,
      ...(destinationItems?.slice(insertIndex) ?? []),
    ];

    setReports((prev) => ({
      ...prev,
      [sourceColumn]: newSource,
      [destinationColumn]: newDestination,
    }));
  };

  return (
    <div className="container mx-auto">
      <DndContext
        sensors={sensors}
        onDragStart={({ active }) => {
          const col = findColumnByReportId(active.id.toString());
          const item = col
            ? reports[col].find((r) => r.id === active.id)
            : null;
          setActiveReport(item ?? null);
        }}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveReport(null)}
      >
        <div className="flex flex-col gap-4 overflow-x-scroll md:flex-row">
          {(Object.keys(reports) as ColumnType[]).map((colId) => (
            <Droppable id={colId} key={colId}>
              <ReportColumn
                key={colId}
                title={colId}
                reports={reports[colId]}
                hideColumn={hideColumnAction}
                displayedStatus={displayedColumn}
                activeReportId={activeReport?.id}
              />
            </Droppable>
          ))}
        </div>

        <DragOverlay>
          {activeReport && <ReportCard report={activeReport} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
