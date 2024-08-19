import React from "react";
import { AudioGraphNode } from "../../../../core/AudioGraph";
import { useAudioParameter } from "../../../../hooks/useAudioParameter";

interface AudioRangeProps<T extends AudioGraphNode> {
  audioNode: T | undefined;
  parameterName: keyof T["parameters"];
  options: Record<string, string>;
}

export const AudioSelect = <T extends AudioGraphNode>({
  audioNode,
  parameterName,
  options,
}: AudioRangeProps<T>): React.ReactElement => {
  const [value, setValue] = useAudioParameter<T>(audioNode, parameterName);

  return (
    <div className="flex flex-row gap-2 ">
      <label className="text-white capitalize w-32 text-ellipsis overflow-hidden font-mono">
        {String(parameterName)}
      </label>
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
    </div>
  );
};
