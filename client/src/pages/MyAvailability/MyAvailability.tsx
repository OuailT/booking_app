import "./MyAvailability.css";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { getWeekDays, formattedDate, addDays, isSameDay, shortMonth } from "../../utils/scheduleDateUtils";
import { useGetEmployeeByIdQuery, useGetAvailabilityByEmployeeIdQuery } from "../../api";
import type { Employee, Availability } from "../../api";
import Cookie from "universal-cookie";

type ShiftRow = {
  name: string;
  value: string;
};

type SelectedElement = "none" | "AVAILABLE-ALL-DAY" | "UNAVAILABLE-ALL-DAY" | "MORNING" | "AFTERNOON" | "NIGHT";

function MyAvailability() {
  const location = useLocation();
  const locationId = location.state?.id;

  const cookies = new Cookie();
  const cookieId = cookies.get("booking_app_cookie");

  const employeeId = locationId ?? cookieId;

  const { data: employeesData, isLoading: isEmployeesLoading, error: isEmloyeesError } = useGetEmployeeByIdQuery(employeeId);
  const employee: Employee = employeesData as Employee;

  const { data: availabilityData, isLoading: isAvailabilityLoading, error: isAvailabilityError } = useGetAvailabilityByEmployeeIdQuery(employeeId);
  const availability = availabilityData as Availability[] | undefined;

  const [dateReference, setDateReference] = useState(() => new Date());
  const days = useMemo(() => getWeekDays(dateReference), [dateReference]);
  const shifts: ShiftRow[] = [
    { name: "Morning shift", value: "MORNING" },
    { name: "Afternoon shift", value: "AFTERNOON" },
    { name: "Night shift", value: "NIGHT" },
  ];

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedElement, setSelectedElement] = useState<SelectedElement>("none")

  const [isModal, setIsModal] = useState<boolean>(false);
  const handleModal = (date: Date) => {
    setSelectedDate(date);
    setIsModal(true);
  }

  const status = (shiftValue: string, date: Date) => {
      const item = availability!.find(a => a.shift == shiftValue && isSameDay(new Date(a.date), date));
      if (!item) return null;

      if (item.status == "AVAILABLE") return <div className="status-available">Available</div>
      if (item.status == "UNAVAILABLE") return <div className="status-unavailable">Unavailable</div>
      if (item.status == "PREFERRED_TO_WORK"){
          if (item.shift == "MORNING"){
              return <div className="status-prefer-morning">Prefers to work 7-15</div>
          }
          if (item.shift == "AFTERNOON"){
              return <div className="status-prefer-afternoon">Prefers to work 15-18</div>
          }
          if (item.shift == "NIGHT"){
              return(
                  <div className="status-prefer-night">Prefers to work 18-23</div>
              ) 
          }
      }
  }

  const handleCancel = () => {
    setSelectedElement("none");
    setIsModal(false);
  }

  const handleConrifm = () => {
    // impelent logic for sending data to api
    console.log(`userId: ${employee.id}, date: ${selectedDate}, shift: "shift", status: "status"`);

    setSelectedElement("none");
    setIsModal(false);
  }

  if (isEmployeesLoading || isAvailabilityLoading) return <p className="loading">Loading...</p>;
  if (isEmloyeesError || isAvailabilityError) return <p className="error-message">Failed to load data</p>;
  
  return (
    <div className="my-availability">
      <h2 style={{marginLeft: "50px"}}>{employee?.name}'s availability</h2>
      <div className="week-schedule-button-wrap">
                  <button className="today-button" onClick={() => setDateReference(new Date())}>Today</button>
                  <div className="week-arrows">
                      <div className="arrow-left" onClick={() => setDateReference(addDays(dateReference, -7))}></div>
                      <div className="arrow-right" onClick={() => setDateReference(addDays(dateReference, +7))}></div>
                      {shortMonth.format((days[3]))} {days[0].getDate()}-{days[days.length-1].getDate()}
                  </div>
              </div>
      <table className="week-schedule-table">
        <thead>
          <tr>
            <th className="week-schedule-cell"></th>
            {days.map((day) => (
              <th key={day.toDateString()} className="week-schedule-cell">
                {formattedDate.format(day)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {shifts.map((shift) => (
            <tr key={shift.name}>
              <td className="week-schedule-cell" style={{textAlign: "left", fontWeight: "bold" }}>
                {shift.name}
              </td>

              {days.map((day) => (
                <td key={`${shift.value}-${day}`} className="week-schedule-cell">
                    {status(shift.value, day)}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td></td>
            {days.map((day) => (
              <td key={`${day}`}>
                  <button onClick={() => handleModal(day)} className="choose-availability-btn">Choose availability</button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {isModal && (
        <div className="availability-modal">
          <div className="availability-modal-window">
            <div className="availability-modal-text">Select availability</div>
            <div className="day-buttons-wrapper">
              <div className="available-all-day" onClick={() => setSelectedElement("AVAILABLE-ALL-DAY")} style={{border: selectedElement == "AVAILABLE-ALL-DAY" ? "4px black solid" : "2px black solid"}}>Available all day</div>
              <div className="unavailable-all-day" onClick={() => setSelectedElement("UNAVAILABLE-ALL-DAY")} style={{border: selectedElement == "UNAVAILABLE-ALL-DAY" ? "4px black solid" : "2px black solid"}}>Unavailable</div>
            </div>
            <div className="availability-modal-text">I prefer:</div>
            <div className="morning-shift" onClick={() => setSelectedElement("MORNING")} style={{border: selectedElement == "MORNING" ? "4px black solid" : "2px black solid"}}>Morning shift 7-15</div>
            <div className="afternoon-shift" onClick={() => setSelectedElement("AFTERNOON")} style={{border: selectedElement == "AFTERNOON" ? "4px black solid" : "2px black solid"}}>Afternoon shift 15-18</div>
            <div className="night-shift" onClick={() => setSelectedElement("NIGHT")} style={{border: selectedElement == "NIGHT" ? "4px black solid" : "2px black solid"}}>Night shift 18-23</div>
            <div className="availability-buttons-wrapper">
              <button className="availability-modal-cancel" onClick={handleCancel}>Cancel</button>
              <button className="availability-modal-confirm" onClick={handleConrifm}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyAvailability;