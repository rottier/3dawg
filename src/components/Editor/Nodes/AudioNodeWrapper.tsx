import { FunctionComponent, ReactNode } from "react";
import ConditionalHandle from "../Handles/ConditionalHandle";
import { Position } from "@xyflow/react";

interface AudioNodeProps {
  header: string;
  children: ReactNode;
  from?: boolean;
  to?: boolean;
}

export const AudioNodeWrapper: FunctionComponent<AudioNodeProps> = ({
  header,
  children,
  from = false,
  to = false,
}) => {
  return (
    <>
      <div className="bg-secondary w-fit h-fit rounded">
        <div className="w-full h-10 flex flex-col items-center justify-center px-4 bg-primary rounded-t">
          {from && <ConditionalHandle type="target" position={Position.Left} className="!top-5 !border-accent !bg-accent !p-1 hover:!p-2" />}
          <h2 className=" text-white font-mono h-fit">
            {header}
          </h2>
          {to && (
            <ConditionalHandle
              type="source"
              position={Position.Right}
              className="!top-5 !border-accent !bg-accent !p-1 hover:!p-2"
            />
          )}
        </div>
        <div className="p-2 nodrag">{children}</div>
      </div>
    </>
  );
};
