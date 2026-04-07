import { useMemo } from "react";
import { getWeekDays, formattedDate  } from "../utils/weekDays";
import "../styles/MyAvailability.css";
import type {ShiftRow} from "../types/index";

function MyAvailability() {
  const days = useMemo(() => getWeekDays(new Date()), []);
  const shifts: ShiftRow[] = [
    "Morning shift",
    "Afternoon shift",
    "Night shift",
  ];
  return (
    <div className="my-availability">
      <h2 style={{marginLeft: "50px"}}>My availability</h2>
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
            <tr key={shift}>
              <td className="week-schedule-cell" style={{textAlign: "left", fontWeight: "bold" }}>
                {shift}
              </td>

              {days.map((day) => (
                <td key={`${shift}-${day}`} className="week-schedule-cell">
                  {/* Här kan du lägga namn, tider, bokningar osv */}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td></td>
            {days.map((day) => (
              <td key={`${day}`}>
                  <button>choose</button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default MyAvailability;
