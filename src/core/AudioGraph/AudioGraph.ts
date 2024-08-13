import { AudioGraphLink, AudioGraphNodes } from ".";
import { uniqueId } from 'lodash';

export type AddAudioNode = (type: AudioGraphNodes) => string;
export type RemoveAudioNode = (id: string) => boolean;
export type LinkNodes = (fromId: string, toId: string) => boolean;
export type UnlinkNodes = (fromId: string, toId: string) => boolean;
export type FindLink = (fromId: string, toId: string) => number;

export class AudioGraphNode<Node = AudioNode, Parameters = Record<string, any>> {
    protected readonly context: AudioContext;
    public readonly id: string;
    public node: Node | undefined;
    public readonly linkedFrom: () => AudioGraphNode[] = () => this.graph.links.filter((link) => link.to.id === this.id).map((link) => link.to);
    public readonly linkedTo: () => AudioGraphNode[] = () => this.graph.links.filter((link) => link.from.id === this.id).map((link) => link.from);
    public parameters: Partial<Parameters>;
    protected playing: boolean;
    public get isPlaying() { return this.playing }
    private graph: AudioGraph;

    start = () => {
        this.onStart(); this.linkedTo().forEach((node) => {
            node.node && (this.node as AudioNode)?.connect(node.node);
        });
        this.playing = true;
    };
    stop = () => { this.onStop(); this.playing = false; };
    onStart = () => { };
    onStop = () => { };

    constructor(context: AudioContext, graph: AudioGraph) {
        this.graph = graph;
        this.context = context;
        this.id = uniqueId();
        this.playing = false;
        this.parameters = {};
    }
}

export class AudioGraphNodeOscillator extends AudioGraphNode<OscillatorNode, OscillatorOptions> {
    onStart = () => this.node = new OscillatorNode(this.context, this.parameters);
    onStop = () => this.node?.stop();

    constructor(context: AudioContext, graph: AudioGraph) {
        super(context, graph);
        this.parameters = {
            detune: 0,
            frequency: 3000,
            periodicWave: undefined,
            type: 'sawtooth'
        };
    }
}

export class AudioGraphNodeGain extends AudioGraphNode<GainNode, GainOptions> {
    onStart = () => this.node = new GainNode(this.context, this.parameters);

    constructor(context: AudioContext, graph: AudioGraph) {
        super(context, graph);
        this.parameters = {
            gain: 200,
        }
    }
}

export class AudioGraphNodeOutput extends AudioGraphNode<AudioContext, GainOptions> {
    constructor(context: AudioContext, graph: AudioGraph) {
        super(context, graph);
    }
}


export class AudioGraph {
    play = () => {
        this.audioContext.resume();
        this.nodes.forEach((node) => node.start());

            console.log("Should be playing...")
    }
    private audioContext: AudioContext;
    public readonly nodes: AudioGraphNode[];
    public readonly links: AudioGraphLink[];
    addAudioNode: AddAudioNode = (type) => {
        let newNode: AudioGraphNode;

        switch (type) {
            case AudioGraphNodes.Oscillator:
                newNode = new AudioGraphNodeOscillator(this.audioContext, this)
                break
            case AudioGraphNodes.Gain:
                newNode = new AudioGraphNodeGain(this.audioContext, this)
                break
            case AudioGraphNodes.Output:
                newNode = new AudioGraphNodeOutput(this.audioContext, this) as any;
                break
            default:
                throw (`Could not add audio graph node, type unknown: ${type}`)
        }

        this.nodes.push(newNode);

        return newNode.id;
    };

    removeAudioNode: RemoveAudioNode = (id) => {
        const i = this.nodes.findIndex(node => node.id === id);
        if (i !== -1) {
            this.nodes.splice(i, 1);

            // Also remove links when removing a node
            for (let j = this.links.length - 1; j > -1; j--) {
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

        if (this.findLinkIndex(fromId, toId) > -1)
            return true;

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

    findLinkIndex: FindLink = (fromId, toId) => this.links.findIndex((link) => link.from.id === fromId && link.to.id === toId);

    unlinkNodes: UnlinkNodes = (fromId, toId) => {
        let linkIndex = this.findLinkIndex(fromId, toId);
        let success = false;

        while (linkIndex > -1) {
            this.links.splice(linkIndex, 1);
            success = true;
            linkIndex = this.findLinkIndex(fromId, toId);
        }

        return success;
    }

    constructor(context: AudioContext) {
        this.nodes = [];
        this.links = [];
        this.audioContext = context;
    }
}