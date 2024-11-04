/* eslint-disable react/prop-types */
const Modal = ({ closeModal }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-0"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">How to Play</h2>
        <p className="text-gray-700 font-semibold">
          1. Click on a card to reveal its type.
          <br />
          2. Avoid the bomb cards to keep playing.
          <br />
          3. Use the defuse card if you encounter a bomb.
          <br />
          4. The game ends when you draw all five cards or hit a bomb without a
          defuse card.
        </p>
        <button
          onClick={closeModal}
          className="mt-6 font-bold w-full px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors text-sm sm:text-base"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
