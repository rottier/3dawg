import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { AudioGraph, AudioGraphLink } from '../core/AudioGraph';
import { DndContext, DragOverlay, useDndMonitor } from '@dnd-kit/core';
import { NodeTypes } from './Editor/Nodes';
import { AudioGraphNode } from '../core/AudioGraph/AudioGraphNode';

type ComposerProviderType = {
    onLinks: typeof AudioGraph.prototype.onLinks;
    onNodes: typeof AudioGraph.prototype.onNodes;
    onPlayback: typeof AudioGraph.prototype.onPlayback;
    graph: AudioGraph;
}

type ComposerConsumerType = {
    links: AudioGraphLink[];
    nodes: AudioGraphNode[];
    playing: boolean;
    graph: AudioGraph;
}

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
            }
        }
    });

    useEffect(() => {
        if (activeId && Object.keys(NodeTypes).includes(activeId)) {
            const component = NodeTypes[activeId as keyof typeof NodeTypes];
            setOverlayComponent(React.createElement(component));
        } else {
            setOverlayComponent(null);
        }
    }, [activeId]);

    useEffect(() => {
        return () => {
            graph.stop();
        }
    }, [])

    return (
        <ComposerContext.Provider value={{ graph: graph, onLinks: graph.onLinks, onNodes: graph.onNodes, onPlayback: graph.onPlayback }}>
            {children}
            {!dragSuccess && <DragOverlay>
                {overlayComponent && <div className="opacity-50">{overlayComponent}</div>}
            </DragOverlay>}
        </ComposerContext.Provider>

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
const useComposer = (): ComposerConsumerType => {
    const context = useContext(ComposerContext);
    const [links, setLinks] = useState<AudioGraphLink[]>([]);
    const [nodes, setNodes] = useState<AudioGraphNode[]>([]);
    const [playing, setPlaying] = useState(false);

    if (!context) {
        throw new Error("useComposer must be used within a ComposerProvider");
    }

    useEffect(() => {
        const cb = (links: AudioGraphLink[]) => setLinks([...links]);
        context.onLinks.subscribe(cb);
        return () => context.onLinks.unsubscribe(cb);
    }, [context.onLinks]);

    useEffect(() => {
        const cb = (nodes: AudioGraphNode[]) => setNodes([...nodes]);
        context.onNodes.subscribe(cb);
        return () => context.onNodes.unsubscribe(cb);
    }, [context.onNodes]);

    useEffect(() => {
        const cb = setPlaying;
        context.onPlayback.subscribe(cb);
        return () => context.onPlayback.unsubscribe(cb);
    }, [context.onPlayback]);

    return {graph: context.graph, links, nodes, playing};
};
export { ComposerContext, ComposerProvider, useComposer };