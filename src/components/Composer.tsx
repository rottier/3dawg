import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AudioGraph, AudioGraphLink } from '../core/AudioGraph';
import { DndContext, DragOverlay, useDndMonitor } from '@dnd-kit/core';
import { NodeTypes } from './Editor/Nodes';
import { AudioGraphNode } from '../core/AudioGraph/AudioGraphNode';

type ComposerProviderType = {
    onLinks: typeof AudioGraph.prototype.onLinks;
    onNodes: typeof AudioGraph.prototype.onNodes;
    onPlayback: typeof AudioGraph.prototype.onPlayback;
    graph: AudioGraph;
    graphs: AudioGraph[];
}

type ComposerConsumerType = {
    links: AudioGraphLink[];
    nodes: AudioGraphNode[];
    playing: boolean;
    graph: AudioGraph;
    graphs: AudioGraph[];
}

type ComposerProviderProps = {
    children: ReactNode;
};

const ComposerContext = createContext<ComposerProviderType | undefined>(undefined);


const ComposerProviderInternal: React.FC<ComposerProviderProps> = ({ children }) => {
    const [dragSuccess, setDragSuccess] = useState(false);
    const [graph] = useState(new AudioGraph());
    const [overlayComponent, setOverlayComponent] = useState<ReactNode | null>(null)
    const [activeType, setActiveType] = useState<string | null>(null);
    useDndMonitor({
        onDragStart(event) { setDragSuccess(false); setActiveType(String(event.active.data.current?.type)) },
        onDragEnd(event) {
            setActiveType(null);
            if (event.over?.id === 'graph') {
                setDragSuccess(true);
            }
        }
    });

    useEffect(() => {
        if (activeType && Object.keys(NodeTypes).includes(activeType)) {
            const component = NodeTypes[activeType as keyof typeof NodeTypes];
            setOverlayComponent(React.createElement(component));
        } else {
            setOverlayComponent(null);
        }
    }, [activeType]);

    useEffect(() => {

        return () => {
            graph.stop();
        }
    }, [])

    return (
        <ComposerContext.Provider value={{ graph: graph, graphs: [], onLinks: graph.onLinks, onNodes: graph.onNodes, onPlayback: graph.onPlayback }}>
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

    return {graph: context.graph, graphs: context.graphs, links, nodes, playing};
};
export { ComposerContext, ComposerProvider, useComposer };