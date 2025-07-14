export default function PaginationButton  ({ label, onClick, active, disabled, theme }) {
  const base = "w-9 h-9 flex items-center justify-center rounded-md text-sm";
  const activeStyle =
    theme === "dark"
      ? "bg-blue-800 text-white border border-blue-700"
      : "bg-blue-100 text-blue-700 border border-blue-300";
  const normalStyle =
    theme === "dark"
      ? "bg-gray-700 text-gray-200 border border-gray-600 hover:bg-gray-600"
      : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100";
  const finalStyle = `${base} ${active ? activeStyle : normalStyle} ${
    disabled ? "opacity-50 cursor-not-allowed" : ""
  }`;

  return (
    <li>
      <button onClick={onClick} className={finalStyle} disabled={disabled}>
        {label}
      </button>
    </li>
  );
};
