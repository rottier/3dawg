import { XYPosition } from "@xyflow/react";
import { AudioGraphNode, AudioGraphNodes } from "../../core/AudioGraph";

export type AudioGraphFlowNode = {
    id: string;
    type: AudioGraphNodes;
    position: XYPosition;
    data: {
        audioNode: AudioGraphNode;
    };
}