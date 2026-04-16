import "../styles/ApprovedSchedule.css";
import { useMemo, useState } from "react";
import { getWeekDays, formattedDate, addDays, shortMonth, isSameDay } from "../utils/scheduleDateUtils";
import { useGetAvailabilitiesQuery, useUpdateAvailabilityApprovalMutation } from "../api";
import type { Availability } from "../api";
import Navbar from "../components/Navbar";

type ShiftRow = {
  name: string;
  value: string;
};

type ApprovalStatus = 'PENDING' | 'CONFIRMED' | 'REFUSED';

function ApprovedSchedule(){
    const { data, isLoading, error } = useGetAvailabilitiesQuery();
    const approvedData = data as Availability[] | undefined;

    const [dateReference, setDateReference] = useState(() => new Date());
    const days = useMemo(() => getWeekDays(dateReference), [dateReference]);

    const [isModal, setIsModal] = useState<boolean>(false);

    const [selectedApprovalId, setSelectedApprovalId] = useState<string>("");
    const [selectedApprovalDate, setSelectedApprovalDate] = useState<Date>(new Date());
    const [selectedEmployeeName, setSelectedEmployeeName] = useState<string>("");
    const [selectedApprovalTime, setSelectedApprovalTime] = useState<string>("");

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

    const shiftTimeAsString = (shiftValue: string) => {
        if(shiftValue == "MORNING") return "7-15"
        if(shiftValue == "AFTERNOON") return "15-18"
        if(shiftValue == "NIGHT") return "18-23"
    }

    const selectApproval = (approvalId: string | undefined, employeeName: string | undefined, date: Date, shiftValue: string) => {
        if(approvalId != undefined && employeeName != undefined){
            setSelectedApprovalId(approvalId);
            setSelectedEmployeeName(employeeName);
            setSelectedApprovalDate(date);

            const approvalTime = shiftTimeAsString(shiftValue);
            if(approvalTime != undefined){
                setSelectedApprovalTime(approvalTime);
            }
            setIsModal(!isModal);
        }
    }

    const approvedEmployee = (shiftValue: string, date: Date) => {
        const items = approvedData!.filter(a => a.shift == shiftValue && isSameDay(new Date(a.date), date) && a.status != "UNAVAILABLE");
        if (!items) return null;
        if (items.length == 0) return null;

        return (
            <div style={{display: "flex", height: "100%"}}>
                <div className="approved-schedule-employee" onClick={() => selectApproval(items[0]?.id, items[0]?.user?.name, date, shiftValue)}>
                    <div className="approved-name">{items[0]?.user?.name.split(" ")[0] ?? ""}</div>
                    <div className="approved-time">{shiftTime(shiftValue)}</div>
                    {items[0]?.approvalStatus == "CONFIRMED" && ( <div className="approved-status-confirmed"></div>)}
                    {items[0]?.approvalStatus == "REFUSED" && ( <div className="approved-status-refused"></div>)}
                </div>
                {items[1] != null && (
                    <div className="approved-schedule-employee" onClick={() => selectApproval(items[1]?.id, items[1]?.user?.name, date, shiftValue)}>
                        <div className="approved-name">{items[1]?.user?.name?.split(" ")[0] ?? ""}</div>
                        <div className="approved-time">{shiftTime(shiftValue)}</div>
                        {items[1]?.approvalStatus == "CONFIRMED" && ( <div className="approved-status-confirmed"></div>)}
                        {items[1]?.approvalStatus == "REFUSED" && ( <div className="approved-status-refused"></div>)}
                    </div>
                )}
            </div>
        )
    }

    const [updateApproval, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate }] = useUpdateAvailabilityApprovalMutation();

    const handleUpdateApproval = async (status: ApprovalStatus ) => {
        try {
            await updateApproval({ id: selectedApprovalId, approvalStatus: status }).unwrap();

            if(isSuccessUpdate){
                console.log('Approved successfully');
            }
            setIsModal(false);
        } catch (error) {
            console.error('Error approving:', error);
        }
    }

    if (isLoading || isLoadingUpdate) return <p className="loading">Loading...</p>;
    if (error || isErrorUpdate) return <p className="error-message">Failed to load data</p>;
    return(
        <div className="approved-schedule">
            <Navbar role="EMPLOYER" />
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
                            {approvedEmployee(shift.value, day)}
                        </td>
                        ))}
                    </tr>
                    ))}
                </tbody>
            </table>
            {isModal && (
                <div className="approved-schedule-modal">
                    <div className="approved-schedule-modal-window">
                        <p className="selected-approval-date">{selectedApprovalDate.toDateString()}</p>
                        <p>{selectedEmployeeName}</p>
                        <p>{selectedApprovalTime}</p>
                        <button className="confirm-button" onClick={() => handleUpdateApproval("CONFIRMED")}>CONFIRM</button>
                        <button className="refuse-button" onClick={() => handleUpdateApproval("REFUSED")}>REFUSE</button>
                        <button className="approve-cancel-button" onClick={() => setIsModal(false)}>CANCEL</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ApprovedSchedule;