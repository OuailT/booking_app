import "../styles/MyAvailability.css";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { getWeekDays, formattedDate, addDays, isSameDay, shortMonth } from "../utils/scheduleDateUtils";
import { useGetAvailabilityByEmployeeIdQuery } from "../api";
import type { Availability } from "../api";
import Modal from "../components/Modal";

type ShiftRow = {
  name: string;
  value: string;
};

function MyAvailability() {
  const location = useLocation();
  const locationId = location.state?.id;

  const userId = locationId;

  const employeeName = location.state?.employeename;

  const { data: availabilityData, isLoading: isAvailabilityLoading, error: isAvailabilityError } = useGetAvailabilityByEmployeeIdQuery(userId);
  const availability = availabilityData as Availability[] | undefined;
  const [dateReference, setDateReference] = useState(() => new Date());
  const days = useMemo(() => getWeekDays(dateReference), [dateReference]);
  const shifts: ShiftRow[] = [
    { name: "Morning shift", value: "MORNING" },
    { name: "Afternoon shift", value: "AFTERNOON" },
    { name: "Night shift", value: "NIGHT" },
  ];

  const [selectedDate, setSelectedDate] = useState<Date>(new Date);

  const [isModal, setIsModal] = useState<boolean>(false);
  const handleModal = (date: Date) => {
    console.log(date)
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

  if (isAvailabilityLoading) return <p className="loading">Loading...</p>;
  if (isAvailabilityError) return <p className="error-message">Failed to load data</p>;
  
  return (
    <div className="my-availability">
      <h2 style={{marginLeft: "50px"}}>{employeeName}'s availability</h2>
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
          <tr style={{position: "relative"}}>
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
        <Modal setIsModal={setIsModal} userId={userId} selectedDate={selectedDate} />
      )}
    </div>
  );
}

export default MyAvailability;