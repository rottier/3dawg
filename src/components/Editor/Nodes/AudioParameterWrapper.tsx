import { FunctionComponent, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import ConditionalHandle from "../Handles/ConditionalHandle";
import { Position } from "@xyflow/react";
import { AudioGraphNode } from "../../../core/AudioGraph/AudioGraphNode";
import { useComposer } from "../../Composer";
import { AudioGraphLink } from "../../../core/AudioGraph";

interface AudioParameterWrapperProps {
    children: ReactNode;
    parameterId: string;
    linkable?: boolean;
    node?: AudioGraphNode;
}

export const AudioParameterWrapper: FunctionComponent<AudioParameterWrapperProps> = ({
    children,
    parameterId,
    linkable = false,
    node
}) => {
    const { links } = useComposer();
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        setConnected(links.findIndex(link => node?.id === link.to.id && link.toParameter === parameterId) > -1);
    }, [links]);

    return (
        <>
            <div className="flex flex-row w-fit h-fit items-center justify-items-center">
                {linkable && <ConditionalHandle type="target" position={Position.Left} id={parameterId} className="!relative !top-0 !border-accent !bg-accent !p-1 hover:!p-2 !transform-none -ml-5 mr-2 hover:mr-1 hover:-ml-6" />}
                <div style={{ pointerEvents: connected ? 'none' : 'auto', opacity: connected ? 0.1 : 1 }}>
                    <div className="flex flex-row gap-2 items-center">
                        <label className="text-white capitalize w-32 text-ellipsis overflow-hidden font-mono">
                            {parameterId}
                        </label>
                        {!connected && children}</div>
                </div>
            </div>
        </>
    );
};
