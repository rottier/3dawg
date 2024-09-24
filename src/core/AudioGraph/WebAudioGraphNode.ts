import { IAudioNode, TChannelCountMode, TContext } from "standardized-audio-context";
import { globalAudioContext } from "./AudioGraphContext";

export class WebAudioGraphNode implements IAudioNode<TContext> {
    channelCount: number = 0;
    channelCountMode: TChannelCountMode = "max";
    channelInterpretation: "speakers" = "speakers";
    context: TContext = globalAudioContext;
    numberOfInputs: number = 0;
    numberOfOutputs: number = 0;
    parameters: Record<string, any> = {};
    connect() { };
    disconnect() { };
    addEventListener() { };
    removeEventListener() { };
    dispatchEvent() { return false };
}