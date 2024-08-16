import { FunctionComponent } from "react";
import { AudioGraphNodeGain } from "../../../../core/AudioGraph";
import { AudioNodeProps } from "../.";
import { AudioNodeWrapper } from "../AudioNodeWrapper";
import { AudioRange } from "../AudioParameters/Range";
export const Gain: FunctionComponent = ({
  data,
}: AudioNodeProps<AudioGraphNodeGain>) => {
  return (
    <AudioNodeWrapper header="Gain" to={true} from={true}>
      {" "}
      <AudioRange<AudioGraphNodeGain>
        audioNode={data?.audioNode}
        parameterName="gain"
        min={0}
        max={1}
        step={0.01}
      />
    </AudioNodeWrapper>
  );
};
