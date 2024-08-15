import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import "./Editor.css";
import { AudioGraph, AudioGraphNode, AudioGraphNodes } from "../../core/AudioGraph";
import { useDndMonitor, useDroppable } from '@dnd-kit/core';
import { useCompositor } from "../Compositor";

const audioGraph = new AudioGraph();
const nodeId1 = audioGraph.addAudioNode(AudioGraphNodes.Oscillator);
const nodeId2 = audioGraph.addAudioNode(AudioGraphNodes.Gain);
const nodeId3 = audioGraph.addAudioNode(AudioGraphNodes.Output);

audioGraph.linkNodes(nodeId1, nodeId2);
audioGraph.linkNodes(nodeId2, nodeId3);

const initialNodes = [
  {
    id: nodeId1,
    position: { x: 0, y: 0 },
    data: { label: "Oscillator", audioNode: audioGraph.nodes[0] },
  },
  {
    id: nodeId2,
    position: { x: 0, y: 100 },
    data: { label: "Gain", audioNode: audioGraph.nodes[1] },
  },
  {
    id: nodeId3,
    position: { x: 0, y: 200 },
    data: { label: "Output", audioNode: audioGraph.nodes[2] },
  },
];

const initialEdges = [
  { id: "e1-2", source: nodeId1, target: nodeId2 },
  { id: "e2-3", source: nodeId2, target: nodeId3 },
];
const proOptions = { hideAttribution: true };

const Editor = () => {
  const reactFlow = useReactFlow();
  useDndMonitor({
      onDragEnd(event) {
        if (event.over?.id === 'graph') {
            const nodeId = compositor.graph.addAudioNode(event.active.id as AudioGraphNodes);
            const node = compositor.graph.getAudioNode(nodeId);
            const newNodes = [...nodes, {id: nodeId, position: reactFlow.screenToFlowPosition(pointerPosition), data: { label: `${node?.type as AudioGraphNodes}`, audioNode: node as AudioGraphNode }}]
            setNodes(newNodes);
      }
       }
  });
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [pointerPosition, setPointerPosition] = useState({x: 0, y: 0});
  const {setNodeRef} = useDroppable({
    id: 'graph',
  });
  const compositor = useCompositor();

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );



  return (
    <>
      <button onClick={() => {audioGraph.play()}}>Start</button>
      <button onClick={() => {audioGraph.stop()}}>Stop</button>
      <div ref={setNodeRef} onPointerMove={(e) => setPointerPosition({x: e.clientX, y: e.clientY})} className={`w-full h-full bg-black bg-opacity-30`}>
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
    </>
  );
}

export default function Flow() {
  
  return <ReactFlowProvider><Editor/></ReactFlowProvider> ;
}