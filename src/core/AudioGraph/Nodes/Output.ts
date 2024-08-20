import { TContext, IAudioDestinationNode, AudioContext } from "standardized-audio-context";
import { AudioGraphNodes } from "..";
import { AudioGraph } from "../AudioGraph";
import { AudioGraphNode } from "../AudioGraphNode";

export class AudioGraphNodeOutput extends AudioGraphNode<
  IAudioDestinationNode<TContext>
> {
  public readonly type: AudioGraphNodes = AudioGraphNodes.Output;
  constructor(context: AudioContext, graph: AudioGraph) {
    super(context, graph);
    this.node = this.context.destination;
  }
}