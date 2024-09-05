import { AudioGraphNodes } from "../../../core/AudioGraph/types";
import { DynamicsCompressor, Gain, Graph, Oscillator, Output } from "./AudioNodes";

export const NodeTypes = {
    [`${AudioGraphNodes.Output}`]: Output,
    [`${AudioGraphNodes.Oscillator}`]: Oscillator,
    [`${AudioGraphNodes.Gain}`]: Gain,
    [`${AudioGraphNodes.DynamicsCompressor}`]: DynamicsCompressor,
    [`${AudioGraphNodes.Graph}`]: Graph,
}