import { FunctionComponent } from "react";
import { AudioNodeWrapper } from "../AudioNodeWrapper";
import { AudioNodeProps } from "../types";
import { AudioGraph } from "../../../../core/AudioGraph/Nodes";

export const Graph: FunctionComponent = (
  props: AudioNodeProps<AudioGraph>
) => {
  return (
    <AudioNodeWrapper header={props.data?.audioNode?.label ?? "Graph"} to={true}>
      <></>
    </AudioNodeWrapper>
  );
};
