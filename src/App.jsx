import "./App.css";
import RouteSwitch from "./components/routes/RouteSwitch";
import Drawer from "./components/layout/navigation/Drawer";
import AuthProvider from "./contexts/AuthContext";

function App() {
  return (
    <>
      <AuthProvider>
        <RouteSwitch />
        <Drawer />
      </AuthProvider>
    </>
  );
}

export default App;
