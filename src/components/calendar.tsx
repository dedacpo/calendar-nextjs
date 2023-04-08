import { WeekDay } from "@/enums/weekday";
import { Month } from "@/enums/month";
import { getDaysInMonth, startOfMonth } from "date-fns";
import { useEffect, useState } from "react";

export default function Calendar() {

  const days = [];

  const weekDays = [0, 1, 2, 3, 4, 5, 6];

  const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const [currentDay, setCurrentDay] = useState<Date>(new Date())
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDay.getMonth())
  const [daysInMonth, setDaysInMonth] = useState<number>(getDaysInMonth(currentDay));
  const [firstDayOfMonth, setFirstDayOfMonth] = useState<number>(startOfMonth(currentDay).getDay())
  const [emptyDays, setEmptyDays] = useState<number>(firstDayOfMonth > 0 ? firstDayOfMonth - 1 : firstDayOfMonth)

  for (let i = 0; i <= daysInMonth + emptyDays; i++) {
    days.push(
      <div key={`day-${i - firstDayOfMonth + 1}`}>
        {i >= firstDayOfMonth && <span>{i - firstDayOfMonth + 1}</span>}
      </div>
    );
  }

  return (
    <>
      <div>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e?.target?.value))}>
          {months.map(item => {
            return (
              <option key={`month-${Month[item]}`} value={item}>{Month[item]}</option>
            )
          })}
        </select>       
      </div>
      <div className="grid grid-cols-1 md:grid-cols-7">
        {weekDays.map((item) => {
          return <div  key={`weekDay-${WeekDay[item]}`}>{WeekDay[item]}</div>;
        })}
        {days.map((item) => item)}
      </div>
    </>
  );
}
