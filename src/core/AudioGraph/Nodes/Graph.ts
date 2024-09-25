import { AudioGraphNode } from "./Node";
import { AudioGraphNodes } from "../types";
import { Composer } from "../../Composer/Composer";
import { IAudioGraph } from "../interfaces";
import { JsonProperty } from "@paddls/ts-serializer";

export class AudioGraphNodeGraph extends AudioGraphNode<IAudioGraph> {
    public readonly type: AudioGraphNodes = AudioGraphNodes.Graph;
    private _composer?: Composer;
    @JsonProperty('graphId') private _graphId?: string;
    public get graphId(): string | undefined {
        return this._graphId;
    }
    public set graphId(id: string) {
        if (!this._composer?.findGraph(id))
            throw new Error(
                `Cannot set graphId to ${id} as it does not exist within the composer.`
            );

        this._graphId = id;

        this._reassignNode();
    }
    public get composer(): Composer | undefined {
        return this._composer;
    }
    public set composer(value: Composer) {
        this._composer = value;

        this._reassignNode();
    }

    private _reassignNode = () => {
        if (this._composer && this.graphId) {
            const graph = this._composer.findGraph(this.graphId);

            if (graph) {
                this.node = graph.copy();

                const ioNodes = graph.nodes.filter((n) => n.type === AudioGraphNodes.Input || n.type === AudioGraphNodes.Output);

                const newParameters: Record<string, string> = {};
                ioNodes.forEach((n) => newParameters[n.parameters.name] = n.id);

                this._parameters = {
                    ...
                    newParameters
                }
                this._parametersDefault = {...this._parameters}

                return true;
            }
        };

    }

    onBeforeStart = () => this.node?.start();

    onStop = () => this.node?.stop();

    numberOfInputs = () => {
        return this.node?.nodes.filter((n) => n.type === AudioGraphNodes.Input).length || 0;
    }

    numberOfOutputs = () => {
        return this.node?.nodes.filter((n) => n.type === AudioGraphNodes.Output).length || 0;
    }

    reconstruct = () => this._reassignNode() && this.node?.reconstruct();

    constructor() {
        super();
    }
}
