import { useState, useEffect, useRef, useCallback } from "react";
import axiosInstance from "../lib/axios";
const API = "http://localhost:3000/api";
const getToken = () => localStorage.getItem("token");
// ── API helpers ───────────────────────────────────────────────────────────────

// ── sendBeacon autosave (works even on tab close) ─────────────────────────────
export const beaconSave = (
  attemptId,
  answers,
  timeSpentSeconds,
  tabSwitchCount,
) => {
  const blob = new Blob(
    [JSON.stringify({ answers, timeSpentSeconds, tabSwitchCount })],
    { type: "application/json" },
  );
  navigator.sendBeacon(
    `${API}/test/${attemptId}/autosave?token=${getToken()}`,
    blob,
  );
};

// ── Main hook ─────────────────────────────────────────────────────────────────
export function useAptitudeTest() {
  const [state, setState] = useState("loading"); // loading | check | in_progress | done | error
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(Array(30).fill(null));
  const [skipped, setSkipped] = useState(Array(30).fill(false));
  const [attemptId, setAttemptId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [result, setResult] = useState(null);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const tabSwitchRef = useRef(0);
  const answersRef = useRef(answers);
  const skippedRef = useRef(skipped);
  const questionsRef = useRef(questions);
  const timeLeftRef = useRef(timeLeft);
  const attemptIdRef = useRef(attemptId);

  // Keep refs in sync
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);
  useEffect(() => {
    skippedRef.current = skipped;
  }, [skipped]);
  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);
  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);
  useEffect(() => {
    attemptIdRef.current = attemptId;
  }, [attemptId]);

  const buildPayload = useCallback(
    () =>
      answersRef.current.map((a, i) => ({
        questionId: questionsRef.current[i]?._id ?? null,
        selectedOption: a,
        isSkipped: skippedRef.current[i] || false,
        answeredAt: a !== null ? new Date() : null,
      })),
    [],
  );
  const startTest = useCallback(async () => {
    setState("loading");
    const { data } = await axiosInstance.get("/test/start", {});
    console.log("first,data", data);

    if (!data.success) {
      setError(data.message);
      setState("error");
      return;
    }
    setAttemptId(data.attemptId);
    setQuestions(data.questions);
    setTimeLeft(data.remainingSeconds);
    setAnswers(Array(30).fill(null));
    setSkipped(Array(30).fill(false));
    setState("in_progress");
  }, []);

  useEffect(() => {
    const check = async () => {
      const { data } = await axiosInstance.get("/test/check");
      console.log(data);

      if (!data.hasAttempted) {
        // startTest();
        setState("check");
        return;
      }

      if (data.status === "in_progress") {
        // Resume
        const { data: resume } = await axiosInstance.get("/test/start");
        setAttemptId(resume.attemptId);
        setQuestions(resume.questions);
        setTimeLeft(resume.remainingSeconds);

        // Restore previous answers
        if (resume?.answers && resume.answers?.length > 0) {
          const restored = Array(30).fill(null);
          const restoredSkip = Array(30).fill(false);
          resume.answers.forEach((a, i) => {
            restored[i] = a.selectedOption;
            restoredSkip[i] = a.isSkipped;
          });
          setAnswers(restored);
          setSkipped(restoredSkip);
        }
        setState("in_progress");
      } else {
        setResult(data.attempt);
        setState("done");
      }
    };
    check();
  }, []);

  // ── Start test ───────────────────────────────────────────────────────────────

  const handleSubmit = useCallback(async () => {
    if (!attemptIdRef.current) return;
    const {data} = await axiosInstance.post(
      `/test/${attemptIdRef.current}/submit`,
      {
        answers: buildAnswerPayload(),
        timeSpentSeconds: 30 * 60 - timeLeftRef.current,
      },
    );
    if (data.success) {
      setResult(data.result);
      setState("done");
    }
  }, [questions, skipped]);

  const autoSave = useCallback(async () => {
    if (!attemptIdRef.current) return;
    setSaving(true);
    await axiosInstance.patch(`/test/${attemptIdRef.current}/autosave`, {
      answers: buildAnswerPayload(),
      timeSpentSeconds: 30 * 60 - timeLeftRef.current,
      tabSwitchCount: tabSwitchRef.current,
    });
    setSaving(false);
  }, [questions, skipped]);

  const buildAnswerPayload = () =>
    answersRef.current.map((a, i) => ({
      questionId: questions[i]?._id,
      selectedOption: a,
      isSkipped: skipped[i] || false,
      answeredAt: a !== null ? new Date() : null,
    }));
  // ── Timer countdown ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (state !== "in_progress") return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          handleSubmit("timed_out");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state]);

  // ── Periodic autosave every 30 seconds ───────────────────────────────────────
  useEffect(() => {
    if (state !== "in_progress") return;
    const interval = setInterval(() => autoSave(), 30000);
    return () => clearInterval(interval);
  }, [state]);

  // ── Tab visibility change — autosave + count switches ──────────────────────
  useEffect(() => {
    if (state !== "in_progress") return;

    const handleVisibility = () => {
      if (document.hidden) {
        tabSwitchRef.current += 1;
        setTabSwitchCount(tabSwitchRef.current);
        autoSave();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [state]);

  // ── Tab close / refresh — sendBeacon (most reliable for unload) ─────────────
  useEffect(() => {
    if (state !== "in_progress") return;

    const handleUnload = () => {
      if (!attemptIdRef.current) return;
      const spent = 30 * 60 - timeLeftRef.current;
      beaconSave(
        attemptIdRef.current,
        buildAnswerPayload(),
        spent,
        tabSwitchRef.current,
      );
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [state]);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const selectOption = useCallback((questionIndex, optionIndex) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[questionIndex] = optionIndex;
      return updated;
    });
    setSkipped((prev) => {
      const s = [...prev];
      s[questionIndex] = false;
      return s;
    });
  }, []);

  const markSkipped = useCallback((questionIndex) => {
    setSkipped((prev) => {
      const s = [...prev];
      s[questionIndex] = true;
      return s;
    });
  }, []);

  return {
    state,
    questions,
    answers,
    skipped,
    timeLeft,
    result,
    attemptId,
    tabSwitchCount,
    saving,
    error,
    startTest,
    selectOption,
    markSkipped,
    handleSubmit,
    autoSave,
  };
}
