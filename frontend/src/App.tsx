import { Route, Routes } from "react-router-dom";
import { Event } from "./components/event/Event";
import { Home } from "./components/Home";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/event/:urlAlias" element={<Event />} />
    </Routes>
  );
}
