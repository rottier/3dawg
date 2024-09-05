import { XYPosition } from "@xyflow/react";
import { AudioGraphNodes } from "../../core/AudioGraph/types";
import { IAudioGraphNode } from "../../core/AudioGraph/interfaces";

export type AudioGraphFlowNode = {
    id: string;
    type: AudioGraphNodes;
    position: XYPosition;
    data: {
        audioNode: IAudioGraphNode;
    };
}