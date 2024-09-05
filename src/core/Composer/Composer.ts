import { Subscribable } from "../../utils/Subscribable";
import { AudioGraph } from "../AudioGraph/Nodes";

export class Composer {
    private _graphs: AudioGraph[] = [];
    public readonly onGraphsChange = new Subscribable<AudioGraph[]>(() => this._graphs);

    addGraph() {
        this._graphs.push(new AudioGraph());
    }
    removeGraph(id: string) {
        const index = this._graphs.findIndex((graph) => graph.id === id);
        if (index >= 0) {
            this._graphs.splice(index, 1);
            return true;
        }
        return false;
    }
    findGraph(id: string) {
        return this._graphs.find((graph) => graph.id === id);
    }
}