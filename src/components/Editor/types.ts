import { XYPosition } from "@xyflow/react";
import { AudioGraphNodes } from "../../core/AudioGraph/types";
import { AudioGraphNode } from "../../core/AudioGraph";

export type AudioGraphFlowNode = {
    id: string;
    type: AudioGraphNodes;
    position: XYPosition;
    data: {
        audioNode: AudioGraphNode;
    };
}