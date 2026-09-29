import { Route, Routes } from "react-router";
import Profile from "./pages/Profile";
import "./App.css";

import Post from "./pages/Post";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Profile />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/post/:id" element={<Post />} />
    </Routes>
  );
}

export default App;
