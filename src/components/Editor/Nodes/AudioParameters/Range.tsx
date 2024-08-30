import React from "react";
import { useAudioParameter } from "../../../../hooks/useAudioParameter";
import { AudioParameterWrapper } from "../AudioParameterWrapper";
import { AudioGraphNode } from "../../../../core/AudioGraph";

interface AudioRangeProps<T extends AudioGraphNode> {
  audioNode: T | undefined;
  parameterName: keyof T["parameters"];
  valueMin: number;
  valueMax: number;
  valueStep?: number;
  linkable?: boolean;
}

export const AudioRange = <T extends AudioGraphNode>({
  audioNode,
  parameterName,
  valueMin,
  valueMax,
  valueStep = 1,
  linkable = false,
}: AudioRangeProps<T>): React.ReactElement => {
  const [value, setValue] = useAudioParameter<T>(audioNode, parameterName);

  return (
    <AudioParameterWrapper parameterId={String(parameterName)} linkable={linkable} node={audioNode}>
        <input
          type="range"
          min={valueMin}
          max={valueMax}
          step={valueStep}
          value={value ?? 0}
          onChange={(e) => setValue(e.target.valueAsNumber)}
          className="range"
        />
    </AudioParameterWrapper>
  );
};