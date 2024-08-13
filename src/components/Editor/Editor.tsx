import { useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
 
import '@xyflow/react/dist/style.css';
import './Editor.css'
import { AudioGraph, AudioGraphNodes } from '../../core/AudioGraph';

const audioGraph = new AudioGraph(new AudioContext());
const nodeId1  = audioGraph.addAudioNode(AudioGraphNodes.Oscillator);
const nodeId2 = audioGraph.addAudioNode(AudioGraphNodes.Gain);
const nodeId3 = audioGraph.addAudioNode(AudioGraphNodes.Output);

const initialNodes = [
  { id: nodeId1, position: { x: 0, y: 0 }, data: { label: 'Oscillator', audioNode: audioGraph.nodes[0]} },
  { id: nodeId2, position: { x: 0, y: 100 }, data: { label: 'Gain', audioNode: audioGraph.nodes[1] } },
  { id: nodeId3, position: { x: 0, y: 200 }, data: { label: 'Output', audioNode: audioGraph.nodes[2] } },
];

audioGraph.linkNodes(nodeId1, nodeId2)

const initialEdges = [{ id: 'e1-2', source: nodeId1, target: nodeId2 }, { id: 'e2-3', source: nodeId2, target: nodeId3 }];
const proOptions = { hideAttribution: true };
 
export default function Editor() {
  const [nodes, _, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );
 
  return (
    <>
    <button onClick={() => audioGraph.play()}>Start</button>
    <div className={`w-full h-full bg-black bg-opacity-30`}>
      <ReactFlow
        className='text-blue'
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        proOptions={proOptions}
        colorMode='light'
      >
        <Controls />
      </ReactFlow>
    </div>
    </>
  );
}