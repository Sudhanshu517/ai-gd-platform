import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateSession from "./components/CreateSession";
import GDRoom from "./pages/GDRoom";

function App() {
  return (
    <Router>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">AI GD Platform</h1>
        <Routes>
          <Route path="/" element={<CreateSession />} />
          <Route path="/session/:id" element={<GDRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
