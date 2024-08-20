import { AudioGraphNodes } from "../../../core/AudioGraph";
import { DynamicsCompressor, Gain, Oscillator, Output } from "./AudioNodes";
import { NodeProps } from "@xyflow/react";
export interface AudioNodeProps<AudioGraphNode> extends Partial<NodeProps>{
    data?: {
        audioNode?: AudioGraphNode;
    }
}

export const NodeTypes = {
    [`${AudioGraphNodes.Output}`]: Output,
    [`${AudioGraphNodes.Oscillator}`]: Oscillator,
    [`${AudioGraphNodes.Gain}`]: Gain,
    [`${AudioGraphNodes.DynamicsCompressor}`]: DynamicsCompressor,
}