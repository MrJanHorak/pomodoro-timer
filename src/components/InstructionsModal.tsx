interface InstructionsModalProps {
  onClose: () => void;
}

const InstructionsModal = ({ onClose }: InstructionsModalProps) => {
  return (
    <div
      className='modal-backdrop'
      role='dialog'
      aria-modal='true'
      aria-labelledby='instructions-title'
      onClick={onClose}
    >
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <h2 id='instructions-title'>How this timer works</h2>
        <ul>
          <li>
            <strong>Start / Pause</strong> begins or pauses the countdown.
          </li>
          <li>
            <strong>Stop</strong> pauses the timer in place; <strong>Reset</strong>{' '}
            returns it to the start of a focus session.
          </li>
          <li>
            The numbers around the circle (5, 10, 15…) are buttons — click
            one to jump straight to that many focus minutes.
          </li>
          <li>
            <strong>Show Settings</strong> lets you set custom focus/break
            lengths, pick focus music, and choose the colors used for each
            phase.
          </li>
          <li>
            Focus music is optional and off by default — enable it from
            Settings if you'd like background audio while you focus.
          </li>
        </ul>
        <button className='modal-close-button' onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
};

export default InstructionsModal;
