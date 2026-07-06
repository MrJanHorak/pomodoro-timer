import type { ReactNode } from 'react';

interface SettingsModalProps {
  onClose: () => void;
  children: ReactNode;
}

const SettingsModal = ({ onClose, children }: SettingsModalProps) => {
  return (
    <div
      className='modal-backdrop'
      role='dialog'
      aria-modal='true'
      aria-labelledby='settings-title'
      onClick={onClose}
    >
      <div className='modal-content settings-modal' onClick={(e) => e.stopPropagation()}>
        <h2 id='settings-title'>Settings</h2>
        {children}
        <button className='modal-close-button' onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
