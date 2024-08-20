import { NodeProps } from "@xyflow/react";
export * from "./Gain";
export * from "./Oscillator";
export * from "./Output";
export * from "./DynamicsCompressor";

export interface AudioNodeProps<AudioGraphNode> extends Partial<NodeProps>{
    data?: {
        audioNode?: AudioGraphNode;
    }
}