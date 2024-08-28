import { FunctionComponent } from "react";
import { AudioNodeProps } from "../.";
import { AudioGraphNodeOscillator } from "../../../../core/AudioGraph/Nodes";
import { AudioNodeWrapper } from "../AudioNodeWrapper";
import { AudioKnob } from "../AudioParameters/Knob";
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
          linkable={true}
          formatLabel={(newValue) => {
            switch (true) {
              case newValue >= 1000:
                return`${(newValue / 1000).toFixed(0)} kHz`;
              case newValue < 10:
                return `${(newValue * 1000).toFixed(0)} mHz`;
              default:
                return `${(newValue).toFixed(0)} Hz`;
            }          
          }}
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
          formatLabel={(value) => `${Math.round(value)} ¢`}
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
