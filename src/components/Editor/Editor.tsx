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
 
const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Oscillator' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: 'Amplifier' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
const proOptions = { hideAttribution: true };
 
export default function Editor() {
  const [nodes, _, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );
 
  return (
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
  );
}