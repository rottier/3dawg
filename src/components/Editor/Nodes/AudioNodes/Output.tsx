import { FunctionComponent } from 'react';
import { Position } from '@xyflow/react';
import ConditionalHandle from '../../Handles/ConditionalHandle';
import { AudioGraphNodeOutput } from '../../../../core/AudioGraph';
import { AudioNodeProps } from '.';
 
export const Output: FunctionComponent = (props: AudioNodeProps<AudioGraphNodeOutput>) => {
  return (
    <>
      <div className='bg-cyan w-fit p-2 h-10 rounded text-blue' >Output</div>
      <ConditionalHandle type="target" position={Position.Top} />
    </>
  );
}