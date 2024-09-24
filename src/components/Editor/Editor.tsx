import {
  createElement,
  ReactNode,
  useCallback,
  useLayoutEffect,
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
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Tray from "./Tray/Tray";
import { NodeTypes } from "./Nodes/helpers";
import { AudioGraphFlowNode } from "./types";
import { TrayItemData } from "./Tray";
import {
  AudioGraphLink,
  IAudioGraphNode,
} from "../../core/AudioGraph/interfaces";
import { AudioGraphNodes } from "../../core/AudioGraph/types";

const proOptions = { hideAttribution: true };

function NodeGraph() {
  const { activeGraph, playing, composer, setActiveGraph, start, stop } = useComposer();
  const reactFlow = useReactFlow();
  useDndMonitor({
    onDragEnd(event) {
      if (event.over?.id === "graph") {
        const data = event.active.data.current as TrayItemData;
        const nodeType = data.type;

        if (activeGraph) {
          let newAudioNode: IAudioGraphNode;
          if (nodeType === AudioGraphNodes.Graph) {
            const prototypeGraph = composer.findGraph(data.id);
            if (!prototypeGraph)
              throw new Error(
                `Cannot add graph with id ${data.id} as it does not exist within the composer.`
              );

            newAudioNode = activeGraph.addAudioNode(AudioGraphNodes.Graph);
            newAudioNode.composer = composer;
            newAudioNode.graphId = data.id;
          } else {
            newAudioNode = activeGraph.addAudioNode(nodeType);
          }

          newAudioNode.position = reactFlow.screenToFlowPosition(data.position);
        }
      }
    },
  });
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

  useLayoutEffect(() => activeGraph?.onNodes.notify(), [nodes.length]);
  useLayoutEffect(() => activeGraph?.onLinks.notify(), [edges.length]);

  useLayoutEffect(() => {
    if (activeGraph) {
      const lastGraph = activeGraph;
      const subscriptionNode = (graphNodes: IAudioGraphNode[]) => {
        const newNodes: AudioGraphFlowNode[] = [];
        graphNodes.forEach((graphNode) => {
          newNodes.push({
            id: graphNode.id,
            type: graphNode.type,
            position: graphNode.position,
            data: {
              audioNode: graphNode,
            },
          });
        });
        setNodes(newNodes);
      };
      lastGraph?.onNodes.subscribe(subscriptionNode);

      const subscriptionLinks = (links: AudioGraphLink[]) => {
        const newEdges: typeof edges = [];
        links.forEach((link) =>
          newEdges.push({
            id: link.id,
            source: link.from,
            target: link.to,
            sourceHandle: link.fromParameter,
            targetHandle: link.toParameter,
          })
        );
        setEdges(newEdges);
      };
      lastGraph?.onLinks.subscribe(subscriptionLinks);

      reactFlow.fitView();

      return () => {
        lastGraph?.onNodes.unsubscribe(subscriptionNode);
        lastGraph?.onLinks.unsubscribe(subscriptionLinks);
      };
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [activeGraph]);

  const onConnect = useCallback<OnConnect>(
    (params) => {
      activeGraph?.linkNodes(
        params.source,
        params.target,
        params.sourceHandle || undefined,
        params.targetHandle || undefined
      );
    },
    [activeGraph]
  );

  const onDelete = useCallback<OnDelete>(
    (params) => {
      params.nodes.forEach((node) => activeGraph?.removeAudioNode(node.id));
      params.edges.forEach((edge) =>
        activeGraph?.unlinkNodes(
          edge.source,
          edge.target,
          edge.sourceHandle || undefined,
          edge.targetHandle || undefined
        )
      );
    },
    [activeGraph]
  );

  return (
    <div className={"w-full h-full flex flex-col"}>
      <div ref={setNodeRef} className={`w-full h-full bg-black bg-opacity-60`}>
        {activeGraph ? (
          <ReactFlow
            className="!text-secondary"
            nodeTypes={NodeTypes}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDelete={onDelete}
            onNodeDrag={(_, node) => {
              node.data.audioNode.position = node.position;
            }}
            proOptions={proOptions}
            colorMode="light"
            minZoom={0.1}
            onEdgeClick={(_, edge) =>
              activeGraph?.unlinkNodes(
                edge.source,
                edge.target,
                edge.sourceHandle,
                edge.targetHandle
              )
            }
          >
            <Controls />
          </ReactFlow>
        ) : (
          <div className="w-full h-full flex flex-col gap-2 items-center justify-center bg-black/50 select-none">
            <p className="text-white/50 text-3xl text-center font-light">
              Select a graph...
            </p>
            <p className="text-white/50 text-2xl text-center font-light">
              ...or click{" "}
              <a
                className="cursor-pointer"
                onClick={() => setActiveGraph(composer.createNewGraph().id)}
              >
                here
              </a>{" "}
              to add a new graph
            </p>
          </div>
        )}
      </div>
      {activeGraph && (
        <div className="flex flex-row gap-1 p-1">
          <button
            className="btn btn-wide btn-accent"
            onClick={() =>
              playing
                ? stop()
                : start()
            }
          >
            {playing ? "Stop" : "Play"}
          </button>
        </div>
      )}
    </div>
  );
}

function NodeGraphWithTray() {
  const [dragSuccess, setDragSuccess] = useState(false);
  const [overlayComponent, setOverlayComponent] = useState<ReactNode | null>(
    null
  );
  const [activeType, setActiveType] = useState<string | undefined>(undefined);
  const [audioGraphNode, setAudioGraphNode] = useState<IAudioGraphNode | undefined>(undefined);
  const reactFlow = useReactFlow();

  useDndMonitor({
    onDragStart(event) {
      setDragSuccess(false);
      const type = String(event.active.data.current?.type)
      setActiveType(type);

      if (type === AudioGraphNodes.Graph)
        setAudioGraphNode(event.active.data.current?.graphNode as IAudioGraphNode);
      else
        setAudioGraphNode(undefined)

    },
    onDragEnd(event) {
      setActiveType(undefined);
      setAudioGraphNode(undefined);
      if (event.over?.id === "graph") {
        setDragSuccess(true);
      }
    },
  });

  useLayoutEffect(() => {
    if (activeType && Object.keys(NodeTypes).includes(activeType)) {
      const component = NodeTypes[activeType as keyof typeof NodeTypes];
      setOverlayComponent(
        createElement(component, { id: "previewOverlay", data: {
          audioNode: audioGraphNode
        } } as React.Attributes)
      );
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
