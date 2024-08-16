import { FunctionComponent } from 'react';
import { AudioGraphNodeOutput } from '../../../../core/AudioGraph';
import { AudioNodeProps } from '../.';
import { AudioNodeWrapper } from '../AudioNodeWrapper';
 
export const Output: FunctionComponent = ({}: AudioNodeProps<AudioGraphNodeOutput>) => {
  return (
    <AudioNodeWrapper header="Output" from={true}><></></AudioNodeWrapper>
  );
}