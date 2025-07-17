import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import CreateSession from "./components/CreateSession";
import GDRoom from "./pages/GDRoom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/create" element={<CreateSession />} />
        <Route path="/session/:id" element={<GDRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
