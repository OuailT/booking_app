import "../styles/ShiftRequest.css";
import type {ShiftRow} from "../types/index";

function ShiftRequest() {
  const days = [
    "Wed 1/4",
    "Thu 2/4",
    "Fri 3/4",
    "Sat 4/4",
    "Sun 5/4",
    "Mon 6/4",
    "Tue 6/4",
  ];

  const shifts: ShiftRow[] = [
    "Morning shift",
    "Afternoon shift",
    "Night shift",
  ];
  return(
    <div className="shift-request">
      <h2 style={{marginLeft: "50px"}}>Shift request</h2>
      <table className="week-schedule-table">
        <thead>
          <tr>
            <th className="week-schedule-cell"></th>
            {days.map((day) => (
              <th key={day} className="week-schedule-cell">
                {day}
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
        </tbody>
      </table>
    </div>
  )
}

export default ShiftRequest;
