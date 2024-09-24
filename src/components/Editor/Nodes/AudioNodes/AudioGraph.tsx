import { FunctionComponent, useEffect, useState } from "react";
import { AudioNodeWrapper } from "../AudioNodeWrapper";
import { AudioNodeProps } from "../types";
import { AudioGraphNodeGraph } from "../../../../core/AudioGraph/Nodes";
import { useComposer } from "../../../Composer";
import { AudioGraphNodes } from "../../../../core/AudioGraph/types";
import { AudioParameterWrapper } from "../AudioParameterWrapper";
import { IAudioGraph } from "../../../../core/AudioGraph";

export const Graph: FunctionComponent = ({
  data,
}: AudioNodeProps<AudioGraphNodeGraph>) => {
  const composer = useComposer();
  const [graphName, setGraphName] = useState("");
  const [graphNode, setGraphNode] = useState<IAudioGraph | undefined>(undefined);

  useEffect(() => {
    if (data?.audioNode) {
      const graphId = data.audioNode.graphId;
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
      <div className="flex flex-row">
        <div className="flex flex-col gap-4">
          {graphNode?.nodes
            .filter((node) => node.type === AudioGraphNodes.Input)
            .sort((a, b) => a.parameters.name.localeCompare(b.parameters.name))
            .map((node, i) => (
              <AudioParameterWrapper
                key={i}
                parameterId={node.parameters.name}
                linkable={true}
              />
            ))}
        </div>
        <div className="flex flex-col gap-4">
          {graphNode?.nodes
            .filter((node) => node.type === AudioGraphNodes.Output)
            .sort((a, b) => a.parameters.name.localeCompare(b.parameters.name))
            .map((node, i) => (
              <AudioParameterWrapper
                right={true}
                key={i}
                parameterId={node.parameters.name}
                linkable={true}
              />
            ))}
        </div>
      </div>
    </AudioNodeWrapper>
  );
};
