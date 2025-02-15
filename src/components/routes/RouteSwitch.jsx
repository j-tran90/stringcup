import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ChatRoom from "../pages/ChatRoom";

const RouteSwitch = () => {
  //const { currentUser } = useAuth();
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/chatroom' element={<ChatRoom />} />

          <Route path='*' element={<h1>404 Not Found!</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default RouteSwitch;
