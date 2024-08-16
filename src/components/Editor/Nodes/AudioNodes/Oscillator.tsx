import { FunctionComponent } from "react";
import { AudioNodeProps } from "../.";
import { AudioGraphNodeOscillator } from "../../../../core/AudioGraph";
import { AudioNodeWrapper } from "../AudioNodeWrapper";
import { AudioRange } from "../AudioParameters/Range";

export const Oscillator: FunctionComponent = (
  props: AudioNodeProps<AudioGraphNodeOscillator>
) => {
  return (
    <AudioNodeWrapper header="Oscillator" to={true}>
      <div className="w-72 h-fit flex flex-col gap-4">
        <AudioRange<AudioGraphNodeOscillator>
          audioNode={props.data?.audioNode}
          parameterName="frequency"
          min={20}
          max={15000}
        />
        <AudioRange<AudioGraphNodeOscillator>
          audioNode={props.data?.audioNode}
          parameterName="detune"
          min={-1200}
          max={1200}
        />
      </div>
    </AudioNodeWrapper>
  );
};
