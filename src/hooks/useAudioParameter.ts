import { useState, useEffect } from 'react';
import { AudioGraphNode } from '../core/AudioGraph';

export function useAudioParameter<T extends AudioGraphNode>(
  audioNode: T | undefined,
  parameterName: keyof T['parameters'],
) {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    if (audioNode && 'parameters' in audioNode) {

        if (parameterName in audioNode.parameters)
            setValue(audioNode.parameters[`${String(parameterName)}`]);
    }
  }, [audioNode, parameterName]);

  const updateValue = (newValue: number) => {
    setValue(newValue);
    if (audioNode && 'parameters' in audioNode) {
      audioNode.parameters = {
        [parameterName]: newValue
      };
    }
  };

  return [value, updateValue] as const;
}