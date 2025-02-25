import "./App.css";
import RouteSwitch from "./components/routes/RouteSwitch";
import Drawer from "./components/layout/navigation/Drawer";

function App() {
  return (
    <>
      <RouteSwitch />
      <Drawer />
    </>
  );
}

export default App;
