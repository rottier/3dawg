import React from "react";
import { useAudioParameter } from "../../../../hooks/useAudioParameter";
import Knob from "../../../Controls/Knob";
import { AudioParameterWrapper } from "../AudioParameterWrapper";
import { AudioGraphNode } from "../../../../core/AudioGraph";

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
  linkable?: boolean;
  formatLabel?: (value: number, percentage: number) => string;
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
  modifyValue,
  linkable = false,
  formatLabel
}: AudioRangeProps<T>): React.ReactElement => {
  const [value, setValue] = useAudioParameter<T>(audioNode, parameterName);

  return (
    <AudioParameterWrapper parameterId={String(parameterName)} linkable={linkable} node={audioNode}>
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
          formatLabel={formatLabel}
          onDoubleClick={() => audioNode?.resetParameter(String(parameterName))}
        />
    </AudioParameterWrapper>
  );
};
