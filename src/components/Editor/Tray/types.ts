import { AudioGraphNodes } from "../../../core/AudioGraph/types";

export type TrayItemData = {
    id: string;
    type: AudioGraphNodes;
    label: string;
    position: { x: number; y: number };
    graphId?: string
}