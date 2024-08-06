import { FunctionComponent } from "react";

interface TrayProps {

}

const Tray: FunctionComponent<TrayProps> = () => <ul className="menu w-full h-full bg-black bg-opacity-50">
    <li>
        <details open>
            <summary>Compositions</summary>
            <ul>
                <li><a>Composition1</a></li>
                <li><a>Composition2</a></li>
            </ul>
        </details>
        <details open>
            <summary>Nodes</summary>
            <ul>
                <li><a>Oscillator</a></li>
                <li><a>Amplifier</a></li>
            </ul>
        </details>
    </li>
</ul>


export default Tray;