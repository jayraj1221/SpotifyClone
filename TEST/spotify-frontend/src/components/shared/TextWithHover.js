const TextWithHover = ({ displayText, active, onClick }) => {
    return (
        <div 
            className="flex items-center justify-start cursor-pointer"
            onClick={onClick}  // Apply the onClick event here
        >
            <div
                className={`${
                    active ? "text-white" : "text-gray-500"
                } font-semibold hover:text-white`}
            >
                {displayText}
            </div>
        </div>
    );
};

export default TextWithHover;
    