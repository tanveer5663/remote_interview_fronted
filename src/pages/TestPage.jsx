import { useState, useEffect, useRef } from "react";
import { LOGIC_QUESTIONS } from "../data/question";
import { useAptitudeTest } from "../hooks/useAptitudeTest";

export default function TestPage() {
  const [current, setCurrent] = useState(0);
  const {
    state,
    questions,
    answers,
    skipped,
    timeLeft,
    result,

    saving,
    error,
    startTest,
    selectOption,
    markSkipped,
    handleSubmit,
  } = useAptitudeTest();
  const TOTAL_TIME = 30 * 60;

  const q = questions[current];
  const answered = answers.filter((a) => a !== null).length;
  const skippedCount = skipped.filter(Boolean).length;
  const isLow = timeLeft < 300;
  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const getDotClass = (i) => {
    if (answers[i] !== null) return "bg-green-500 text-black border-green-500";
    if (skipped[i]) return "bg-yellow-500 text-black border-yellow-500";
    if (i === current) return "border-green-500 text-green-400 bg-green-900/30";
    return "bg-[#222] text-gray-500 border-[#333]";
  };

  // if (!q) return null;

  if (state === "loading") {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading test...</p>
        </div>
      </div>
    );
  }
  if (state === "error") {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-8 text-center max-w-md">
          <p className="text-red-400  text-lg mb-2">Something went wrong</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }
  // console.log(state);

  if (state === "done" && result) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center font-mono px-4">
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-black text-2xl font-bold mx-auto mb-6">
            ✓
          </div>
          <h2 className="text-white text-2xl font-bold mb-1">
            Test Completed!
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            {result.status === "timed_out"
              ? "Auto-submitted due to timeout"
              : "Successfully submitted"}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              {
                label: "Score",
                value: `${result.score?.percentage ?? 0}%`,
                color: "text-green-400",
              },
              {
                label: "Correct",
                value: `${result.score?.correct ?? 0}/30`,
                color: "text-blue-400",
              },
              {
                label: "Tab Switches",
                value: result.tabSwitchCount ?? 0,
                color: "text-yellow-400",
              },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-[#222] rounded-lg p-3">
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-[10px] text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <p className="text-gray-600 text-xs">
            You can only take this test once. Results have been saved.
          </p>
        </div>
      </div>
    );
  }
  if (state === "check") {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center font-mono px-4">
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl p-10 max-w-lg w-full">
          

          <h2 className="text-white text-xl font-bold mb-2 font-mono">Ready to begin?</h2>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            You will receive{" "}
            <span className="text-green-400 font-semibold">
              30 questions
            </span>{" "}
            from our bank of 100+ questions. You have{" "}
            <span className="text-green-400 font-semibold">30 minutes</span> to
            complete.
          </p>

          <ul className="space-y-2 mb-8 text-sm text-gray-400">
            {[
              "Each student gets a unique randomized set of 30 questions",
              "Progress auto-saves every 30 seconds",
              "Closing the tab saves your progress automatically",
              "You can only take this test once",
              "Tab switches are monitored and recorded",
            ].map((rule) => (
              <li key={rule} className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                {rule}
              </li>
            ))}
          </ul>

          <button
            onClick={startTest}
            className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-xl  transition-all active:scale-95"
          >
            Start Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="text-white ">
        {/* ── TOPBAR ── */}

        <header className=" flex justify-between mt-5">
          <h1 className="text-xl font-bold ml-5 ">Aptitude Test</h1>

          <div className="bg-[#1a2a1a] border border-green-900 rounded-lg px-6 py-2 text-center ">
            <p
              className={`text-2xl font-bold  tabular-nums leading-none ${isLow ? "text-red-400" : "text-green-400"}`}
            >
              {fmt(timeLeft)}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 active:scale-95 text-primary-content font-bold px-5 py-2 rounded-lg text-sm flex items-center gap-2 transition-all mr-3"
            >
              Submit Test
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* ── SIDEBAR ── */}
          <aside className="w-52 min-w-[13rem]  border-r border-[#2a2a2a] p-4 flex flex-col gap-4 overflow-y-auto">
            <p className="text-[11px] text-white uppercase tracking-widest px-1">
              Questions
            </p>

            {/* Grid */}
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-8 h-8 rounded-md text-[11px] font-semibold border-[1.5px] transition-all hover:scale-105 ${getDotClass(i)}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="bg-[#222] rounded-lg p-3 flex justify-around">
              <div className="text-center">
                <p className="text-lg font-bold text-green-400 leading-none">
                  {answered}
                </p>
                <p className="text-[10px] text-gray-500 mt-1">Answered</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-yellow-400 leading-none">
                  {skippedCount}
                </p>
                <p className="text-[10px] text-gray-500 mt-1">Skipped</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-red-400 leading-none">
                  {30 - answered}
                </p>
                <p className="text-[10px] text-gray-500 mt-1">Left</p>
              </div>
            </div>
          </aside>

          {/* ── MAIN ── */}
          <main className="flex-1 overflow-y-auto px-8 py-7">
            <div className="border-t border-[#2a2a2a] my-4" />

            {/* Question */}
            <p className="text-base text-gray-200 leading-relaxed mb-7">
              <span className="text-green-500 font-bold mr-2">
                {current + 1}.
              </span>
              {q?.question}
            </p>

            {/* Options */}
            <div className="flex flex-col gap-3 mb-8 max-w-2xl">
              {q?.options.map((opt, i) => {
                const isSelected = answers[current] === i;
                // console.log("is slected", isSelected);
                return (
                  <button
                    key={i}
                    onClick={() => selectOption(current, i)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-[1.5px] text-left w-full transition-all
                    ${
                      isSelected
                        ? "border-green-500 bg-green-900/20"
                        : "border-[#2a2a2a] bg-[#1e1e1e] hover:border-green-900 hover:bg-[#1a2a1a]"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors
                      ${isSelected ? "bg-green-500 text-black" : "bg-[#2a2a2a] text-gray-500"}`}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span
                      className={`text-sm ${isSelected ? "text-white" : "text-gray-400"}`}
                    >
                      {opt}
                    </span>
                    {isSelected && (
                      <span className="ml-auto text-green-500 text-sm">✓</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="border-t border-[#2a2a2a] pt-5 flex items-center justify-between max-w-2xl">
              <button
                onClick={() => current > 0 && setCurrent(current - 1)}
                disabled={current === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border-[1.5px] border-[#333] bg-[#222] text-gray-300 text-sm font-semibold hover:border-green-500 hover:text-green-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                ← Previous
              </button>

              <button
                onClick={() => {
                  markSkipped(current);
                  if (current < 29) setCurrent(current + 1);
                }}
                className="px-4 py-2.5 rounded-lg border-[1.5px] border-yellow-900 text-yellow-500 text-sm font-medium hover:bg-yellow-900/20 transition-colors"
              >
                Mark &amp; Skip
              </button>

              <button
                onClick={() => current < 29 && setCurrent(current + 1)}
                disabled={current === 29}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-black text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                Save &amp; Next →
              </button>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
