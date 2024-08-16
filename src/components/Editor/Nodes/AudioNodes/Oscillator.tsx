import { FunctionComponent } from "react";
import { AudioNodeProps } from "../.";
import { AudioGraphNodeOscillator } from "../../../../core/AudioGraph";
import { AudioNodeWrapper } from "../AudioNodeWrapper";
import { useAudioParameter } from "../../../../hooks/useAudioParameter";

export const Oscillator: FunctionComponent = (
  props: AudioNodeProps<AudioGraphNodeOscillator>
) => {
  const [frequency, setFrequency] = useAudioParameter<AudioGraphNodeOscillator>(props.data?.audioNode!, 'frequency');

  return (
    <AudioNodeWrapper header="Oscillator" to={true}>
      <div className="w-72 h-fit">
        <input
          type="range"
          min={20}
          max={15000}
          value={frequency}
          onChange={(e) => setFrequency(e.target.valueAsNumber)}
          className="range"
        />
      </div>
    </AudioNodeWrapper>
  );
};