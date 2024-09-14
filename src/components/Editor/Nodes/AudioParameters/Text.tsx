import React from "react";
import { useAudioParameter } from "../../../../hooks/useAudioParameter";
import { AudioParameterWrapper } from "../AudioParameterWrapper";
import { AudioGraphNode } from "../../../../core/AudioGraph";

interface AudioTextProps<T extends AudioGraphNode> {
  audioNode: T | undefined;
  parameterName: keyof T["parameters"];
  linkable?: boolean;
}

export const AudioText = <T extends AudioGraphNode>({
  audioNode,
  parameterName,
  linkable = false,
}: AudioTextProps<T>): React.ReactElement => {
  const [value, setValue] = useAudioParameter<T>(audioNode, parameterName);

  return (
    <AudioParameterWrapper
      parameterId={String(parameterName)}
      linkable={linkable}
      node={audioNode}
    >
      <input
        spellCheck={false}
        onFocus={(e) => setTimeout(() => e.target.select(), 50)}
        value={value || ""}
        type="text"
        className="input input-bordered w-full max-w-xs h-9 text-sm italic text-white"
        onChange={(e) => setValue(e.currentTarget.value)}
        onKeyDown={(e) => e.key === "Enter" && setValue(e.currentTarget.value)}
      />
    </AudioParameterWrapper>
  );
};
