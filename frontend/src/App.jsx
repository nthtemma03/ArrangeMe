import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateEvent from "./pages/CreateEvent.jsx";
import RSVP from "./pages/RSVP.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/rsvp/:event_code" element={<RSVP />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
