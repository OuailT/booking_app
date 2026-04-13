import '../styles/Modal.css'

function Modal() {
  return (
    <div className="modal" role="dialog" aria-modal="true">
      
      <h2 className="modal__title" id="modal-title">Select availability</h2>

      <div className="modal__toggle-group" role="group" aria-label="Availability status">
        <button className="toggle-btn toggle-btn--available toggle-btn--active" data-value="available">
          Available all day
        </button>
        <button className="toggle-btn toggle-btn--unavailable" data-value="unavailable">
          Unavailable
        </button>
      </div>

      <p className="modal__subtitle">I prefer:</p>

      <div className="modal__shifts" role="group" aria-label="Preferred shifts">
        <button className="shift-btn shift-btn--morning" data-value="morning">
          <span className="shift-btn__label">Morning Shift</span>
          <span className="shift-btn__hours">7-15</span>
        </button>
        <button className="shift-btn shift-btn--afternoon" data-value="afternoon">
          <span className="shift-btn__label">Afternoon Shift</span>
          <span className="shift-btn__hours">15-18</span>
        </button>
        <button className="shift-btn shift-btn--evening" data-value="evening">
          <span className="shift-btn__label">Evening Shift</span>
          <span className="shift-btn__hours">18-23</span>
        </button>
      </div>

      <div className="modal__actions">
        <button className="action-btn action-btn--cancel">Cancel</button>
        <button className="action-btn action-btn--confirm">Confirm</button>
      </div>

    </div>
  )
}

export default Modal

     
     