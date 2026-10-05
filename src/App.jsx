import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Regjistri from "./pages/Regjistri";
import ShtoAnkese from "./pages/ShtoAnkese";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/regjistri" element={<Regjistri />} />
        <Route path="/ankesa/shto" element={<ShtoAnkese />} />
        <Route path="/perdoruesit" element={<Users />} />
        <Route path="/cilesimet" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;