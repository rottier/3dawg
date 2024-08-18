import React from "react";
import { AudioGraphNode } from "../../../../core/AudioGraph";
import { useAudioParameter } from "../../../../hooks/useAudioParameter";
import Knob from "../../../Controls/Knob";

interface AudioRangeProps<T extends AudioGraphNode> {
  audioNode: T | undefined;
  parameterName: keyof T["parameters"];
  valueMin: number;
  valueMax: number;
  valueStep?: number;
  logarithmic?: boolean;
  angleMin?: number;
  angleMax?: number;
  modifyValue?: (value: number) => number;
}

export const AudioKnob = <T extends AudioGraphNode>({
  audioNode,
  parameterName,
  valueMin,
  valueMax,
  valueStep = 1,
  logarithmic = false,
  angleMin = 0,
  angleMax = 359,
  modifyValue
}: AudioRangeProps<T>): React.ReactElement => {
  const [value, setValue] = useAudioParameter<T>(audioNode, parameterName);

  return (
    <div className="flex flex-row gap-2 ">
      <label className="text-white capitalize w-32 text-ellipsis overflow-hidden font-mono">
        {String(parameterName)}
      </label>
      <Knob
        angleMin={angleMin}
        angleMax={angleMax}
        valueMin={valueMin}
        valueMax={valueMax}
        valueStep={valueStep}
        value={value}
        onValueChange={(value) => {
          if (modifyValue)
            value = modifyValue(value);

          setValue(value)
        }}
        logarithmic={logarithmic}
      />
    </div>
  );
};
