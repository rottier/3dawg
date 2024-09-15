import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import ConditionalHandle from "../Handles/ConditionalHandle";
import { Position } from "@xyflow/react";
import { useComposer } from "../../Composer";
import { AudioGraphNode } from "../../../core/AudioGraph";

interface AudioParameterWrapperProps {
  children?: ReactNode;
  parameterId: string;
  linkable?: boolean;
  node?: AudioGraphNode;
  right?: boolean;
}

export const AudioParameterWrapper: FunctionComponent<
  AudioParameterWrapperProps
> = ({ children, parameterId, linkable = false, node, right }) => {
  const { links } = useComposer();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setConnected(
      links.findIndex(
        (link) => node?.id === link.to && link.toParameter === parameterId
      ) > -1
    );
  }, [links]);

  return (
    <div
      className={`flex w-fit h-fit items-center justify-items-end ${
        right ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div className="w-4 h-4 flex flex-col justify-items-center">
        {linkable && (
          <>
            {!right ? (
              <ConditionalHandle
                type="target"
                position={Position.Left}
                id={parameterId}
                className="!relative !top-0 !border-accent !bg-accent !size-full !transform-none -ml-4"
              />
            ) : (
              <ConditionalHandle
                type="target"
                position={Position.Right}
                id={parameterId}
                className="!relative !top-0 !border-accent !bg-accent !size-full !transform-none ml-4"
              />
            )}
          </>
        )}
      </div>
      <div
        style={{
          pointerEvents: connected ? "none" : "auto",
          opacity: connected ? 0.1 : 1,
        }}
      >
        <div className="flex flex-row gap-2 items-center">
          <label
            className={`text-white capitalize w-32 text-ellipsis overflow-hidden font-mono ${
              right ? "text-right" : "text-left"
            }`}
          >
            {parameterId}
          </label>
          {!connected && children}
        </div>
      </div>
    </div>
  );
};
