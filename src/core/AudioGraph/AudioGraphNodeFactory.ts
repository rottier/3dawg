import { AudioGraph, AudioGraphNode, AudioGraphNodeDynamicsCompressor, AudioGraphNodeGain, AudioGraphNodeOscillator, AudioGraphNodeOutput } from "./Nodes";
import { AudioGraphNodeDestination } from "./Nodes/Destination";
import { AudioGraphNodeInput } from "./Nodes/Input";
import { AudioGraphNodes } from "./types";

export const getAudioGraphNodeType = (type: AudioGraphNodes): typeof AudioGraphNode<any, any> => {
    switch (type) {
      case AudioGraphNodes.Destination:
        return AudioGraphNodeDestination;
      case AudioGraphNodes.Oscillator:
        return AudioGraphNodeOscillator;
      case AudioGraphNodes.Gain:
        return AudioGraphNodeGain;
      case AudioGraphNodes.Input:
        return AudioGraphNodeInput;
      case AudioGraphNodes.Output:
        return AudioGraphNodeOutput;
      case AudioGraphNodes.DynamicsCompressor:
        return AudioGraphNodeDynamicsCompressor;
      case AudioGraphNodes.Graph:
        return AudioGraph;
      default:
        throw `Could not add audio graph node, type unknown: ${type}`;
    }
}

export const createAudioGraphNodeOfType = (type: AudioGraphNodes) => {
    const TypeOfNode = getAudioGraphNodeType(type);

    if (typeof TypeOfNode === 'function' && TypeOfNode.prototype instanceof AudioGraphNode) {
        return new (TypeOfNode as { new (): AudioGraphNode })();
    } else {
        throw new Error('Invalid node type or TypeOfNode is not a subclass of AudioGraphNode');
    }
}