import { FunctionComponent } from "react";
import { AudioNodeProps } from "../.";
import { AudioGraphNodeOscillator } from "../../../../core/AudioGraph";
import { AudioNodeWrapper } from "../AudioNodeWrapper";
import { AudioKnob } from "../AudioParameters/Knob";
import { getNearestNoteFrequency } from "../../../../utils/Music";
import { AudioSelect } from "../AudioParameters/Select";

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
          modifyValue={(value) => getNearestNoteFrequency(value).noteFrequency}
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
      </div>
    </AudioNodeWrapper>
  );
};
