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
      <AudioKnob<AudioGraphNodeGain>
        audioNode={data?.audioNode}
        parameterName="gain"
        valueStep={0.01}
        valueMin={0.001}
        valueMax={10000}
        angleMin={-135}
        angleMax={135}
        linkable={true}
        logarithmic={true}
        formatLabel={(newValue) => {
          switch (true) {
            case newValue >= 100:
              return `×${newValue.toFixed(0)}`;
            case newValue >= 10:
              return `×${newValue.toFixed(1)}`;
            case newValue >= 1:
              return `×${newValue.toFixed(2)}`;
            default:
              return `×${newValue.toFixed(3)}`;
          }
        }}
      />
    </AudioNodeWrapper>
  );
};
