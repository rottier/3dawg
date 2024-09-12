import { FunctionComponent, useEffect, useState } from "react";
import { AudioGraph as IAudioGraph } from "../../../core/AudioGraph/Nodes";
import { AudioGraphNodes } from "../../../core/AudioGraph/types";
import { useComposer } from "../../Composer";
import TrayItem from "./TrayItem";

interface TrayItemGraphProps {
  graph: IAudioGraph;
  index: number;
}

export const TrayItemGraph: FunctionComponent<TrayItemGraphProps> = ({
  graph,
}) => {
  const { composer, setActiveGraph, activeGraph } = useComposer();
  const [renamingGraph, setRenamingGraph] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  return !renamingGraph ? (
    <TrayItem
      node={AudioGraphNodes.Graph}
      id={graph.id}
      label={graph.label}
      active={graph === activeGraph}
      onDoubleClick={() =>
        graph.id === activeGraph?.id
          ? setRenamingGraph(true)
          : setActiveGraph(graph.id)
      }
    />
  ) : (
    <li>
      <input
        ref={(input) => input && input.focus()}
        onFocus={(e) => setTimeout(() => e.target.select(), 50)}
        defaultValue={graph.label}
        type="text"
        placeholder="New graph name..."
        className={`input w-full max-w-xs h-9 text-sm italic ${
          error && "input-bordered input-error"
        }`}
        onChange={() => setError(undefined)}
        onBlur={(e) => {
          if (!e.target.value) {
            setError("Graph name cannot be empty.");
          } else if (
            composer.graphs.find(
              (g) => g.id !== graph.id && g.label === e.target.value
            )
          ) {
            setError(`Graph name '${e.target.value}' is already in use.`);
          } else {
            graph.label = e.target.value;
            setRenamingGraph(false);
          }
        }}
      />
    </li>
  );
};
