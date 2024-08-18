import { FunctionComponent } from "react";
import { AudioNodeProps } from "../.";
import { AudioGraphNodeOscillator } from "../../../../core/AudioGraph";
import { AudioNodeWrapper } from "../AudioNodeWrapper";
import { AudioRange } from "../AudioParameters/Range";
import { AudioKnob } from "../AudioParameters/Knob";

export const Oscillator: FunctionComponent = (
  props: AudioNodeProps<AudioGraphNodeOscillator>
) => {
  return (
    <AudioNodeWrapper header="Oscillator" to={true}>
      <div className="w-72 h-fit flex flex-col gap-4">
        <AudioKnob<AudioGraphNodeOscillator>
          audioNode={props.data?.audioNode}
          parameterName="frequency"
          valueStep={0.1}
          valueMin={20}
          valueMax={15000}
          angleMin={-135 - 360}
          angleMax={135 + 360}
          logarithmic={true}
        />
        <AudioRange<AudioGraphNodeOscillator>
          audioNode={props.data?.audioNode}
          parameterName="detune"
          valueMin={-1200}
          valueMax={1200}
        />
      </div>
    </AudioNodeWrapper>
  );
};
