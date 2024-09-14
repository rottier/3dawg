import { AudioGraphNodes } from "../../../core/AudioGraph/types";
import { DynamicsCompressor, Gain, Graph, Oscillator, Output, Hidden } from "./AudioNodes";

export const NodeTypes = {
    [`${AudioGraphNodes.Destination}`]: Hidden,
    [`${AudioGraphNodes.Output}`]: Output,
    [`${AudioGraphNodes.Oscillator}`]: Oscillator,
    [`${AudioGraphNodes.Gain}`]: Gain,
    [`${AudioGraphNodes.DynamicsCompressor}`]: DynamicsCompressor,
    [`${AudioGraphNodes.Graph}`]: Graph,
}