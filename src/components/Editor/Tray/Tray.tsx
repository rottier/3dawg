import { FunctionComponent } from "react";
import TrayItem from "./TrayItem";
import { AudioGraphNodes } from "../../../core/AudioGraph/types";
import { useComposer } from "../../Composer";
import { PlusIcon } from "@heroicons/react/24/solid";
import { AudioGraph } from "../../../core/AudioGraph/Nodes";

interface TrayProps {}

const Tray: FunctionComponent<TrayProps> = () => {
  const composer = useComposer();

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
            {composer.graphs.map((node, index) => (
              <TrayItem
                key={index}
                node={AudioGraphNodes.Graph}
                id={node.id}
                label={node.label}
              />
            ))}
            <li>
              <a
                className="opacity-50 hover:opacity-100"
                onClick={() => {
                  composer.graphs.push(new AudioGraph());
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
