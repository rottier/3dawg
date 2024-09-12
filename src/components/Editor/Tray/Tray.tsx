import { FunctionComponent, useEffect, useState } from "react";
import TrayItem from "./TrayItem";
import { AudioGraphNodes } from "../../../core/AudioGraph/types";
import { useComposer } from "../../Composer";
import { PlusIcon } from "@heroicons/react/24/solid";
import { AudioGraph } from "../../../core/AudioGraph/Nodes";

interface TrayProps {}

const Tray: FunctionComponent<TrayProps> = () => {
  const composer = useComposer();
  const [graphs, setGraphs] = useState<AudioGraph[]>(composer.graphs);
  const [renamingGraph, setRenamingGraph] = useState<string | undefined>();

  useEffect(() => {
    const subscription = (graphs: AudioGraph[]) => {
      setGraphs([...graphs]);
    };
    composer.composer.onGraphsChange.subscribe(subscription);

    return () => {
      composer.composer.onGraphsChange.unsubscribe(subscription);
    };
  }, []);

  return (
    <ul className="menu w-full h-full bg-black bg-opacity-50">
      <li>
        <details open>
          <summary>Nodes</summary>
          <ul>
            {Object.values(AudioGraphNodes).map(
              (node, index) =>
                node !== AudioGraphNodes.Invalid &&
                node !== AudioGraphNodes.Graph && (
                  <TrayItem key={index} node={node} />
                )
            )}
          </ul>
        </details>
        <details open>
          <summary>Graphs</summary>
          <ul>
            {graphs.map((graph, index) =>
              renamingGraph === graph.id ? (
                <li key={index}>
                  <input
                    defaultValue={graph.label}
                    type="text"
                    placeholder="New graph name..."
                    className="input w-full max-w-xs h-9 text-sm"
                    onBlur={(e) => {
                      if (e.target.value && !composer.graphs.find((g) => g.id !== graph.id && g.label === e.target.value))
                      {
                        graph.label = e.target.value;
                        setRenamingGraph(undefined);
                      }
                      else
                        alert(`Graph name ${e.target.value} is already in use.`);

                    }}
                  />
                </li>
              ) : (
                <TrayItem
                  key={index}
                  node={AudioGraphNodes.Graph}
                  id={graph.id}
                  label={graph.label}
                  active={graph === composer.activeGraph}
                  onDoubleClick={() =>
                    graph === composer.activeGraph
                      ? setRenamingGraph(graph.id)
                      : composer.setActiveGraph(graph.id)
                  }
                />
              )
            )}
              <li>
                <a
                  className={`opacity-50 hover:opacity-100`}
                  onClick={() => {
                    const graph = composer.composer.createNewGraph();
                    let index = 1;
                    let name = "Graph 1";
                    while (composer.graphs.find((g) => g.label === name)) {
                      index++;
                      name = `Graph ${index}`;
                    }

                    graph.label = name;
                    composer.setActiveGraph(graph.id);
                  }}
                >
                  <PlusIcon className="size-4 text-accent" />
                  New
                </a>
              </li>
          </ul>
        </details>
      </li>
    </ul>
  );
};

export default Tray;
