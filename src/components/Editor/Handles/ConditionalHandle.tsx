import { Handle, HandleProps, useNodeId, useUpdateNodeInternals } from '@xyflow/react';
import { FunctionComponent, useEffect } from 'react';

type ConditionalHandleProps = HandleProps & {
    updateInternals?: () => void;
}

const ConditionalHandle: FunctionComponent<ConditionalHandleProps> = ({updateInternals, ...restProps }) => {
    const nodeId = useNodeId();

    if (nodeId) {
        const handle = <Handle {...restProps} />;
        const updateNodeInternals = useUpdateNodeInternals();

        useEffect(() => {
            if (restProps.id)
                updateNodeInternals(restProps.id);
        }, [])

        return handle
    } else {
        return <></>;
    }
};

export default ConditionalHandle;