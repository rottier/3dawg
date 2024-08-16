import { FunctionComponent } from 'react';
import { AudioGraphNodeGain } from '../../../../core/AudioGraph';
import { AudioNodeProps } from '../.';
import { AudioNodeWrapper } from '../AudioNodeWrapper';
export const Gain: FunctionComponent = ({}: AudioNodeProps<AudioGraphNodeGain>) => {
  return (
      <AudioNodeWrapper header="Gain" to={true} from={true}><></></AudioNodeWrapper>
  );
}