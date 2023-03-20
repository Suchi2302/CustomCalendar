import React, { useState, useEffect } from "react";
import "./CalendarDashboard.css";
import axios from "axios";
export default function CalendarDashboard() {
  const [calendarData, setCalendarData] = useState({
    dates: [],
    employees: {},
  });

  // Load calendar data from server on mount
  useEffect(() => {
    // fetch("http://localhost:5000/api/calendar")
    //   .then((response) => {
    //     console.log(response);
    //     response.json();
    //   })
    //   .then((data) => {
    //     console.log(data);
    //     setCalendarData(data);
    //   });
    axios.get("http://localhost:5000/api/calendar").then((res) => {
      console.log(res.data);
      setCalendarData(res.data);
    });
  }, []);
  // Handle cell click event
  function handleCellClick(employeeId, date) {
    console.log("employeeId", employeeId);
    const currentStatus = calendarData[employeeId][date];
    console.log(calendarData[employeeId][date]);
    const newStatus = currentStatus === "P" ? "A" : "P";
    setCalendarData((prevData) => ({
      ...prevData,
      employees: {
        ...prevData.employees,
        [employeeId]: { ...prevData.employees[employeeId], [date]: newStatus },
      },
    }));

    // Send update request to server
    // fetch("http://localhost:5000/api/calendar", {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ employeeId, date, status: newStatus }),
    // }).then(() => {
    //   // Fetch updated calendar data from server
    //   fetch("/api/calendar")
    //     .then((response) => response.json())
    //     .then((data) => {
    //       console.log(data, "data");
    //       setCalendarData(data);
    //     });
    // });
    axios
      .put("http://localhost:5000/api/calendar", {
        employeeId,
        date,
        status: newStatus,
      })
      .then((res) => {
        setCalendarData(res.data);
      });
    console.log(calendarData);
  }

  // Render the calendar dashboard
  return (
    <div className="bg-img1">
      <h6 style={{ textAlign: "right", color: "blue" }}>P - Present</h6>
      <h6 style={{ textAlign: "right", color: "red" }}>A - Absent</h6>
      <div className="table table-success table-striped-columns ">
        <div>
          <table className="table">
            <thead>
              <tr>
                <th></th>
                {calendarData.dates.map((date) => (
                  <th key={date}>
                    <b>{date}</b>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(calendarData.employees).map(([id, employee]) => (
                <tr key={id}>
                  <td style={{ fontSize: 10, fontWeight: "bold" }}>
                    {employee.name}
                  </td>
                  {calendarData.dates.map((date) => (
                    <td
                      key={date}
                      className={`status-${calendarData.employees[id][date]}`}
                      onClick={() => handleCellClick(id, date)}
                      style={{
                        color: calendarData[id][date] === "P" ? "blue" : "red",
                        fontSize: 10,
                        fontWeight: "bold",
                      }}
                    >
                      {calendarData[id][date]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
