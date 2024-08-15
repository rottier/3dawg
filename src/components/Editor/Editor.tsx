import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  OnConnect,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import "./Editor.css";
import {
  AudioGraphNode,
  AudioGraphNodes,
} from "../../core/AudioGraph";
import { useDndMonitor, useDroppable } from "@dnd-kit/core";
import { useComposer } from "../Composer";

const proOptions = { hideAttribution: true };

const Editor = () => {
  const composer = useComposer();
  const reactFlow = useReactFlow();
  useDndMonitor({
    onDragEnd(event) {
      if (event.over?.id === "graph") {
        const nodeId = composer.graph.addAudioNode(
          event.active.id as AudioGraphNodes
        );
        const node = composer.graph.getAudioNode(nodeId);
        const newNodes = [
          ...nodes,
          {
            id: nodeId,
            position: reactFlow.screenToFlowPosition({
              x: event.active.rect?.current?.translated?.left || 0,
              y: event.active.rect?.current?.translated?.top || 0,
            }),
            data: {
              label: `${node?.type as AudioGraphNodes}`,
              audioNode: node as AudioGraphNode,
            },
          },
        ];
        setNodes(newNodes);
      }
    },
  });
  const [rerender, setRerender] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<{
    id: string;
    source: string;
    target: string;
  }>([]);
  const { setNodeRef } = useDroppable({
    id: "graph",
  });

  useEffect(() => {
  composer.graph.onLinksChanged = onLinksChanged;
  }, [composer.graph])

  const onConnect = useCallback<OnConnect>(
    (params) => {
      composer.graph.linkNodes(params.source, params.target);
    },
    [composer.graph]
  );

  const onLinksChanged = useCallback(
    () => {
      let newEdges: typeof edges = [];
      composer.graph.links.forEach((link) =>
        newEdges.push({ id: link.id, source: link.from.id, target: link.to.id })
      );
      setEdges(newEdges);
    },
    [composer.graph, setEdges]
  );

  return (
    <div className={"w-full h-full flex flex-col"}>
      <div ref={setNodeRef} className={`w-full h-full bg-black bg-opacity-30`}>
        <ReactFlow
          className="text-blue"
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          proOptions={proOptions}
          colorMode="light"
        >
          <Controls />
        </ReactFlow>
      </div>
      <div className="flex flex-row gap-1 p-1">
        <button className="btn btn-wide btn-accent"
          onClick={() => {
            composer.graph.playing ? composer.graph.stop() : composer.graph.play();
            setRerender(!rerender);
          }}
        >
          {composer.graph.playing ? "Stop" : "Play"}
        </button>
      </div>
    </div>
  );
};

export default function Flow() {
  return (
    <ReactFlowProvider>
      <Editor />
    </ReactFlowProvider>
  );
}
