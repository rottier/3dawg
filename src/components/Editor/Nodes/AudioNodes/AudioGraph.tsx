import { FunctionComponent } from "react";
import { AudioNodeWrapper } from "../AudioNodeWrapper";
import { AudioNodeProps } from "../types";
import { AudioGraph } from "../../../../core/AudioGraph/Nodes";
import { useComposer } from "../../../Composer";

export const Graph: FunctionComponent = (props: AudioNodeProps<AudioGraph>) => {
  const composer = useComposer();
  return (
    <AudioNodeWrapper
      header={props.data?.audioNode?.label ?? "Graph"}
      to={true}
      onDoubleClickHeader={() =>
        props.data?.audioNode ? composer.setActiveGraph(props.data.audioNode.graphId) : undefined
      }
    >
      <></>
    </AudioNodeWrapper>
  );
};
