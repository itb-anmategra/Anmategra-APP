import { useDroppable } from '@dnd-kit/core';
import React from 'react';

interface Props {
  id: string;
  children: React.ReactNode;
}

export function Droppable(props: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };

  return (
    <div className="h-fit w-full" ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}
