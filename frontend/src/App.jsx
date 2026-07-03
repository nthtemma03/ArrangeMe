import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CreateEvent from "./pages/CreateEvent.jsx";
import RSVP from "./pages/RSVP.jsx";
import LoginPage from "./pages/Login.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/rsvp/:event_code" element={<RSVP />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
