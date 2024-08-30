import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { TrayItemData } from './types';
import { AudioGraphNodes } from '../../../core/AudioGraph/types';

interface TrayItemProps {
    node: AudioGraphNodes;
    id?: string;
    label?: string;
}

const TrayItem: React.FC<TrayItemProps> = ({node, id = node, label = node}) => {
    const {attributes, listeners, setNodeRef} = useDraggable({
        id: id,
        data: {
            type: node,
            id: id,
            label: label
        } as TrayItemData
      });
      
    return (
        <li ref={setNodeRef} {...listeners} {...attributes}>
        <a>{label}</a>
</li>
    );
};

export default TrayItem;