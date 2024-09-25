import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AudioGraphNodes } from "../../../core/AudioGraph/types";
import { useComposer } from "../../Composer";
import TrayItem from "./TrayItem";
import { AudioGraphNodeGraph, IAudioGraph } from "../../../core/AudioGraph";
import { set } from "lodash";

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
  const inputRef = useRef<HTMLInputElement | undefined>();

  const renameGraph = useCallback((newName: string, checkOnly = false) => {
    {
      if (!newName) {
        setError("Graph name cannot be empty.");
      } else if (
        composer.graphs.find((g) => g.id !== graph.id && g.label === newName)
      ) {
        setError(`Graph name '${newName}' is already in use.`);
      } else if (checkOnly) {
        setError(undefined);
      } else {
        graph.label = newName;
        setRenamingGraph(false);
        setError(undefined);
      }
    }
  }, []);

  useEffect(() => {
    if (!renamingGraph) setError(undefined);
  }, [renamingGraph]);

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
      graphId={graph.id}
    />
  ) : (
    <li
      className={error && "tooltip tooltip-open w-full h-full max-w-xs"}
      data-tip={error}
    >
      <input
        spellCheck={false}
        ref={(input) => {
          if (input) {
            input.focus();
            inputRef.current = input;
          } else inputRef.current = undefined;
        }}
        onFocus={(e) => setTimeout(() => e.target.select(), 50)}
        defaultValue={graph.label}
        type="text"
        placeholder="New graph name..."
        className={`input w-full max-w-xs h-9 text-sm italic ${
          error && "input-bordered input-error !text-error"
        }`}
        onChange={(e) => renameGraph(e.currentTarget.value, true)}
        onBlur={(e) => {
          renameGraph(e.target.value);
          setRenamingGraph(false);
        }}
        onKeyDown={(e) =>
          e.key === "Enter" && renameGraph(e.currentTarget.value)
        }
      />
    </li>
  );
};
