import { TContext, IAudioDestinationNode } from "standardized-audio-context";
import { AudioGraphNode } from "./Node";
import { AudioGraphNodes } from "../types";

export class AudioGraphNodeDestination extends AudioGraphNode<IAudioDestinationNode<TContext>> {
  public readonly type: AudioGraphNodes = AudioGraphNodes.Destination;
  reconstruct = () => (this.node = this.audioContext.destination);
  constructor() {
    super();
    this.reconstruct();
  }
}
