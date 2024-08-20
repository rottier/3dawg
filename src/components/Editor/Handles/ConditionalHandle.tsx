import { Handle, HandleProps, useUpdateNodeInternals } from '@xyflow/react';
import { FunctionComponent, useEffect } from 'react';

type ConditionalHandleProps = HandleProps & {
    updateInternals?: () => void;
}

const ConditionalHandle: FunctionComponent<ConditionalHandleProps> = ({updateInternals, ...restProps }) => {
    try {
        const handle = <Handle {...restProps} />;
        const updateNodeInternals = useUpdateNodeInternals();

        useEffect(() => {
            if (restProps.id)
                updateNodeInternals(restProps.id);
        }, [])

        return handle
    } catch (error) {
        return null
    }
};

export default ConditionalHandle;