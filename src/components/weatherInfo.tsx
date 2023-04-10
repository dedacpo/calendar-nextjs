import { CalendarEvent } from "@/types/calendarEvent";
import { WeatherIcon } from "./weatherIcon";
import { fromKToC, fromKToF } from "@/utils/temperatureConversion";

export type WeatherInfoProps = {
  event: CalendarEvent;
  selectedTemperature: "Kelvin" | "Celsius" | "Fahrenheit";
  onSetSelectedTemperature: (
    temperature: "Kelvin" | "Celsius" | "Fahrenheit"
  ) => void;
};

export function WeatherInfo(props: WeatherInfoProps) {
  const { event, selectedTemperature, onSetSelectedTemperature } = props;
  return (
    <div className="flex gap-2">
      {event.weatherIcon && <WeatherIcon iconId={event.weatherIcon} />}
      <div className="my-auto">
        <div className="flex gap-4">
          <div className="my-auto text-2xl">
            {selectedTemperature === "Kelvin" && (
              <>
                <span className="font-bold">
                  {event.temperatureMax?.toFixed(0)}
                </span>
                {" / "}
                <span>{event.temperatureMin?.toFixed(0)}</span>
              </>
            )}
            {selectedTemperature === "Fahrenheit" && (
              <>
                <span className="font-bold">
                  {fromKToF(event.temperatureMax)}
                </span>
                {" / "}
                <span>{fromKToF(event.temperatureMin)}</span>
              </>
            )}
            {selectedTemperature === "Celsius" && (
              <>
                <span className="font-bold">
                  {fromKToC(event.temperatureMax)}
                </span>
                {" / "}
                <span>{fromKToC(event.temperatureMin)}</span>
              </>
            )}
          </div>
          <div className="my-auto text-base">
            <span
              onClick={() => onSetSelectedTemperature("Fahrenheit")}
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
              onClick={() => onSetSelectedTemperature("Celsius")}
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
              onClick={() => onSetSelectedTemperature("Kelvin")}
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
          {event.weatherMain} ({event.weatherDescr})
        </div>
      </div>
    </div>
  );
}
