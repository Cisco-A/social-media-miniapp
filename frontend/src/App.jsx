import { Route, Routes } from "react-router";
import Profile from "./pages/Profile";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Profile />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
