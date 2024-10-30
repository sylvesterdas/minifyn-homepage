export const TabButton = ({ active, onClick, label }) => (
  <button
    className={`flex-1 py-2 px-3 text-sm sm:text-base focus:outline-none transition-colors
      ${active ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'}`}
    onClick={onClick}
  >
    {label}
  </button>
);