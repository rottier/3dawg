import { useState, useEffect, useCallback } from 'react';
import { AudioGraphNode } from '../core/AudioGraph';

export function useAudioParameter<T extends AudioGraphNode>(
  audioNode: T | undefined,
  parameterName: keyof T['parameters'],
) {
  const [value, setValue] = useState<any>();
  const [subscribed, setSubscribed] = useState(false);

  const subscription = useCallback((parameters: Partial<T['parameters']>) => {
    setValue(parameters[`${String(parameterName)}`]);
  }, [parameterName]);

  useEffect(() => {
    if (audioNode && 'parameters' in audioNode) {

        if (parameterName in audioNode.parameters) {
          audioNode.onParameterChange.subscribe(subscription);
          setSubscribed(true);
          setValue(audioNode.parameters[`${String(parameterName)}`]);
        }

        return () => {
          if (subscribed) {
            audioNode.onParameterChange.unsubscribe(subscription);
            setSubscribed(false);
          }
        }
    }
  }, [audioNode, subscription]);

  const updateValue = (newValue: any) => {
    setValue(newValue);
    if (audioNode && 'parameters' in audioNode) {
      audioNode.parameters = {
        [parameterName]: newValue
      };
    }
  };

  return [value, updateValue] as const;
}