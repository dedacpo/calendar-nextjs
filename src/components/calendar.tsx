import { WeekDay } from "@/enums/weekday";
import { Month } from "@/enums/month";
import {
  differenceInCalendarDays,
  getDaysInMonth,
  isWeekend,
  lastDayOfMonth,
  startOfMonth,
} from "date-fns";
import { useEffect, useState } from "react";
import { ModalNewEditEvent } from "./modaNewEditlEvent";
import { CalendarEvent } from "@/types/calendarEvent";
import getClassName from "@/utils/getClassName";
import { ModalViewEvent } from "./modalViewEvents";

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

  const [eventModalNewWEditOpened, setEventModalNewWEditOpened] =
    useState<boolean>(false);
  const [eventModalViewOpened, setEventModalViewOpened] =
    useState<boolean>(false);

  const [clickedDay, setClickedDay] = useState<number>();

  const [eventsData, setEventsData] = useState<CalendarEvent[]>();

  const getData = async () => {
    const resp: CalendarEvent[] = await (
      await fetch(
        `/api/firestore/getAllDocuments?dateStart=${new Date(
          selectedYear,
          selectedMonth
        )}&dateEnd=${lastDayOfMonth(currentDay)}`
      )
    ).json();
    setEventsData(resp);
  };

  const eventSubmit = async (event: CalendarEvent) => {
    const resp = await (
      await fetch(`/api/firestore/addDocument`, {
        method: "POST",
        body: JSON.stringify(event),
      })
    ).json();
    setEventModalNewWEditOpened(false);
  };

  const getEventsFromDate = (date: Date): CalendarEvent[] => {
    const events =
      eventsData?.filter(
        (item) => differenceInCalendarDays(new Date(item.date), date) === 0
      ) ?? [];

    return events;
  };

  useEffect(() => {
    const newDate = new Date(selectedYear, selectedMonth);
    setCurrentDay(newDate);
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    setDaysInMonth(getDaysInMonth(currentDay));
    setFirstDayOfMonth(startOfMonth(currentDay).getDay());
  }, [currentDay, selectedMonth, selectedYear]);

  useEffect(() => {
    setEmptyDays(firstDayOfMonth);
  }, [firstDayOfMonth, selectedMonth, selectedYear]);

  useEffect(() => {
    getData();
  }, [emptyDays, selectedMonth, selectedYear]);

  useEffect(() => {
    const daysElements = [];
    for (let i = 1; i <= daysInMonth + emptyDays; i++) {
      const eventsFromDate = getEventsFromDate(
        new Date(selectedYear, selectedMonth, i - emptyDays)
      );
      daysElements.push(
        <button
          className={getClassName(
            i > firstDayOfMonth ? "hover:bg-[#ecf0f1]" : "cursor-default",
            i > firstDayOfMonth &&
              isWeekend(
                new Date(selectedYear, selectedMonth, i - firstDayOfMonth)
              )
              ? "bg-[#f5f7f7] hover:bg-[#ecf0f1]"
              : ""
          )}
          key={`day-${i - firstDayOfMonth}`}
          onClick={(e) => {
            if (i > firstDayOfMonth) {
              eventsFromDate.length
                ? setEventModalViewOpened(true)
                : setEventModalNewWEditOpened(true);
              setClickedDay(i - firstDayOfMonth);
            }
          }}
        >
          <div
            className={getClassName(
              i > firstDayOfMonth ? "border-[1px]" : "",
              "border-[#ecf0f1] py-4 h-full"
            )}
          >
            {i > firstDayOfMonth && (
              <>
                <div className="text-right px-4">
                  <strong
                    className={getClassName(
                      differenceInCalendarDays(
                        new Date(
                          selectedYear,
                          selectedMonth,
                          i - firstDayOfMonth
                        ),
                        new Date()
                      ) === 0
                        ? "bg-[#e74c3c] px-4 py-3 rounded-full text-white"
                        : ""
                    )}
                  >
                    {i - firstDayOfMonth}
                  </strong>
                </div>
                <div className="h-[150px] overflow-y-auto mt-4">
                  {eventsFromDate.map((item) => {
                    return (
                      <div
                        className="bg-[#1abc9c] p-2 border-[1px] border-white text-white"
                        key={`eventId-${item.id}`}
                      >
                        {item.title}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </button>
      );
    }
    setDays(daysElements);
  }, [eventsData]);

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
          return (
            <div
              className="bg-[#2980b9] text-white text-center p-2"
              key={`weekDay-${WeekDay[item]}`}
            >
              <strong>{WeekDay[item]}</strong>
            </div>
          );
        })}
        {days?.map((item) => item)}
      </div>
      <ModalNewEditEvent
        handler={() => setEventModalNewWEditOpened(false)}
        isOpen={eventModalNewWEditOpened}
        clickedDate={new Date(selectedYear, selectedMonth, clickedDay)}
        submit={eventSubmit}
      />

      <ModalViewEvent
        handler={() => setEventModalViewOpened(false)}
        isOpen={eventModalViewOpened}
        clickedDate={new Date(selectedYear, selectedMonth, clickedDay)}
        events={getEventsFromDate(
          new Date(selectedYear, selectedMonth, clickedDay)
        )}
      />
    </>
  );
}
