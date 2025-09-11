import { Route, Routes } from "react-router-dom";
import { Event } from "./components/event/Event";

export default function App() {
  return (
    <Routes>
      <Route path="/event/:urlAlias" element={<Event />} />
    </Routes>
  );
}
