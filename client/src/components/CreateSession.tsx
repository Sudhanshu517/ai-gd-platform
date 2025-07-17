import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

// Simple create session form
const CreateSession = () => {
  const [topic, setTopic] = useState("");
  const [aiCount, setAiCount] = useState<number>(1);
  const [scheduledAt, setScheduledAt] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleCreate = async () => {
    setError(null);

    // Basic validation
    if (!topic.trim() || !scheduledAt) {
      setError("Topic and schedule are required.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in.");
        setLoading(false);
        return;
      }

      const res = await axios.post(
        `${API_BASE}/session/create`,
        {
          topic,
          aiCount,
          scheduledAt, // Expecting ISO string or date from input
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Accept both 200 & 201 (backend returns 201)
      if (res.status === 200 || res.status === 201) {
        const session = res.data;
        console.log("Session created:", session);

        // Redirect to GD Room using _id
        navigate(`/session/${session._id}`);
      } else {
        console.warn("Unexpected status:", res.status);
        setError("Session creation failed (unexpected status).");
      }
    } catch (err) {
      console.error("Create session error:", err);
      setError("Session creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md border rounded p-4 bg-white shadow">
      <h2 className="text-xl font-bold mb-3">Create a GD Session</h2>

      <label className="block mb-2 text-sm font-medium">Topic</label>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4"
        placeholder="e.g., AI Ethics"
      />

      <label className="block mb-2 text-sm font-medium">AI Participants</label>
      <input
        type="number"
        min={0}
        max={5}
        value={aiCount}
        onChange={(e) => setAiCount(Number(e.target.value))}
        className="w-full border rounded px-3 py-2 mb-4"
      />

      <label className="block mb-2 text-sm font-medium">Schedule</label>
      <input
        type="datetime-local"
        value={scheduledAt}
        onChange={(e) => setScheduledAt(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4"
      />

      {error && <div className="text-red-600 mb-3">{error}</div>}

      <button
        onClick={handleCreate}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        {loading ? "Creating..." : "Create Session"}
      </button>
    </div>
  );
};

export default CreateSession;
