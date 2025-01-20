"use client";
import { useState } from "react";

export default function Home() {
  const [dateInput, setDateInput] = useState({ day: "", month: "", year: "" });
  const [result, setResult] = useState("");

  // Function to calculate the weekday
  const calculateWeekday = () => {
    const { day, month, year } = dateInput;
    const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const monthsText = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Convert month to a number if it is a string
    let monthNumber;
    if (!isNaN(month)) {
      // If month is a number, parse it as an integer
      monthNumber = parseInt(month);
    } else {
      // Convert month name to lowercase and find its index in the monthsText array
      monthNumber = monthsText.map((m) => m.toLowerCase()).indexOf(month.toLowerCase()) + 1;
    }

    // Validate month input
    if (monthNumber < 1 || monthNumber > 12) {
      setResult("Invalid month input. Please enter a valid month (1-12 or Jan-Dec).");
      return;
    }

    // Detect BE (พ.ศ.) or CE (ค.ศ.) and convert year if necessary
    let convertedYear = parseInt(year);
    let isBE = false; 

    if (convertedYear >= 2400) {
      // If year is >= 2400, assume it is in BE and convert to CE
      convertedYear -= 543; 
      isBE = true;
    }

    // Validate year
    if (isNaN(convertedYear) || convertedYear < 1900) {
      setResult("Invalid year input. Please enter a valid year (CE or BE).");
      return;
    }

    // Function to determine if a year is a leap year
    const isLeapYear = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

    // If it's a leap year, update February to have 29 days
    if (isLeapYear(convertedYear)) {
      daysInMonths[1] = 29; 
    }

    // Validate day input based on the month and year
    if (day < 1 || day > daysInMonths[monthNumber - 1]) {
      setResult(
        `Invalid day input. For ${monthsText[monthNumber - 1]}, the day should be between 1 and ${
          daysInMonths[monthNumber - 1]
        }.`
      );
      return;
    }

    // Calculate total days from January 1, 1900, to the given date
    let totalDays = 0;

    // Add days for all years from 1900 to the year before the input year
    for (let y = 1900; y < convertedYear; y++) {
      totalDays += isLeapYear(y) ? 366 : 365;
    }

    // Add days for all months in the current year up to the previous month
    for (let m = 0; m < monthNumber - 1; m++) {
      totalDays += daysInMonths[m];
    }

    // Add days for the current month
    totalDays += parseInt(day);

    const weekday = weekdays[(totalDays - 1) % 7];
    const monthText = monthsText[monthNumber - 1];
    const leapYearMessage = isLeapYear(convertedYear) ? "It is a leap year." : "It is not a leap year.";
    const displayYear = isBE ? convertedYear + 543 : convertedYear;

    setResult(`${monthText} ${day}, ${displayYear} is ${weekday}.${leapYearMessage}`);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-16 bg-white">
      <h1 className="text-3xl font-bold mb-8 text-[#18b49b]">Weekday Finder</h1>
      <div className="flex items-center mb-4 space-x-4">
        <input
          type="number"
          placeholder="Day"
          className="border border-[#18b49b] p-2 w-24"
          onChange={(e) => setDateInput({ ...dateInput, day: e.target.value })}
        />
        <input
          type="text"
          placeholder="Month"
          className="border border-[#18b49b] p-2 w-24"
          onChange={(e) => setDateInput({ ...dateInput, month: e.target.value })}
        />
        <input
          type="number"
          placeholder="Year"
          className="border border-[#18b49b] p-2 w-24"
          onChange={(e) => setDateInput({ ...dateInput, year: e.target.value })}
        />
        <button
          onClick={calculateWeekday}
          className="bg-[#18b49b] hover:bg-[#15907c] text-white font-bold px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>
      {result && (
        <div className="mt-4 text-xl font-bold text-red-400">
          {result}
        </div>
      )}
    </div>
  );
}
