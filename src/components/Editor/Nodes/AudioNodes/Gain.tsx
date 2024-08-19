import { FunctionComponent } from "react";
import { AudioGraphNodeGain } from "../../../../core/AudioGraph/Nodes";
import { AudioNodeProps } from "../.";
import { AudioNodeWrapper } from "../AudioNodeWrapper";
import { AudioKnob } from "../AudioParameters/Knob";
export const Gain: FunctionComponent = ({
  data,
}: AudioNodeProps<AudioGraphNodeGain>) => {
  return (
    <AudioNodeWrapper header="Gain" to={true} from={true}>
            <div className="w-72 h-fit flex flex-col gap-4">
      <AudioKnob<AudioGraphNodeGain>
          audioNode={data?.audioNode}
          parameterName="gain"
          valueStep={0.01}
          valueMin={0}
          valueMax={1}
          angleMin={-135}
          angleMax={135}
        />
        </div>
    </AudioNodeWrapper>
  );
};
