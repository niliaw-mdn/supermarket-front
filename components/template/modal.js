import ReactDOM from 'react-dom';

export default function Modal  ({ children, onClose }) {
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-[#2a2c2d8a] flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.getElementById('modal-root') // Render here
  );
};