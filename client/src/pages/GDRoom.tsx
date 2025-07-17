import { useEffect, useRef, useState } from "react"; // CHANGED: added useRef
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../config";

interface SessionData {
  _id: string;
  topic: string;
  aiCount: number;
  scheduledAt: string;
  createdBy: string;
}

interface ChatMessage {
  sender: string;
  message: string;
}

const GDRoom = () => {
  const { id } = useParams();
  const [session, setSession] = useState<SessionData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [report, setReport] = useState<string | null>(null);
  const [sessionEnded, setSessionEnded] = useState(false); // NEW

  const timerRef = useRef<number | null>(null); // NEW - store interval ID

  // Fetch session & start timer
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/session/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSession(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSession();

    // Start timer
    timerRef.current = window.setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    // Cleanup on unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id]);

  // Handle chat send
  const handleSend = () => {
    if (!userInput.trim() || sessionEnded) return; // Don't send after end

    setMessages((prev) => [...prev, { sender: "You", message: userInput }]);
    setUserInput("");

    // Simulated AI reply
    setTimeout(() => {
      const aiReply: ChatMessage = {
        sender: "AI Bot",
        message: "Interesting point! Can you elaborate?",
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 2000);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // END SESSION & GET AI REPORT (Gemini)
  const handleEndSession = async () => {
    if (sessionEnded) return; // avoid duplicate clicks
    setSessionEnded(true); // NEW

    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const token = localStorage.getItem("token");

    // Build clean array of "sender: message" strings
    const discussionLines = messages.map((m) => `${m.sender}: ${m.message}`);

    try {
      const res = await axios.post(
        `${API_BASE}/session/generate-report`,
        {
          topic: session?.topic || "Untitled Session", // CHANGED
          messages: discussionLines,                   // CHANGED
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReport(res.data.report);
    } catch (err) {
      console.error("Report error:", err);
      setReport("Error generating AI report.");
    }
  };

  if (!session) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 rounded-xl shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4">🗣️ Group Discussion Room</h2>
      <p><strong>Topic:</strong> {session.topic}</p>
      <p><strong>Time Elapsed:</strong> {timer}s</p>

      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={toggleMute}
          disabled={sessionEnded} // NEW
          className={`px-4 py-2 rounded ${isMuted ? "bg-red-500" : "bg-green-500"} text-white disabled:opacity-50`}
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>
        <button
          onClick={handleEndSession}
          disabled={sessionEnded} // NEW
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {sessionEnded ? "Session Ended" : "End Session & Generate Report"}
        </button>
      </div>

      <div className="border mt-6 rounded-lg p-4 bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">Discussion</h3>
        <div className="h-48 overflow-y-auto bg-white p-2 rounded-md border">
          {messages.map((msg, i) => (
            <div key={i} className={msg.sender === "You" ? "text-blue-700" : "text-green-700"}>
              <strong>{msg.sender}: </strong>{msg.message}
            </div>
          ))}
        </div>
        <div className="flex mt-3">
          <input
            type="text"
            value={userInput}
            disabled={sessionEnded} // NEW
            onChange={(e) => setUserInput(e.target.value)}
            className="flex-grow border rounded-l px-3 py-2"
            placeholder={sessionEnded ? "Session ended" : "Type message..."}
          />
          <button
            onClick={handleSend}
            disabled={sessionEnded} // NEW
            className="bg-blue-600 text-white px-4 rounded-r disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>

      {report && (
        <div className="mt-6 p-4 bg-green-100 border rounded-lg">
          <h3 className="text-lg font-bold mb-2">AI Report</h3>
          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, "<br>") }}
          ></div>

        </div>
      )}
    </div>
  );
};

export default GDRoom;
