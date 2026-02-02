import React, { useState } from "react";
import { useNavigate } from "react-router";

function Dashboard() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" });
  return <div>Dashboard</div>;
}

export default Dashboard;
