import React from "react";
import { AudioGraphNode } from "../../../../core/AudioGraph";
import { useAudioParameter } from "../../../../hooks/useAudioParameter";

interface AudioRangeProps<T extends AudioGraphNode> {
  audioNode: T | undefined;
  parameterName: keyof T["parameters"];
  valueMin: number;
  valueMax: number;
  valueStep?: number;
}

export const AudioRange = <T extends AudioGraphNode>({
  audioNode,
  parameterName,
  valueMin,
  valueMax,
  valueStep = 1,
}: AudioRangeProps<T>): React.ReactElement => {
  const [value, setValue] = useAudioParameter<T>(audioNode, parameterName);

  return (
    <div className="flex flex-row gap-2 ">
        <label className="text-white capitalize w-32 text-ellipsis overflow-hidden font-mono">{String(parameterName)}</label>
    <input
      type="range"
      min={valueMin}
      max={valueMax}
      step={valueStep}
      value={value ?? 0}
      onChange={(e) => setValue(e.target.valueAsNumber)}
      className="range"
    /></div>
  );
};