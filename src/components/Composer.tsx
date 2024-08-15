import React, { createContext, FunctionComponent, ReactNode, useContext, useEffect, useState } from 'react';
import { AudioGraph, AudioGraphNodes, AudioGraphNodeType } from '../core/AudioGraph';
import { DndContext, DragOverlay, useDndMonitor } from '@dnd-kit/core';
import { NodeTypes } from './Editor/Nodes';
import { ReactFlowProvider } from '@xyflow/react';
import { over } from 'lodash';

type ComposerProviderType = {
    graph: AudioGraph;
};

type ComposerProviderProps = {
    children: ReactNode;
};

const ComposerContext = createContext<ComposerProviderType | undefined>(undefined);


const ComposerProviderInternal: React.FC<ComposerProviderProps> = ({ children }) => {
    const [dragSuccess, setDragSuccess] = useState(false);
    const [graph] = useState(new AudioGraph());
    const [overlayComponent, setOverlayComponent] = useState<ReactNode | null>(null)
    const [activeId, setActiveId] = useState<string | null>(null);
    useDndMonitor({
        onDragStart(event) { setDragSuccess(false); setActiveId(String(event.active.id)) },
        onDragEnd(event) {
            setActiveId(null);
            if (event.over?.id === 'graph') {
                setDragSuccess(true);
                // graph.addAudioNode(event.active.id as AudioGraphNodes);
            }
        }
    });

    useEffect(() => {
        if (activeId && Object.keys(NodeTypes).includes(activeId)) {
            // Type assertion to ensure correct key type
            const component = NodeTypes[activeId as keyof typeof NodeTypes];
            setOverlayComponent(React.createElement(component));
        } else {
            setOverlayComponent(null);
        }
    }, [activeId]);

    return (
        <>
            <ComposerContext.Provider value={{ graph }}>
                {children}
            </ComposerContext.Provider>
            {!dragSuccess && <DragOverlay>
                {overlayComponent && <div className="opacity-50">{overlayComponent}</div>}
            </DragOverlay>}</>

    );
};

const ComposerProvider: React.FC<ComposerProviderProps> = ({ children }) => {

    return (
        <DndContext>
            <ComposerProviderInternal>
                {children}
            </ComposerProviderInternal>
        </DndContext>

    );
};
const useComposer = (): ComposerProviderType => {
    const context = useContext(ComposerContext);
    if (!context) {
        throw new Error("useComposer must be used within a ComposerProvider");
    }
    return context;
};
export { ComposerContext, ComposerProvider, useComposer };