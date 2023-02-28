const currentDate = new Date();
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1;
const daysInMonth = new Date(year, month, 0).getDate();
const getCalendardata = (req, res) => {
  const dates = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const day = i < 10 ? `0${i}` : i;
    const date = `${year}-${month}-${day}`;
    dates.push(date);
  }
  console.log("get dates", dates);
  // Query the database for work status data
  connection.query(
    `SELECT work_status.employee_id, work_status.date, work_status.status, employees.name
       FROM work_status
       JOIN employees ON work_status.employee_id = employees.employee_id
       WHERE YEAR(work_status.date) = ? AND MONTH(work_status.date) = ?`,
    [year, month],
    (error, results) => {
      if (error) {
        throw error;
      }

      // Construct the calendar data object
      const calendarData = {
        employees: {},
        dates: dates,
      };
      results.forEach(({ employee_id, date, status, name }) => {
        const currentdate = new Date(date);
        const i = currentdate.getDate();
        const day = i < 10 ? `0${i}` : i;
        date = `${currentdate.getFullYear()}-${
          currentdate.getMonth() + 1
        }-${day}`;
        if (!calendarData.employees[employee_id]) {
          calendarData.employees[employee_id] = { name };
        }
        calendarData[employee_id] = {
          ...calendarData[employee_id],
          [date]: status,
        };
      });
      res.json(calendarData);
    }
  );
};
const updateCalendarData = (req, res) => {
  const data = req.body;
  console.log(data);
  connection.query(
    `update work_status set status="${data.status}" where employee_id=${data.employeeId} && date='${data.date}'`,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        const dates = [];
        for (let i = 1; i <= daysInMonth; i++) {
          const day = i < 10 ? `0${i}` : i;
          const date = `${year}-${month}-${day}`;
          dates.push(date);
        }
        console.log("get dates", dates);
        // Query the database for work status data
        connection.query(
          `SELECT work_status.employee_id, work_status.date, work_status.status, employees.name
       FROM work_status
       JOIN employees ON work_status.employee_id = employees.employee_id
       WHERE YEAR(work_status.date) = ? AND MONTH(work_status.date) = ?`,
          [year, month],
          (error, results) => {
            if (error) {
              throw error;
            }

            // Construct the calendar data object
            const calendarData = {
              employees: {},
              dates: dates,
            };
            results.forEach(({ employee_id, date, status, name }) => {
              const currentdate = new Date(date);
              const i = currentdate.getDate();
              const day = i < 10 ? `0${i}` : i;
              date = `${currentdate.getFullYear()}-${
                currentdate.getMonth() + 1
              }-${day}`;
              if (!calendarData.employees[employee_id]) {
                calendarData.employees[employee_id] = { name };
              }
              calendarData[employee_id] = {
                ...calendarData[employee_id],
                [date]: status,
              };
            });
            res.json(calendarData);
          }
        );
      }
    }
  );
};
function postworkstatus(employee) {
  let sql = `Select employee_id from employees where name="${employee}"`;
  connection.query(sql, (err, results) => {
    if (err) {
      throw err;
    } else {
      console.log(results, "results");
      const employeeId = results[0].employee_id;
      const status = "";
      // Generate date strings for the current month
      const dates = Array.from(
        { length: daysInMonth },
        (_, i) =>
          `${year}-${month.toString().padStart(2, "0")}-${(i + 1)
            .toString()
            .padStart(2, "0")}`
      );
      console.log(dates, "dates");
      const insertQuery = `INSERT INTO work_status (employee_id, date, status) VALUES ? ON DUPLICATE KEY UPDATE status = VALUES(status)`;
      const values = dates.map((date) => [employeeId, date, status]);
      console.log(values);
      connection.query(insertQuery, [values], (error, results) => {
        if (error) {
          throw error;
        }
        return results;
      });
    }
  });
}
const signup = (req, res) => {
  let data = req.body;
  let sql1 = `Select * from employees where email="${data.email}"`;
  connection.query(sql1, (error, results) => {
    if (error) {
      throw error;
    } else {
      if (results.length != 0) {
        res.send({ message: "user already exists" });
      } else {
        let sql = `Insert into employees(name,email,password) values("${data.name}","${data.email}","${data.password}")`;
        connection.query(sql, (error, results) => {
          if (error) {
            throw error;
          }
          postworkstatus(data.name);
          res.send({ msg: "successfully registered" });
        });
      }
    }
  });
};
const login = (req, res) => {
  let data = req.body;
  let sql = `Select * from employees where email="${data.email}" `;
  connection.query(sql, (error, results) => {
    if (error) {
      throw error;
    } else {
      if (results.length == 0) {
        res.send({ message: "User is not registered" });
      } else {
        return res
          .status(200)
          .json({ message: "Successfully Logged In", user: results[0] });
      }
    }
  });
};
const logout = (req, res) => {
  // Clear the user's session
  req.session = null;
  res.status(200).send("Logged out");
};
exports.logout = logout;
exports.getCalendardata = getCalendardata;
exports.updateCalendarData = updateCalendarData;
exports.signup = signup;
exports.login = login;
