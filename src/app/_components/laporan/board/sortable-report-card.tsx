'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { type Report, ReportCard } from './report-card';
import {
  type ColumnType,
} from './report-column';

export function SortableReportCard({
  report,
  column,
  onClickAction,
  onEdit,
  onDelete,
  isAdminView,
}: {
  report: Report;
  column: ColumnType;
  onClickAction: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdminView?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: report.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // buat yang sedang didrag jadi invisible (opacity 0)
    opacity: isDragging ? 0 : 1,
  };

  // Non-admin tidak boleh drag/reorder di Resolved / In Progress
  const canDrag = isAdminView || (column !== 'Resolved' && column !== 'In Progress');

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(canDrag ? attributes : {})}
      {...(canDrag ? listeners : {})}
      className={canDrag ? 'cursor-grab active:cursor-grabbing' : ''}
    >
      <ReportCard
        report={report}
        column={column}
        onClick={onClickAction}
        onEdit={onEdit}
        onDelete={onDelete}      
      />
    </div>
  );
}
