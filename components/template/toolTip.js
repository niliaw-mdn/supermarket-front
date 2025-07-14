export default function TooltipButton({ icon, tooltip, color, onClick }) {
  return (
    <button onClick={onClick} className="relative group transition">
      <span className={`hover:scale-110 transition ${color}`}>{icon}</span>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 z-10 whitespace-nowrap">
        {tooltip}
      </span>
    </button>
  );
}
