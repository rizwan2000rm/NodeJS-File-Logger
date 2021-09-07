import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/log")
      .then((res) => res.json())
      .then((data) => {
        setRecentLogs(data);
      });
  }, []);

  useEffect(() => {
    const socket = io("ws://localhost:8080");
    socket.on("logs", ({ logs }) => {
      if (logs) {
        const el = document.createElement("pre");
        el.innerHTML = logs;
        document.querySelector("main").appendChild(el);
      }
    });
  }, []);

  return (
    <div className="App">
      <div className="logs">
        <h1>Logs Below</h1>
        <main>
          {recentLogs.map((log) => (
            <pre>{log}</pre>
          ))}
        </main>
      </div>
    </div>
  );
}

export default App;
