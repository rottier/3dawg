import { FunctionComponent } from "react";
import { AudioGraphNodeDynamicsCompressor } from "../../../../core/AudioGraph/Nodes";
import { AudioNodeProps } from "..";
import { AudioNodeWrapper } from "../AudioNodeWrapper";
import { AudioKnob } from "../AudioParameters/Knob";
export const DynamicsCompressor: FunctionComponent = ({
  data,
}: AudioNodeProps<AudioGraphNodeDynamicsCompressor>) => {
  return (
    <AudioNodeWrapper header="DynamicsCompressor" to={true} from={true}>
      <div className="w-72 h-fit flex flex-col gap-4">
        <AudioKnob<AudioGraphNodeDynamicsCompressor>
          audioNode={data?.audioNode}
          parameterName="threshold"
          valueStep={1}
          valueMin={-100}
          valueMax={0}
          angleMin={-135}
          angleMax={135}
          linkable={true}
        />
        <AudioKnob<AudioGraphNodeDynamicsCompressor>
          audioNode={data?.audioNode}
          parameterName="knee"
          valueStep={1}
          valueMin={0}
          valueMax={40}
          angleMin={-135}
          angleMax={135}
          linkable={true}
        />
        <AudioKnob<AudioGraphNodeDynamicsCompressor>
          audioNode={data?.audioNode}
          parameterName="ratio"
          valueStep={1}
          valueMin={1}
          valueMax={20}
          angleMin={-135}
          angleMax={135}
          linkable={true}
        />
        <AudioKnob<AudioGraphNodeDynamicsCompressor>
          audioNode={data?.audioNode}
          parameterName="attack"
          valueStep={0.001}
          valueMin={0}
          valueMax={1}
          angleMin={-135}
          angleMax={135}
          linkable={true}
        />
        <AudioKnob<AudioGraphNodeDynamicsCompressor>
          audioNode={data?.audioNode}
          parameterName="release"
          valueStep={0.01}
          valueMin={0}
          valueMax={1}
          angleMin={-135}
          angleMax={135}
          linkable={true}
        />
      </div>
    </AudioNodeWrapper>
  );
};
