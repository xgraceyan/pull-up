import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Event } from "./components/event/Event";
import { Home } from "./components/Home";
import { Navbar } from "./components/Navbar";

function Layout() {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/event/:urlAlias" element={<Event />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
