import { useState } from 'react';
import '../styles/Modal.css';
import {useAddAvailabilityMutation} from "../api";
import type {PostAvailabilityPayload} from "../api";
import { formattedDateToString } from '../utils/scheduleDateUtils';

type SelectedElement = "none" | "AVAILABLE-ALL-DAY" | "UNAVAILABLE-ALL-DAY" | "MORNING" | "AFTERNOON" | "NIGHT";

interface ModalProps{
  setIsModal: (value: boolean) => void;
  userId: string;
  selectedDate: Date;
}

type Shift = "MORNING" | "AFTERNOON" | "NIGHT";

function Modal({setIsModal, userId, selectedDate}: ModalProps) {
  const [selectedElement, setSelectedElement] = useState<SelectedElement>("none");

  const [addAvailability, { isLoading, isSuccess, error }] = useAddAvailabilityMutation();

  const shifts: Shift[] = ["MORNING", "AFTERNOON", "NIGHT"];

  // YYYY-MM-DD
  const formattedDate = formattedDateToString(selectedDate);

  const availableAllDay = async () => {
    await Promise.all(
      shifts.map((shift) => {
        const payload: PostAvailabilityPayload = {
          userId: userId,
          date: formattedDate,
          shift: shift,
          status: "AVAILABLE",
        };

        return addAvailability(payload);
      })
    );
  };

  const unavailableAllDay = async () => {
    await Promise.all(
      shifts.map((shift) => {
        const payload: PostAvailabilityPayload = {
          userId: userId,
          date: formattedDate,
          shift: shift,
          status: "UNAVAILABLE",
        };

        return addAvailability(payload);
      })
    );
  }

  const handleConfirm = async () => {
    try{
        if(selectedElement == "AVAILABLE-ALL-DAY"){
          await availableAllDay();
        } else if (selectedElement == "UNAVAILABLE-ALL-DAY"){
          await unavailableAllDay();
        } else {
          const preferredShift: Shift = selectedElement as Shift;

          const payload: PostAvailabilityPayload = {
            userId: userId,
            date: formattedDate,
            shift: preferredShift,
            status: "PREFERRED_TO_WORK",
          };
          addAvailability(payload);
        }
        if(isSuccess){
          console.log("Availability added");
        }
        setSelectedElement("none");
        setIsModal(false);
    } catch(err) {
        console.log("Failed to add availability ", err)
    }
  }

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to add availability</p>;

  return (
    <div className="availability-modal">
      <div className="modal" role="dialog" aria-modal="true">
      
        <h2 className="modal__title" id="modal-title">Select availability</h2>

        <div className="modal__toggle-group" role="group" aria-label="Availability status">
          <button className="toggle-btn toggle-btn--available toggle-btn--active" data-value="available" onClick={() => setSelectedElement("AVAILABLE-ALL-DAY")} style={{border: selectedElement == "AVAILABLE-ALL-DAY" ? "4px black solid" : "2px solid"}}>
            Available all day
          </button>
          <button className="toggle-btn toggle-btn--unavailable" data-value="unavailable" onClick={() => setSelectedElement("UNAVAILABLE-ALL-DAY")} style={{border: selectedElement == "UNAVAILABLE-ALL-DAY" ? "4px black solid" : "2px solid"}}>
            Unavailable
          </button>
        </div>

        <p className="modal__subtitle">I prefer:</p>

        <div className="modal__shifts" role="group" aria-label="Preferred shifts">
          <button className="shift-btn shift-btn--morning" data-value="morning" onClick={() => setSelectedElement("MORNING")} style={{border: selectedElement == "MORNING" ? "4px black solid" : "2px solid"}}>
            <span className="shift-btn__label">Morning Shift</span>
            <span className="shift-btn__hours">7-15</span>
          </button>
          <button className="shift-btn shift-btn--afternoon" data-value="afternoon" onClick={() => setSelectedElement("AFTERNOON")} style={{border: selectedElement == "AFTERNOON" ? "4px black solid" : "2px solid"}}>
            <span className="shift-btn__label">Afternoon Shift</span>
            <span className="shift-btn__hours">15-18</span>
          </button>
          <button className="shift-btn shift-btn--evening" data-value="evening" onClick={() => setSelectedElement("NIGHT")} style={{border: selectedElement == "NIGHT" ? "4px black solid" : "2px solid"}}>
            <span className="shift-btn__label">Evening Shift</span>
            <span className="shift-btn__hours">18-23</span>
          </button>
        </div>

        <div className="modal__actions">
          <button className="action-btn action-btn--cancel" onClick={() => setIsModal(false)}>Cancel</button>
          <button className="action-btn action-btn--confirm" onClick={handleConfirm}>Confirm</button>
        </div>

      </div>
    </div>
  )
}

export default Modal

     
     