import { AudioGraphLink, AudioGraphNodes } from ".";
import { forIn, uniqueId } from 'lodash';

export type AddAudioNode = (type: AudioGraphNodes) => string;
export type RemoveAudioNode = (id: string) => boolean;
export type LinkNodes = (fromId: string, toId: string) => boolean;
export type UnlinkNodes = (fromId: string, toId: string) => boolean;
export type NodesAreLinked = (fromId: string, toId: string) => boolean;

export class AudioGraphNode<AudioNodeType = any, AudioParam = any> {
    context: AudioContext;
    id: string;
    node: AudioNodeType | undefined;
    linkedFrom = [];
    linkedTo = [];
    parameters: Partial<AudioParam>;
    isPlaying: boolean;

    start = () => { this.isPlaying = true };
    stop = () => { this.isPlaying = false }

    constructor(context: AudioContext) {
        this.context = context;
        this.id = uniqueId();
        this.isPlaying = false;
        this.parameters = {};
    }
}

export class AudioGraphNodeOscillator extends AudioGraphNode<OscillatorNode, OscillatorOptions> {
    start = () => {
        this.node = new OscillatorNode(this.context, this.parameters);
        this.node.start();
        this.isPlaying = true;
    }

    stop = () => {
        this.node?.stop();
        this.isPlaying = false;
    };

    constructor(context: AudioContext) {
        super(context);
        this.parameters = {
            detune: 0,
            frequency: 0,
            periodicWave: undefined,
            type: 'sawtooth'
        };
    }
}

export class AudioGraphNodeGain extends AudioGraphNode<GainNode, GainOptions> {
    constructor(context: AudioContext) {
        super(context);
        this.parameters = {
            gain: 0,
        }
    }
}

export class AudioGraph {
    audioContext: AudioContext;
    nodes: AudioGraphNode[];
    links: AudioGraphLink[];
    muted: boolean;
    addAudioNode: AddAudioNode = (type) => {
        const id = uniqueId();
        let newNode: AudioGraphNode<any>;

        switch (type) {
            case AudioGraphNodes.Oscillator:
                newNode = new AudioGraphNodeOscillator(this.audioContext)
                break
            case AudioGraphNodes.Gain:
                newNode = new AudioGraphNodeGain(this.audioContext)
                break
            default:
                throw (`Could not add audio graph node, type unknown: ${type}`)
        }

        this.nodes.push(newNode);

        return id;
    };

    removeAudioNode: RemoveAudioNode = (id) => {
        const i = this.nodes.findIndex(node => node.id === id);
        if (i !== -1) {
            const node = this.nodes[i];

            this.nodes.splice(i, 1);

            // Also remove links when removing a node
            for (let j = this.links.length; j > -1; j--) {
                const link = this.links[j];
                if (id === link.from.id || id === link.to.id) {
                    this.links.splice(j, 1)
                }
            }

            return true;
        }

        return false;
    }

    linkNodes: LinkNodes = (fromId, toId) => {
        let fromNode = null;
        let toNode = null;

        const linkExists = this.links.some(link => link.from.id === fromId && link.to.id === toId);
        if (linkExists) {
            return true;
        }

        for (const node of this.nodes) {
            if (node.id === fromId) {
                fromNode = node;
            }
            if (node.id === toId) {
                toNode = node;
            }
            if (fromNode && toNode) {
                this.links.push({ id: uniqueId(), from: fromNode, to: toNode, muted: false });
                return true;
            }
        }

        return false;
    }

    constructor(context: AudioContext) {
        this.nodes = [];
        this.links = [];
        this.muted = true;
        this.audioContext = context;
    }
}