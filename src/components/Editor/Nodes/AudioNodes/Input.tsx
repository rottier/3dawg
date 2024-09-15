import { FunctionComponent } from "react";
import { AudioNodeWrapper } from "../AudioNodeWrapper";
import { AudioNodeProps } from "../types";
import { AudioText } from "../AudioParameters/Text";
import { AudioGraphNodeInput } from "../../../../core/AudioGraph/Nodes/Input";

export const Input: FunctionComponent = ({
  data,
}: AudioNodeProps<AudioGraphNodeInput>) => {
  return (
    <AudioNodeWrapper header="Input" to={true}>
      <AudioText<AudioGraphNodeInput>
        audioNode={data?.audioNode}
        parameterName="name"
      />
    </AudioNodeWrapper>
  );
};
