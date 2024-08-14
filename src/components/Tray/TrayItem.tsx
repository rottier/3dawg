import React from 'react';
import { AudioGraphNodes } from '../../core/AudioGraph';
import { useDraggable } from '@dnd-kit/core';

interface TrayItemProps {
    node: AudioGraphNodes;
}

const TrayItem: React.FC<TrayItemProps> = ({node}) => {
    const {attributes, listeners, setNodeRef} = useDraggable({
        id: node,
      });
      
    return (
        <li ref={setNodeRef} {...listeners} {...attributes}>
        <a>{node}</a>
</li>
    );
};

export default TrayItem;