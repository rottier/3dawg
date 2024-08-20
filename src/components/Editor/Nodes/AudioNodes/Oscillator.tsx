import { FunctionComponent } from "react";
import { AudioNodeProps } from "../.";
import { AudioGraphNodeOscillator } from "../../../../core/AudioGraph/Nodes";
import { AudioNodeWrapper } from "../AudioNodeWrapper";
import { AudioKnob } from "../AudioParameters/Knob";
import { getNearestNoteFrequency } from "../../../../utils/Music";
import { AudioSelect } from "../AudioParameters/Select";

export const Oscillator: FunctionComponent = (
  props: AudioNodeProps<AudioGraphNodeOscillator>
) => {
  return (
    <AudioNodeWrapper header="Oscillator" to={true}>
        <AudioKnob<AudioGraphNodeOscillator>
          audioNode={props.data?.audioNode}
          parameterName="frequency"
          valueStep={0.1}
          valueMin={1}
          valueMax={15000}
          angleMin={-135 - 360}
          angleMax={135 + 360}
          logarithmic={true}
          modifyValue={(value) => getNearestNoteFrequency(value).noteFrequency}
          linkable={true}
        />
        <AudioKnob<AudioGraphNodeOscillator>
          audioNode={props.data?.audioNode}
          parameterName="detune"
          valueStep={1}
          valueMin={-1200}
          valueMax={1200}
          angleMin={-135 - 360}
          angleMax={135 + 360}
          linkable={true}
        />
        <AudioSelect<AudioGraphNodeOscillator>
          audioNode={props.data?.audioNode}
          parameterName="type"
          options={{
            sawtooth: "Sawtooth",
            sine: "Sine",
            square: "Square",
            triangle: "Triangle",
          }}
        />
    </AudioNodeWrapper>
  );
};
