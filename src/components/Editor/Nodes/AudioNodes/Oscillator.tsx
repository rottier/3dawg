import { FunctionComponent } from 'react';
import { Position } from '@xyflow/react';
import ConditionalHandle from '../../Handles/ConditionalHandle';
import { AudioNodeProps } from '.';
import { AudioGraphNodeOscillator } from '../../../../core/AudioGraph';

export const Oscillator: FunctionComponent = (props: AudioNodeProps<AudioGraphNodeOscillator>) => {
  return (
    <>
      <div className='bg-cyan w-fit p-2 h-10 rounded text-blue' >Oscillator</div>
      <ConditionalHandle type="source" position={Position.Bottom} />
    </>
  );
}