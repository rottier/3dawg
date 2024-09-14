import { FunctionComponent } from "react";
import { AudioGraphNodeOutput } from "../../../../core/AudioGraph/Nodes";
import { AudioNodeWrapper } from "../AudioNodeWrapper";
import { AudioNodeProps } from "../types";
import { AudioText } from "../AudioParameters/Text";

export const Output: FunctionComponent = ({
  data,
}: AudioNodeProps<AudioGraphNodeOutput>) => {
  return (
    <AudioNodeWrapper header="Output" from={true}>
      <AudioText<AudioGraphNodeOutput>
        audioNode={data?.audioNode}
        parameterName="name"
      />
    </AudioNodeWrapper>
  );
};
