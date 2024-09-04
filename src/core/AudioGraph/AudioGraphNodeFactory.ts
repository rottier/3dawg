import { AudioGraph, AudioGraphNodes } from ".";
import { AudioGraphNode } from "./AudioGraphNode";
import { AudioGraphNodeDynamicsCompressor, AudioGraphNodeGain, AudioGraphNodeOscillator, AudioGraphNodeOutput } from "./Nodes";

export const getAudioGraphNodeType = (type: AudioGraphNodes): typeof AudioGraphNode<any, any> => {
    switch (type) {
      case AudioGraphNodes.Oscillator:
        return AudioGraphNodeOscillator;
      case AudioGraphNodes.Gain:
        return AudioGraphNodeGain;
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