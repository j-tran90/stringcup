import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";

const RouteSwitch = () => {
  //const { currentUser } = useAuth();
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />

          <Route path='*' element={<h1>404 Not Found!</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default RouteSwitch;
