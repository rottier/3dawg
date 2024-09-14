import { IAudioGraphNode } from "../../../core/AudioGraph/interfaces";
import { AudioGraphNodes } from "../../../core/AudioGraph/types";

export type TrayItemData = {
    id: string;
    type: AudioGraphNodes;
    label: string;
    position: { x: number; y: number };
    graphNode?: IAudioGraphNode
}