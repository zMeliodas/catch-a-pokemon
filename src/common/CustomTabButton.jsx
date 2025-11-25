const TabButton = ({ text, isActive, onClick, activeColor, inactiveColor, width, textSize, rounded }) => {
  return (
    <button
      className={`flex-1 py-2 ${width} font-mulish text-center font-medium ${textSize} border ${rounded} transition-colors duration-200 ${
        isActive
          ? `border-white ${activeColor}`
          : `border-gray-700 ${inactiveColor}`
      }`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default TabButton;