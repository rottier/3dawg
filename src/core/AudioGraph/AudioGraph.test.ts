import { AudioContext, OscillatorNode, GainNode } from "standardized-audio-context-mock";
vi.mock('standardized-audio-context', () => ({
    AudioContext: AudioContext,
    OscillatorNode: OscillatorNode,
    GainNode: GainNode,
  }));

import { assert, beforeEach, describe, test, vi } from 'vitest';
import { AudioGraph, AudioGraphNodeOscillator } from "./Nodes";
import { AudioGraphNodes } from "./types";

describe("AudioGraph", () => {
    let graph: AudioGraph;

    beforeEach(() => {
        graph = new AudioGraph();
    })

    test("addAudioNode should add a new audio node to the graph", () => {
        const nodeId = graph.addAudioNode(AudioGraphNodes.Oscillator);
        const node = graph.nodes.find((n) => n.id === nodeId);

        assert(node, "Node should be added to the graph");
        assert(node instanceof AudioGraphNodeOscillator, "Node should be an instance of AudioGraphNodeOscillator");
    });

    test("removeAudioNode should remove an audio node from the graph", () => {
        const nodeId = graph.addAudioNode(AudioGraphNodes.Oscillator);
        const result = graph.removeAudioNode(nodeId);

        assert(result, "Node should be removed from the graph");
        assert(!graph.nodes.find((n) => n.id === nodeId), "Node should not exist in the graph");
    });

    test("linkNodes should create a link between two audio nodes", () => {
        const oscillatorId = graph.addAudioNode(AudioGraphNodes.Oscillator);
        const gainId = graph.addAudioNode(AudioGraphNodes.Gain);
        const result = graph.linkNodes(oscillatorId, gainId);

        assert(result, "Link should be created between the nodes");
        assert(graph.findLinkIndex(oscillatorId, gainId) !== -1, "Link should exist in the graph");
    });

    test("unlinkNodes should remove a link between two audio nodes", () => {
        const oscillatorId = graph.addAudioNode(AudioGraphNodes.Oscillator);
        const gainId = graph.addAudioNode(AudioGraphNodes.Gain);
        graph.linkNodes(oscillatorId, gainId);
        const result = graph.unlinkNodes(oscillatorId, gainId);

        assert(result, "Link should be removed between the nodes");
        assert(graph.findLinkIndex(oscillatorId, gainId) === -1, "Link should not exist in the graph");
    });
});

describe("AudioGraphNode", () => {
    const graph = new AudioGraph();
    const graphNode = new AudioGraphNodeOscillator(graph.context, graph);

    test("start should start the node", () => {
        graphNode.start();
        assert(graphNode.isPlaying, "Oscillator should be playing");
    });

    test("stop should stop the node", () => {
        graphNode.stop();
        assert(!graphNode.isPlaying, "Oscillator should not be playing");
    });
});
