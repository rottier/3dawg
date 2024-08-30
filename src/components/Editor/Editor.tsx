import {
  createElement,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  ReactFlow,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  OnConnect,
  OnDelete,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import "./Editor.css";
import {
  DndContext,
  DragOverlay,
  useDndMonitor,
  useDroppable,
} from "@dnd-kit/core";
import { useComposer } from "../Composer";
import { NodeTypes } from "./Nodes/helpers";
import { AudioGraphFlowNode } from "./types";
import { TrayItemData } from "./Tray";
import Tray from "./Tray/Tray";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

const proOptions = { hideAttribution: true };

function NodeGraph() {
  const { graph, links, playing } = useComposer();
  const reactFlow = useReactFlow();
  useDndMonitor({
    onDragEnd(event) {
      if (event.over?.id === "graph") {
        const data = event.active.data.current as TrayItemData;
        const nodeType = data.type;

        const nodeId = graph.addAudioNode(nodeType);
        const node = graph.getAudioNode(nodeId);

        if (node) {
          const newNodes = [
            ...nodes,
            {
              id: nodeId,
              type: nodeType,
              position: reactFlow.screenToFlowPosition({
                x: event.active.rect?.current?.translated?.left || 0,
                y: event.active.rect?.current?.translated?.top || 0,
              }),
              data: {
                audioNode: node,
              },
            },
          ];
          setNodes(newNodes);
        }
      }
    },
  });
  const [rerender, setRerender] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState<AudioGraphFlowNode>(
    []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<{
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
  }>([]);
  const { setNodeRef } = useDroppable({
    id: "graph",
  });

  const onConnect = useCallback<OnConnect>(
    (params) => {
      graph.linkNodes(
        params.source,
        params.target,
        params.sourceHandle || undefined,
        params.targetHandle || undefined
      );
    },
    [graph]
  );

  const onDelete = useCallback<OnDelete>(
    (params) => {
      params.nodes.forEach((node) => graph.removeAudioNode(node.id));
      params.edges.forEach((edge) =>
        graph.unlinkNodes(
          edge.source,
          edge.target,
          edge.sourceHandle || undefined,
          edge.targetHandle || undefined
        )
      );
    },
    [graph]
  );

  useEffect(() => {
    let newEdges: typeof edges = [];
    links.forEach((link) =>
      newEdges.push({
        id: link.id,
        source: link.from.id,
        target: link.to.id,
        sourceHandle: link.fromParameter,
        targetHandle: link.toParameter,
      })
    );
    setEdges(newEdges);
  }, [links]);

  return (
    <div className={"w-full h-full flex flex-col"}>
      <div ref={setNodeRef} className={`w-full h-full bg-black bg-opacity-60`}>
        <ReactFlow
          className="!text-secondary"
          nodeTypes={NodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDelete={onDelete}
          proOptions={proOptions}
          colorMode="light"
          minZoom={0.1}
          onEdgeClick={(_, edge) =>
            graph.unlinkNodes(
              edge.source,
              edge.target,
              edge.sourceHandle || undefined,
              edge.targetHandle || undefined
            )
          }
        >
          <Controls />
        </ReactFlow>
      </div>
      <div className="flex flex-row gap-1 p-1">
        <button
          className="btn btn-wide btn-accent"
          onClick={() => {
            playing ? graph.stop() : graph.start();
            setRerender(!rerender);
          }}
        >
          {playing ? "Stop" : "Play"}
        </button>
      </div>
    </div>
  );
}

function NodeGraphWithTray() {
  const [dragSuccess, setDragSuccess] = useState(false);
  const [overlayComponent, setOverlayComponent] = useState<ReactNode | null>(
    null
  );
  const [activeType, setActiveType] = useState<string | null>(null);
  const reactFlow = useReactFlow();

  useDndMonitor({
    onDragStart(event) {
      setDragSuccess(false);
      setActiveType(String(event.active.data.current?.type));
    },
    onDragEnd(event) {
      setActiveType(null);
      if (event.over?.id === "graph") {
        setDragSuccess(true);
      }
    },
  });

  useEffect(() => {
    if (activeType && Object.keys(NodeTypes).includes(activeType)) {
      const component = NodeTypes[activeType as keyof typeof NodeTypes];
      setOverlayComponent(createElement(component));
    } else {
      setOverlayComponent(null);
    }
  }, [activeType]);

  return (
    <>
      <PanelGroup direction="horizontal">
        <Panel>
          <NodeGraph />
        </Panel>
        {dragSuccess && <PanelResizeHandle />}
        <Panel minSize={20} defaultSize={20}>
          <Tray />
        </Panel>
      </PanelGroup>
      <>
        {" "}
        {!dragSuccess && (
          <DragOverlay>
            {overlayComponent && (
              <div
                style={{ transform: `scale(${reactFlow.getZoom()})` }}
                className="opacity-50 origin-top-left"
              >
                {overlayComponent}
              </div>
            )}
          </DragOverlay>
        )}
      </>
    </>
  );
}

export function Editor() {
  return (
    <ReactFlowProvider>
      <DndContext>
        <NodeGraphWithTray />
      </DndContext>
    </ReactFlowProvider>
  );
}
