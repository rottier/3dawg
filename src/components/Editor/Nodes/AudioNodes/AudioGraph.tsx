import { FunctionComponent, useEffect, useState } from "react";
import { AudioNodeWrapper } from "../AudioNodeWrapper";
import { AudioNodeProps } from "../types";
import { AudioGraph } from "../../../../core/AudioGraph/Nodes";
import { useComposer } from "../../../Composer";
import { AudioGraphNodes } from "../../../../core/AudioGraph/types";

export const Graph: FunctionComponent = ({
  data,
  baseGraph,
}: AudioNodeProps<AudioGraph> & { baseGraph?: AudioGraph }) => {
  const composer = useComposer();
  const [graphName, setGraphName] = useState("");
  const [graphNode, setGraphNode] = useState<AudioGraph | undefined>(undefined);

  useEffect(() => {
    if (baseGraph) {
      setGraphName(baseGraph.label);
      setGraphNode(baseGraph);
    } else if (data?.audioNode) {
      const graphId = data.audioNode.graphId;
      const baseGraph = composer.graphs.find((g) => g.id === graphId);

      if (baseGraph) {
        setGraphName(baseGraph.label);
        setGraphNode(baseGraph);
      }
    }
  }, [data?.audioNode, baseGraph]);

  return (
    <AudioNodeWrapper
      header={graphName}
      onDoubleClickHeader={() =>
        data?.audioNode
          ? composer.setActiveGraph(data.audioNode.graphId)
          : undefined
      }
    >
      {graphNode?.nodes
        .filter((node) => node.type === AudioGraphNodes.Output)
        .sort((a, b) => a.parameters.name.localeCompare(b.parameters.name))
        .map((node, i) => (
          <p className="text-white" key={i}>
            {node.parameters.name}
          </p>
        ))}
    </AudioNodeWrapper>
  );
};
