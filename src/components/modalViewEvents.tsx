import { differenceInCalendarDays, intlFormat } from "date-fns";
import { Modal } from "./modal";
import { useState } from "react";
import { CalendarEvent } from "@/types/calendarEvent";
import Accordion from "./accordion";
import { WeatherIcon } from "./weatherIcon";
import { fromKToC, fromKToF } from "@/utils/temperatureConversion";

export function ModalViewEvent(props: {
  isOpen: boolean;
  handler: () => void;
  clickedDate: Date;
  events: CalendarEvent[];
}) {
  const { isOpen, handler, clickedDate, events } = props;

  const [selectedTemperature, setSelectedTemperature] = useState<
    "Kelvin" | "Celsius" | "Fahrenheit"
  >("Fahrenheit");

  const title = intlFormat(
    isNaN(clickedDate.getDate()) ? new Date() : clickedDate,
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <>
      <Modal isOpen={isOpen} handler={handler} header={title}>
        {events.map((item, index) => {
          return (
            <Accordion title={item.title} isOpen={index === 0}>
              <div className="flex justify-center">
                <div>
                  <strong className="font-bold">{item.cityName}</strong>
                  <div className="flex gap-2">
                    {item.weatherIcon && (
                      <WeatherIcon iconId={item.weatherIcon} />
                    )}
                    <div className="my-auto">
                      <div className="flex gap-4">
                        <div className="my-auto text-2xl">
                          {selectedTemperature === "Kelvin" && (
                            <>
                              <span className="font-bold">
                                {item.temperatureMax?.toFixed(0)}
                              </span>
                              {" / "}
                              <span>{item.temperatureMin?.toFixed(0)}</span>
                            </>
                          )}
                          {selectedTemperature === "Fahrenheit" && (
                            <>
                              <span className="font-bold">
                                {fromKToF(item.temperatureMax)}
                              </span>
                              {" / "}
                              <span>{fromKToF(item.temperatureMin)}</span>
                            </>
                          )}
                          {selectedTemperature === "Celsius" && (
                            <>
                              <span className="font-bold">
                                {fromKToC(item.temperatureMax)}
                              </span>
                              {" / "}
                              <span>{fromKToC(item.temperatureMin)}</span>
                            </>
                          )}
                        </div>
                        <div className="my-auto text-base">
                          <span
                            onClick={() => setSelectedTemperature("Fahrenheit")}
                            className={
                              selectedTemperature === "Fahrenheit"
                                ? "font-bold"
                                : "cursor-pointer"
                            }
                          >
                            °F
                          </span>
                          {" | "}
                          <span
                            onClick={() => setSelectedTemperature("Celsius")}
                            className={
                              selectedTemperature === "Celsius"
                                ? "font-bold"
                                : "cursor-pointer"
                            }
                          >
                            °C
                          </span>
                          {" | "}
                          <span
                            onClick={() => setSelectedTemperature("Kelvin")}
                            className={
                              selectedTemperature === "Kelvin"
                                ? "font-bold"
                                : "cursor-pointer"
                            }
                          >
                            K
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        {item.weatherMain} ({item.weatherDescr})
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Accordion>
          );
        })}
      </Modal>
    </>
  );
}
