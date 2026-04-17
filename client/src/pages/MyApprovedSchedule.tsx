import "../styles/MyApprovedSchedule.css";
import { useMemo, useState } from "react";
import { getWeekDays, formattedDate, addDays, isSameDay, shortMonth, onlyYear } from "../utils/scheduleDateUtils";
import { useGetAvailabilityByEmployeeIdQuery } from "../api";
import type { Availability } from "../api";
import Navbar from "../components/Navbar";

type ShiftRow = {
  name: string;
  value: string;
};

function MyApprovedSchedule(){
    let userId;
    let employeeName;
    const stored = localStorage.getItem("user");

    if (stored) {
        const user = JSON.parse(stored);
        userId = user.id;
        employeeName = user.name;
    }

    const { data, isLoading, error } = useGetAvailabilityByEmployeeIdQuery(userId);
    const scheduleData = data as Availability[] | undefined;

    const [dateReference, setDateReference] = useState(() => new Date());
    const days = useMemo(() => getWeekDays(dateReference), [dateReference]);

    const shifts: ShiftRow[] = [
        { name: "Morning shift", value: "MORNING" },
        { name: "Afternoon shift", value: "AFTERNOON" },
        { name: "Night shift", value: "NIGHT" },
    ];

    const shiftTime = (shiftValue: string) => {
        if(shiftValue == "MORNING") return <>7-15</>
        if(shiftValue == "AFTERNOON") return <>15-18</>
        if(shiftValue == "NIGHT") return <>18-23</>
    }

    const status = (shiftValue: string, date: Date) => {
        const item = scheduleData!.find(a => a.shift == shiftValue && isSameDay(new Date(a.date), date) && a.status != "UNAVAILABLE");
        if (!item) return null;

        if (item.approvalStatus == "PENDING") return <div className="myappruvedschedule-status-pending">{shiftTime(shiftValue)}</div>
        if (item.approvalStatus == "CONFIRMED") return <div className="myappruvedschedule-status-confirmed">{shiftTime(shiftValue)}</div>
        if (item.approvalStatus == "REFUSED") return <div className="myappruvedschedule-status-refused">{shiftTime(shiftValue)}</div>
    }

    if (isLoading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error-message">Failed to load data</p>;
    return(
        <div className="my-approved-schedule">
            <Navbar role="EMPLOYEE" />
            <h2 style={{marginLeft: "50px"}}>{employeeName}'s schedule</h2>
            <div className="week-schedule-button-wrap">
                        <button className="today-button" onClick={() => setDateReference(new Date())}>Today</button>
                        <div className="week-arrows">
                            <div className="arrow-left" onClick={() => setDateReference(addDays(dateReference, -7))}></div>
                            <div className="arrow-right" onClick={() => setDateReference(addDays(dateReference, +7))}></div>
                            {shortMonth.format((days[3]))} {days[0].getDate()}-{days[days.length-1].getDate()} {onlyYear.format(days[0])}
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
                </tbody>
            </table>
            <div className="approved-status-colors">
                <div className="color-status">
                    <div className="color-status-pending"></div>
                    <div>Pending</div>
                </div>
                <div className="color-status">
                    <div className="color-status-confirmed"></div>
                    <div>Confirmed</div>
                </div>
                <div className="color-status">
                    <div className="color-status-refused"></div>
                    <div>Refused</div>
                </div>
            </div>
        </div>
    )
}

export default MyApprovedSchedule;