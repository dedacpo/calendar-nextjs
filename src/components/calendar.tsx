import { WeekDay } from "@/enums/weekday";
import { Month } from "@/enums/month";
import { getDaysInMonth, startOfMonth } from "date-fns";
import { useEffect, useState } from "react";
import { ModalEvent } from "./modalEvent";

export default function Calendar() {
  const weekDays = [0, 1, 2, 3, 4, 5, 6];
  const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  const [currentDay, setCurrentDay] = useState<Date>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<number>(
    currentDay.getMonth()
  );

  const [selectedYear, setSelectedYear] = useState<number>(
    currentDay.getFullYear()
  );

  const [daysInMonth, setDaysInMonth] = useState<number>(
    getDaysInMonth(currentDay)
  );

  const [firstDayOfMonth, setFirstDayOfMonth] = useState<number>(
    startOfMonth(currentDay).getDay()
  );

  const [emptyDays, setEmptyDays] = useState<number>(
    firstDayOfMonth > 0 ? firstDayOfMonth - 1 : firstDayOfMonth
  );

  const [days, setDays] = useState<JSX.Element[]>();

  const [eventModalOpened, setEventModalOpened] = useState<boolean>(false);

  const [clickedDay, setClickedDay] = useState<number>();

  useEffect(() => {
    const newDate = new Date(selectedYear, selectedMonth);
    setCurrentDay(newDate);
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    setDaysInMonth(getDaysInMonth(currentDay));
    setFirstDayOfMonth(startOfMonth(currentDay).getDay());
  }, [currentDay]);

  useEffect(() => {
    setEmptyDays(firstDayOfMonth > 0 ? firstDayOfMonth - 1 : firstDayOfMonth);
  }, [firstDayOfMonth]);

  useEffect(() => {
    const daysElements = [];
    console.log(daysInMonth, emptyDays);
    for (let i = 0; i <= daysInMonth + emptyDays; i++) {
      daysElements.push(
        <button
          key={`day-${i - firstDayOfMonth + 1}`}
          onClick={(e) => {
            setEventModalOpened(true);
            setClickedDay(i - firstDayOfMonth + 1);
          }}
        >
          <div>
            {i >= firstDayOfMonth && <span>{i - firstDayOfMonth + 1}</span>}
          </div>
        </button>
      );
    }
    setDays(daysElements);
  }, [emptyDays]);

  return (
    <>
      <div>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e?.target?.value))}
        >
          {months.map((item) => {
            return (
              <option key={`month-${Month[item]}`} value={item}>
                {Month[item]}
              </option>
            );
          })}
        </select>
        <label htmlFor="year">Year</label>
        <br />
        <input
          type="number"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value ?? undefined))}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-7">
        {weekDays.map((item) => {
          return <div key={`weekDay-${WeekDay[item]}`}>{WeekDay[item]}</div>;
        })}
        {days?.map((item) => item)}
      </div>
      <ModalEvent
        handler={() => setEventModalOpened(false)}
        isOpen={eventModalOpened}
        clickedDate={new Date(selectedYear, selectedMonth, clickedDay)}
      />
    </>
  );
}
