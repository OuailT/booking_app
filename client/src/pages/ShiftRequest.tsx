import "../styles/ShiftRequest.css";
import { useMemo, useState } from "react";
import { getWeekDays, formattedDate, addDays, isSameDay, shortMonth, onlyYear } from "../utils/scheduleDateUtils";
import {useGetEmployeesQuery, useGetAvailabilitiesQuery} from "../api";
import type {Employee, Availability} from "../api";
import Navbar from "../components/Navbar";

function ShiftRequest() {
    const { data: employeesData, isLoading: isEmployeesLoading, error: isEmloyeesError } = useGetEmployeesQuery();
    const employees: Employee[] = employeesData as Employee[];

    const { data: availabilityData, isLoading: isAvailabilityLoading, error: isAvailabilityError } = useGetAvailabilitiesQuery();
    const availability: Availability[] = availabilityData as Availability[];

    const [dateReference, setDateReference] = useState(() => new Date());
    const days = useMemo(() => getWeekDays(dateReference), [dateReference]);

    const status = (id: string, date: Date) => {
        const item = availability.find(a => a.userId === id && isSameDay(new Date(a.date), date));
        if (!item) return null;

        if (item.status == "AVAILABLE") return <div className="status-available">Available</div>
        if (item.status == "UNAVAILABLE") return <div className="status-unavailable">Unavailable</div>
        if (item.status == "PREFERRED_TO_WORK"){
            if (item.shift == "MORNING"){
                return <div className="status-prefer">Prefers to work <div style={{color: "#e64d00"}}>7-15</div></div>
            }
            if (item.shift == "AFTERNOON"){
                return <div className="status-prefer">Prefers to work <div style={{color: "#0039e6"}}>15-18</div></div>
            }
            if (item.shift == "NIGHT"){
                return(
                    <div className="status-prefer">Prefers to work <div style={{color: "#993333"}}>18-23</div></div>
                ) 
            }
        }
    }

    if (isEmployeesLoading || isAvailabilityLoading) return <p className="loading">Loading...</p>;
    if (isEmloyeesError || isAvailabilityError) return <p className="error-message">Failed to load data</p>;

    return (
        <div className="shiftrequest">
        <Navbar role="EMPLOYER" />
        <h2 style={{marginLeft: "50px"}}>Shift request</h2>
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
            {employees?.map((employee, i) => (
                <tr key={i}>
                <td className="week-schedule-cell" style={{textAlign: "left", fontWeight: "bold" }}>
                    {employee.name}
                </td>

                {days.map((day) => (
                    <td key={`${employee.name}-${day}`} className="week-schedule-cell">
                        {status(employee.id, day)}
                    </td>
                ))}
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
}

export default ShiftRequest;