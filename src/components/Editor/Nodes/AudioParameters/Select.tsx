import React from "react";
import { AudioGraphNode } from "../../../../core/AudioGraph/AudioGraphNode";
import { useAudioParameter } from "../../../../hooks/useAudioParameter";
import { AudioParameterWrapper } from "../AudioParameterWrapper";

interface AudioRangeProps<T extends AudioGraphNode> {
  audioNode: T | undefined;
  parameterName: keyof T["parameters"];
  options: Record<string, string>;
  linkable?: boolean;
}

export const AudioSelect = <T extends AudioGraphNode>({
  audioNode,
  parameterName,
  options,
  linkable = false,
}: AudioRangeProps<T>): React.ReactElement => {
  const [value, setValue] = useAudioParameter<T>(audioNode, parameterName);

  return (
    <AudioParameterWrapper parameterId={String(parameterName)} linkable={linkable} node={audioNode}>
      <select
        value={value ?? 0}
        onChange={(e) => setValue(e.target.value)}
        className="select select-bordered text-white"
      >
        {Object.entries(options).map(([key, value]) => (
          <option key={key} value={key} label={value}>
            {key}
          </option>
        ))}
      </select>
    </AudioParameterWrapper>
  );
};
