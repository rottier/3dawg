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

    test("addAudioNode should add a new audio node to the graph when provided a type", () => {
        const node = graph.addAudioNode(AudioGraphNodes.Oscillator);

        assert(node, "Node should be added to the graph");
        assert(node instanceof AudioGraphNodeOscillator, "Node should be an instance of AudioGraphNodeOscillator");
    });

    test("addAudioNode should add a new audio node to the graph when provided a node", () => {
        const node = new AudioGraphNodeOscillator()
        const success = graph.addAudioNode(node);
        assert(success, "addAudioNode should notify a succesful addition");
        const foundNode = graph.findAudioNode(node.id);

        assert(foundNode, "Node should be added to the graph");
        assert(foundNode instanceof AudioGraphNodeOscillator, "Node should be an instance of AudioGraphNodeOscillator");
    });

    test("removeAudioNode should remove an audio node from the graph", () => {
        const node = graph.addAudioNode(AudioGraphNodes.Oscillator);
        const result = graph.removeAudioNode(node);

        assert(result, "Node should be removed from the graph");
        assert(!graph.nodes.find((n) => n.id === node.id), "Node should not exist in the graph");
    });

    test("removeAudioNode should remove an audio node from the graph when provided a node", () => {
        const node = graph.addAudioNode(AudioGraphNodes.Oscillator);
        const result = graph.removeAudioNode(node);

        assert(result, "Node should be removed from the graph");
        assert(!graph.nodes.find((n) => n.id === node.id), "Node should not exist in the graph");
    });

    test("linkNodes should create a link between two audio nodes when", () => {
        const osc = graph.addAudioNode(AudioGraphNodes.Oscillator);
        const gain = graph.addAudioNode(AudioGraphNodes.Gain);
        const result = graph.linkNodes(osc.id, gain.id);

        assert(result, "Link should be created between the nodes");
        assert(graph.findLinkIndex(osc.id, gain.id) !== -1, "Link should exist in the graph");
    });

    test("unlinkNodes should remove a link between two audio nodes", () => {
        const osc = graph.addAudioNode(AudioGraphNodes.Oscillator);
        const gain = graph.addAudioNode(AudioGraphNodes.Gain);
        graph.linkNodes(osc.id, gain.id);
        const result = graph.unlinkNodes(osc.id, gain.id);

        assert(result, "Link should be removed between the nodes");
        assert(graph.findLinkIndex(osc.id, gain.id) === -1, "Link should not exist in the graph");
    });
});

describe("AudioGraphNode", () => {
    const graphNode = new AudioGraphNodeOscillator();

    test("start should start the node", () => {
        graphNode.start();
        assert(graphNode.isPlaying, "Oscillator should be playing");
    });

    test("stop should stop the node", () => {
        graphNode.stop();
        assert(!graphNode.isPlaying, "Oscillator should not be playing");
    });
});
