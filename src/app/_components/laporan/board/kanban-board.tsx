"use client";

import { useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Droppable } from "./droppable";
import { type ColumnProps, type ColumnType, ReportColumn } from "./report-column";
import { type Report } from "./report-card";

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

    if (!over) return;

    const sourceColumn = findColumnByReportId(active.id.toString());
    const destinationColumn = over.id as ColumnType;

    if (sourceColumn && destinationColumn) {
      const sourceItems = reports[sourceColumn];
      const destinationItems = reports[destinationColumn];

      if (sourceColumn === destinationColumn) {
        const reorderedItems = arrayMove(
          sourceItems,
          sourceItems.findIndex((item) => item.id === active.id),
          destinationItems.findIndex((item) => item.id === over.id),
        );
        setReports((prev) => ({ ...prev, [sourceColumn]: reorderedItems }));
      } else {
        const movedItem = sourceItems.find((item) => item.id === active.id);
        if (movedItem) {
          setReports((prev) => ({
            ...prev,
            [sourceColumn]: prev[sourceColumn].filter(
              (item) => item.id !== active.id,
            ),
            [destinationColumn]: [...prev[destinationColumn], movedItem],
          }));
        }
      }
    }
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
        collisionDetection={closestCenter}
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
              />
            </Droppable>
          ))}
        </div>
        <DragOverlay>
          {activeReport ? (
            <div className="rounded-md bg-white p-4 shadow">
              <h3 className="mb-2 font-semibold">{activeReport.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {activeReport.date}
                </span>
                <span className="rounded-full bg-gray-200 px-2 py-1 text-sm">
                  {activeReport.category}
                </span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
