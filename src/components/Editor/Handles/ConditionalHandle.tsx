import { Handle, HandleProps, useUpdateNodeInternals } from '@xyflow/react';
import { FunctionComponent } from 'react';


const ConditionalHandle: FunctionComponent<HandleProps> = ({ ...restProps }) => {
    let handle: JSX.Element;
    try {
        handle = <Handle {...restProps} />;
        const updateNodeInternals = useUpdateNodeInternals();
        updateNodeInternals(restProps.id!)
    } catch (error) {
        handle = <></>;
    }

    return handle;
};

export default ConditionalHandle;