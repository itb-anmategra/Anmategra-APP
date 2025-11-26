import { type KanbanBoardProps } from '../board/kanban-board';
import { getTypeImage } from '../board/report-column';
import { AccordionDisplay } from './accordion-display';

interface ListDisplayProps extends KanbanBoardProps {
  isAdminView?: boolean;
}

export const ListDisplay = ({
  kanbanData,
  displayedColumn,
  isAdminView,
  onEditReport,
}: ListDisplayProps) => {
  return (
    <div className="flex flex-col gap-2 overflow-y-visible">
      {kanbanData
        .filter((data) => displayedColumn.includes(data.title))
        .map((data, index) => (
          <AccordionDisplay
            key={index}
            logo={getTypeImage(data.title)}
            title={data.title}
            reports={data.reports}
            selectedStatus={displayedColumn}
            isAdminView={isAdminView}
            onEditReport={onEditReport}
          />
        ))}
    </div>
  );
};
