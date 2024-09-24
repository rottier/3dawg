import { AudioGraphNode } from "./Node";
import { AudioGraphNodes } from "../types";
import { Composer } from "../../Composer/Composer";
import { IAudioGraph } from "../interfaces";
import { JsonProperty } from "@paddls/ts-serializer";
import { IAudioNode, TContext } from "standardized-audio-context";

export class AudioGraphNodeGraph extends AudioGraphNode<IAudioGraph> {
    public readonly type: AudioGraphNodes = AudioGraphNodes.Graph;
    private _composer?: Composer;
    private _graphId?: string;
    private _nodesToDisconnect?: { from: IAudioNode<TContext>; to: IAudioNode<TContext> }[] = [];
    @JsonProperty() public get graphId(): string | undefined {
        return this._graphId;
    }
    public set graphId(id: string) {
        if (!this._composer?.findGraph(id))
            throw new Error(
                `Cannot set graphId to ${id} as it does not exist within the composer.`
            );

        this._graphId = id;

        this.reconstruct();
    }
    public get composer(): Composer | undefined {
        return this._composer;
    }
    public set composer(value: Composer) {
        this._composer = value;
    }
    reconstruct = () => {
        if (this._composer && this.graphId) {
            const node = this._composer.findGraph(this.graphId);

            if (node) {
                this.node = node.copy();

                const ioNodes = node.nodes.filter((n) => n.type === AudioGraphNodes.Input || n.type === AudioGraphNodes.Output);

                const newParameters: Record<string, string> = {};
                ioNodes.forEach((n) => newParameters[n.parameters.name] = n.id);

                this._parameters = {
                    ...
                    newParameters
                }
                this._parametersDefault = {...this._parameters}
            }
        };
    };

    onStart = () => {
        if (this.node) {
            this.linksFrom().forEach((link) => {
                const fromNode = this.graph?.findAudioNode(link.from);
                const toNode = this.node?.nodes.find((n) => n.type === AudioGraphNodes.Input && n.parameters.name === link.toParameter);

                if (fromNode && toNode && toNode.node && fromNode.node) {
                    const connected = fromNode.node.connect(toNode.node, toNode.parameters.name);

                    if (connected)
                        this._nodesToDisconnect?.push({ from: fromNode.node, to: toNode.node });
                }
                else {
                    throw new Error(`Cannot connect node ${link.from} to ${link.to}.`);
                }
            });

            this.linksTo().forEach((link) => {
                const fromNode = this.node?.nodes.find((n) => n.type === AudioGraphNodes.Output && n.parameters.name === link.fromParameter);
                const toNode = this.graph?.findAudioNode(link.to);

                if (fromNode && toNode && toNode.node && fromNode.node) {
                    const connected = fromNode.node.connect(toNode.node, toNode.parameters.name);

                    if (connected)
                        this._nodesToDisconnect?.push({ from: fromNode.node, to: toNode.node });
                } else {
                    throw new Error(`Cannot connect node ${link.from} to ${link.to}.`);
                }
            });

            this.node.start();
        }
    };

    onBeforeStop = () => {

        this._nodesToDisconnect?.forEach((nodes) => {
            nodes.from.disconnect(nodes.to);
        }
        )

        if (this.node) {
            this.node.stop();
        }
    };

    constructor() {
        super();
        this.reconstruct();
    }
}
