import { XYPosition } from "@xyflow/react";
import { AudioGraphNodes } from "../../core/AudioGraph";
import { AudioGraphNode } from "../../core/AudioGraph/AudioGraphNode";

export type AudioGraphFlowNode = {
    id: string;
    type: AudioGraphNodes;
    position: XYPosition;
    data: {
        audioNode: AudioGraphNode;
    };
}