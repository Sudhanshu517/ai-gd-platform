import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateSession from "./components/CreateSession";
import GDRoom from "./pages/GDRoom";
import Login from "./pages/Login"; // <-- Added Login page

function App() {
  return (
    <Router>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">AI GD Platform</h1>
        <Routes>
          <Route path="/" element={<CreateSession />} />
          <Route path="/session/:id" element={<GDRoom />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
