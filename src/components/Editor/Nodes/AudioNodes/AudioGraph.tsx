import { FunctionComponent, useEffect, useState } from "react";
import { AudioNodeWrapper } from "../AudioNodeWrapper";
import { AudioNodeProps } from "../types";
import { AudioGraph } from "../../../../core/AudioGraph/Nodes";
import { useComposer } from "../../../Composer";
import { AudioGraphNodes } from "../../../../core/AudioGraph/types";

export const Graph: FunctionComponent = ({
  data,
}: AudioNodeProps<AudioGraph>) => {
  const composer = useComposer();
  const [graphName, setGraphName] = useState("");
  const [graphNode, setGraphNode] = useState<AudioGraph | undefined>(undefined);

  useEffect(() => {
    if (data?.audioNode) {
      const graphId = data.audioNode.prototypeGraphId;
      const prototypeGraph = composer.graphs.find((g) => g.id === graphId);

      if (prototypeGraph) {
        setGraphName(prototypeGraph.label);
        setGraphNode(prototypeGraph);
      }
    }
  }, [data?.audioNode]);

  return (
    <AudioNodeWrapper
      header={graphName}
      onDoubleClickHeader={() =>
        graphNode ? composer.setActiveGraph(graphNode.id) : undefined
      }
    >
      <div className="flex flex-row gap-4">
        <div>
          {graphNode?.nodes
            .filter((node) => node.type === AudioGraphNodes.Input)
            .sort((a, b) => a.parameters.name.localeCompare(b.parameters.name))
            .map((node, i) => (
              <p className="text-white" key={i}>
                {node.parameters.name}
              </p>
            ))}
        </div>
        <div>
          {graphNode?.nodes
            .filter((node) => node.type === AudioGraphNodes.Output)
            .sort((a, b) => a.parameters.name.localeCompare(b.parameters.name))
            .map((node, i) => (
              <p className="text-white" key={i}>
                {node.parameters.name}
              </p>
            ))}
        </div>
      </div>
    </AudioNodeWrapper>
  );
};
