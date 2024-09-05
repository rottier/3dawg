import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AudioGraph, AudioGraphNode } from '../core/AudioGraph/Nodes';
import { AudioGraphLink, IAudioGraphNode } from '../core/AudioGraph/interfaces';

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
    const [graph] = useState(new AudioGraph());;

    return (
        <ComposerContext.Provider value={{ graph: graph, graphs: [graph], onLinks: graph.onLinks, onNodes: graph.onNodes, onPlayback: graph.onPlayback }}>
            {children}
        </ComposerContext.Provider>

    );
};

const ComposerProvider: React.FC<ComposerProviderProps> = ({ children }) => {

    return (
            <ComposerProviderInternal>
                {children}
            </ComposerProviderInternal>
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
        const cb = (nodes: IAudioGraphNode[]) => setNodes([...nodes] as AudioGraphNode[]);
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