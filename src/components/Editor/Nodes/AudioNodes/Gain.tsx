import { FunctionComponent } from 'react';
import { Position } from '@xyflow/react';
import ConditionalHandle from '../../Handles/ConditionalHandle';
import { AudioGraphNodeGain } from '../../../../core/AudioGraph';
import { AudioNodeProps } from '.';
export const Gain: FunctionComponent = (props: AudioNodeProps<AudioGraphNodeGain>) => {
  return (
    <>
      <div className='bg-cyan w-fit p-2 h-10 rounded text-blue' >Gain</div>
      <ConditionalHandle type="target" position={Position.Top} />
      <ConditionalHandle type="source" position={Position.Bottom} />
    </>
  );
}