import { useProgress } from "../context/UserProgressContext";

export default function QuestPanel({ level }) {
  const { completeLevel, addXP } = useProgress();

  function finishQuest() {
    addXP(300);
    completeLevel(level.id);
  }

  return (
    <div className="w-96 bg-[#0b0f1a] border border-cyan-500/30 rounded-xl p-6">
      <h2 className="text-xl text-white mb-2">
        Level {level.id} – {level.title}
      </h2>

      <ul className="text-sm text-gray-300 list-disc ml-4 mb-4">
        <li>Learn key concepts</li>
        <li>Complete practice tasks</li>
        <li>Review interview questions</li>
      </ul>

      <button
        onClick={finishQuest}
        className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-2 rounded font-semibold"
      >
        Complete Quest (+300 XP)
      </button>
    </div>
  );
}
