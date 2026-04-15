import "../styles/ApprovedSchedule.css";
import { useMemo, useState } from "react";
import { getWeekDays, formattedDate, addDays, isSameDay, shortMonth } from "../utils/scheduleDateUtils";

type ShiftRow = {
  name: string;
  value: string;
};

function ApprovedSchedule(){
    const [dateReference, setDateReference] = useState(() => new Date());
    const days = useMemo(() => getWeekDays(dateReference), [dateReference]);

    const shifts: ShiftRow[] = [
        { name: "Morning shift", value: "MORNING" },
        { name: "Afternoon shift", value: "AFTERNOON" },
        { name: "Night shift", value: "NIGHT" },
    ];

    const scheduleStatus = () => {

    }
    return(
        <div className="job-schedule">
            <h2 style={{marginLeft: "50px"}}>Job schedule</h2>
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
                            {/* {status(shift.value, day)} */}
                        </td>
                        ))}
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ApprovedSchedule;