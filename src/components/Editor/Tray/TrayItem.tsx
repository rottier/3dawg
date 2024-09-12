import React, { useLayoutEffect, useRef, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { TrayItemData } from "./types";
import { AudioGraphNodes } from "../../../core/AudioGraph/types";
import usePointerMove from "../../../hooks/usePointerMove";

interface TrayItemProps {
  node: AudioGraphNodes;
  id?: string;
  label?: string;
  active?: boolean;
  onDoubleClick?: () => void;
}

const defaultDistance = () => {
  return { x: 0, y: 0 };
};

const distanceThreshold = 50;

const TrayItem: React.FC<TrayItemProps> = ({
  node,
  id = node,
  label = node,
  active = false,
  onDoubleClick
}) => {
  const [distance, setDistance] = useState(defaultDistance());
  const [activateDrag, setActivateDrag] = useState(false);
  const [clientPosition, setClientPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onPointerDown = usePointerMove({
    onStart(e) {
      setDistance(defaultDistance());
      const elemOffset = {x: e.offsetX, y: e.offsetY};
      setOffset(elemOffset);
      setClientPosition({ x: e.clientX + elemOffset.x, y: e.clientY + elemOffset.y });
    },
    onMove(e) {
      setDistance({ x: distance.x + e.movementX, y: distance.y + e.movementY });
      setClientPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    },
    onEnd(e) {
      setDistance(defaultDistance());
      setClientPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    },
  });

  useLayoutEffect(
    () =>
      setActivateDrag(
        Math.abs(distance.x) > distanceThreshold ||
          Math.abs(distance.y) > distanceThreshold
      ),
    [distance]
  );

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: id,
    data: {
      type: node,
      id: id,
      label: label,
      position: clientPosition,
    } as TrayItemData,
  });

  return (
    <div className="w-full h-full" onPointerDown={onPointerDown} onDoubleClick={onDoubleClick}>
    <li ref={(!active && activateDrag) ? setNodeRef : null} {...listeners} {...attributes} className={'pointer-events-auto'}>
      <a className={active ? "font-bold" : "font-normal"}>{label}</a>
    </li>
    </div>
  );
};

export default TrayItem;
