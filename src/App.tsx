import logo from "/3dawg.svg";
import "./App.css";

function App() {
  
  return (
    <main className="w-dvw h-dvh flex flex-col justify-between">
      <div className="fixed w-full h-full bg-gradient-to-r from-[#39C7B7] from-[calc(50%-1px)] to-[#E6234E] to-[50%] pointer-events-none -z-10"></div>
      <div className="flex-grow flex items-center justify-center select-none">
        <img
          src={logo}
          className="animate-mirror-h-instant w-48 h-auto drop-shadow-2xl"
          alt="3DAWG logo"
        />
      </div>
    </main>
  );
}

export default App;