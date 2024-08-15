import { FunctionComponent, useEffect, useState } from 'react';
import { Position } from '@xyflow/react';
import ConditionalHandle from '../../Handles/ConditionalHandle';
import { AudioNodeProps } from '.';
import { AudioGraphNodeOscillator } from '../../../../core/AudioGraph';

export const Oscillator: FunctionComponent = (props: AudioNodeProps<AudioGraphNodeOscillator>) => {
  const [audioNode, setAudioNode] = useState<AudioGraphNodeOscillator | null>(null);

  useEffect(() => {
    if (props.data?.audioNode) {
      setAudioNode(props.data.audioNode);
    }
  }, [props.data?.audioNode])

  useEffect(() => {
    if (audioNode) {
      console.log(audioNode.node?.frequency)
    }
  }, [audioNode])

  return (
    <>
      <div className='bg-cyan w-fit p-2 h-fit rounded text-blue' >
        <h2>Oscillator</h2>
        <input type="range" min={0} max={1000} defaultValue={audioNode?.node?.frequency.value} onChange={(e) => {audioNode?.node?.frequency.linearRampToValueAtTime(e.target.valueAsNumber, audioNode.context.currentTime)}} className="range" />
      </div>
      <ConditionalHandle type="source" position={Position.Bottom} />
    </>
  );
}