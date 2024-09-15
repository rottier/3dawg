import { Subscribable } from "../../utils/Subscribable";
import { AudioGraph } from "../AudioGraph/Nodes";

export class Composer {
    private _graphs: AudioGraph[] = [];
    public readonly onGraphsChange = new Subscribable<AudioGraph[]>(() => this._graphs);
    public get graphs() {
        return this._graphs;
    }

    createNewGraph() {
        const newAudioGraph = new AudioGraph();
        newAudioGraph.prototypeGraphId = newAudioGraph.id;
        this._graphs.push(newAudioGraph);
        this.onGraphsChange.notify();
        return newAudioGraph;
    }

    addGraph(graph: AudioGraph) {
        const i = this._graphs.findIndex((g) => g.id === graph.id);
        if (i >= 0) {
            console.warn(`Graph with id ${graph.id} already exists in the composer`);
        } else {
            this._graphs.push(graph);
            this.onGraphsChange.notify();
        }
    }

    removeGraph(id: string) {
        const index = this._graphs.findIndex((graph) => graph.id === id);
        if (index >= 0) {
            this._graphs.splice(index, 1);
            this.onGraphsChange.notify();
            return true;
        }
        return false;
    }
    
    findGraph(id: string) {
        return this._graphs.find((graph) => graph.id === id);
    }
}