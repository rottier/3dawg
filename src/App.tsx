import logo from "/3dawg.svg";
import "./App.css";
import TimelineComponent from "./components/Timeline";

function App() {
  
  return (
    <main className="w-dvw h-dvh justify-between">
      <div className="fixed w-full h-full bg-gradient-to-r from-[#39C7B7] from-[calc(50%-1px)] to-[#E6234E] to-[50%] pointer-events-none -z-10"></div>
        <img
          src={logo}
          className="animate-mirror-h-instant w-48 h-auto drop-shadow-2xl"
          alt="3DAWG logo"
        />
        <div className={"absolute bottom-0 w-full h-1/4"}>
        <TimelineComponent
         time={0}
         model={{
           rows: [
             {
               keyframes: [
                 {
                   val: 40,
                 },
                 {
                   val: 3000,
                 },
               ],
             },
           ],
         }}
        />
        </div>
    </main>
  );
}

export default App;