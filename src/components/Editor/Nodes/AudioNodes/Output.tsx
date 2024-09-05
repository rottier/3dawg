import { FunctionComponent } from 'react';
import { AudioGraphNodeOutput } from '../../../../core/AudioGraph/Nodes';
import { AudioNodeWrapper } from '../AudioNodeWrapper';
import { AudioNodeProps } from '../types';
 
export const Output: FunctionComponent = ({}: AudioNodeProps<AudioGraphNodeOutput>) => {
  return (
    <AudioNodeWrapper header="Output" from={true}><></></AudioNodeWrapper>
  );
}