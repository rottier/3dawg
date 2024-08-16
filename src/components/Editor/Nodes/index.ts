import { AudioGraphNodes } from "../../../core/AudioGraph";
import { Gain } from "./AudioNodes/Gain";
import { Oscillator } from "./AudioNodes/Oscillator";
import { Output } from "./AudioNodes/Output";
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
}