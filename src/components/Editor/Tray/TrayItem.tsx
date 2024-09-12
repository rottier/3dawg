import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { TrayItemData } from "./types";
import { AudioGraphNodes } from "../../../core/AudioGraph/types";

interface TrayItemProps {
  node: AudioGraphNodes;
  id?: string;
  label?: string;
  active?: boolean;
}

const TrayItem: React.FC<TrayItemProps> = ({
  node,
  id = node,
  label = node,
  active = false
}) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: id,
    data: {
      type: node,
      id: id,
      label: label,
    } as TrayItemData,
  });

  return (
    <li ref={!active ? setNodeRef : null} {...listeners} {...attributes}>
      <a className={active ? 'font-bold' : 'font-normal'}>{label}</a>
    </li>
  );
};

export default TrayItem;
