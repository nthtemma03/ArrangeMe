import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CreateEvent from "./pages/CreateEvent.jsx";
import LoginPage from "./pages/Login.jsx";
import RSVPPage from "./pages/RSVP.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/rsvp/:event_code" element={<RSVPPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
