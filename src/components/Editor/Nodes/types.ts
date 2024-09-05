import { NodeProps } from "@xyflow/react";

export interface AudioNodeProps<AudioGraphNode> extends Partial<NodeProps>{
    data?: {
        audioNode?: AudioGraphNode;
    }
}