import React, { useState, useContext, useEffect, act } from "react";
import { useNavigate } from "react-router";
import { myContext } from "../context/contextProvider.jsx";
import WelcomeSection from "../components/WelcomeSection.jsx";
import CreateSessionModal from "../components/CreateSessionModal.jsx";
import StatsCards from "../components/StatsCard.jsx";
import ActiveSessions from "../components/ActiveSession.jsx";
import RecentSessions from "../components/RecentSessions.jsx";
import { sessionApi } from "../api/sessionApi.js";

function Dashboard() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" });
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [sessionData, setSessionData] = useState({
    isLoading: true,
    activeSessions: [],
    recentSessions: [],
  });
  const { userData } = useContext(myContext);

  const handleCreateRoom = async () => {
    if (!roomConfig.problem || !roomConfig.difficulty) return;

    try {
      const apiData = await sessionApi.createSession({
        problem: roomConfig.problem,
        difficulty: roomConfig.difficulty.toLowerCase(),
      });

      console.log("Session created Data:", apiData);

      navigate(`/session/${apiData?.data?._id}`);
    } catch (error) {
      if (error.response) {
        console.error("Data:", error.response.data);
      } else {
        console.error("Axios error:", error.message);
      }
    } finally {
      setShowCreateModal(false);
      setIsCreatingSession(false);
    }
  };

  const isUserInSession = (session) => {
    console.log("dashboard session isUserInSession", session);
    if (!userData._id) return false;
    const isHost =
      session.host?.clerkId === userData._id ||
      session.participant?.clerkId === userData._id;
    console.log("check", isHost);
    return isHost;
  };
  console.log("first");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activeSessions, recentSessions] = await Promise.all([
          sessionApi.getActiveSessions(),
          sessionApi.getMyRecentSessions(),
        ]);
        // console.log(activeSessions, recentSessions);
        setSessionData((prev) => ({
          ...prev,
          activeSessions: activeSessions.data,
          recentSessions: recentSessions.data,
        }));
      } catch (error) {
      } finally {
        setSessionData((prev) => ({ ...prev, isLoading: false }));
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-base-300">
        <WelcomeSection
          onCreateSession={() => setShowCreateModal(true)}
          userData={userData}
        />

        {/* Grid layout */}
        <div className="container mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatsCards
              activeSessionsCount={sessionData?.activeSessions?.length}
              recentSessionsCount={sessionData?.recentSessions?.length}
            />
            <ActiveSessions
              sessions={sessionData?.activeSessions}
              isLoading={sessionData?.isLoading}
              isUserInSession={isUserInSession}
            />
          </div>

          <RecentSessions
            sessions={sessionData?.recentSessions}
            isLoading={sessionData?.isLoading}
          />
        </div>
      </div>

      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={isCreatingSession}
      />
    </>
  );
}

export default Dashboard;
