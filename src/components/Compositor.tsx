import React, { createContext, ReactNode, useContext, useRef, useState } from 'react';
import { AudioGraph, AudioGraphNodes } from '../core/AudioGraph';
import { DndContext, DragOverlay, useDndMonitor } from '@dnd-kit/core';
import TrayItem from './Tray/TrayItem';

type CompositorProviderType = {
    graph: AudioGraph;
};

type CompositorProviderProps = {
    children: ReactNode;
};

const CompositorContext = createContext<CompositorProviderType | undefined>(undefined);


const CompositorProviderInternal: React.FC<CompositorProviderProps> = ({ children }) => {
    const [graph] = useState(new AudioGraph());
    const [activeId, setActiveId] = useState<string | null>(null);
    useDndMonitor({
        onDragStart(event) { setActiveId(String(event.active.id)) },
        onDragEnd(event) {
            setActiveId(null);
            if (event.over?.id === 'graph') {
                graph.addAudioNode(event.active.id as AudioGraphNodes);
            }
        }
    });

    return (
        <>
            <CompositorContext.Provider value={{ graph }}>
                {children}
            </CompositorContext.Provider>
            <DragOverlay>
                {activeId ? (
                    <ul className="menu"><TrayItem node={activeId as AudioGraphNodes} /></ul>

                ) : null}
            </DragOverlay></>

    );
};

const CompositorProvider: React.FC<CompositorProviderProps> = ({ children }) => {

    return (
        <DndContext>
            <CompositorProviderInternal>
                {children}
            </CompositorProviderInternal>
        </DndContext>

    );
};
const useCompositor = (): CompositorProviderType => {
    const context = useContext(CompositorContext);
    if (!context) {
        throw new Error("useCompositor must be used within a CompositorProvider");
    }
    return context;
};
export { CompositorContext, CompositorProvider, useCompositor };