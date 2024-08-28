import { FunctionComponent } from "react";
import { AudioNodeProps } from "..";
import { AudioNodeWrapper } from "../AudioNodeWrapper";
import { AudioGraph } from "../../../../core/AudioGraph";

export const Graph: FunctionComponent = (
  props: AudioNodeProps<AudioGraph>
) => {
  return (
    <AudioNodeWrapper header="Graph" to={true}>
      <></>
    </AudioNodeWrapper>
  );
};
