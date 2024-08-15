import React, { createContext, ReactNode, useContext, useRef, useState } from 'react';
import { AudioGraph, AudioGraphNodes } from '../core/AudioGraph';
import { DndContext, DragOverlay, useDndMonitor } from '@dnd-kit/core';
import TrayItem from './Tray/TrayItem';

type ComposerProviderType = {
    graph: AudioGraph;
};

type ComposerProviderProps = {
    children: ReactNode;
};

const ComposerContext = createContext<ComposerProviderType | undefined>(undefined);


const ComposerProviderInternal: React.FC<ComposerProviderProps> = ({ children }) => {
    const [graph] = useState(new AudioGraph());
    const [activeId, setActiveId] = useState<string | null>(null);
    useDndMonitor({
        onDragStart(event) { setActiveId(String(event.active.id)) },
        onDragEnd(event) {
            setActiveId(null);
            if (event.over?.id === 'graph') {
                // graph.addAudioNode(event.active.id as AudioGraphNodes);
            }
        }
    });

    return (
        <>
            <ComposerContext.Provider value={{ graph }}>
                {children}
            </ComposerContext.Provider>
            <DragOverlay>
                {activeId ? (
                    <ul className="menu"><TrayItem node={activeId as AudioGraphNodes} /></ul>

                ) : null}
            </DragOverlay></>

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