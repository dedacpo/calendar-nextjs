import { differenceInCalendarDays, intlFormat } from "date-fns";
import { Modal } from "./modal";
import getClassName from "@/utils/getClassName";
import { useCallback, useState } from "react";
import { City } from "@/types/city";
import { DebounceInput } from "react-debounce-input";
import { Weather } from "@/types/weather";
import { CalendarEvent } from "@/types/calendarEvent";
import { WeatherIcon } from "./weatherIcon";
import { fromKToF } from "@/utils/temperatureConversion";

export function ModalNewEditEvent(props: {
  isOpen: boolean;
  handler: () => void;
  clickedDate: Date;
  submit: (event: CalendarEvent) => void;
}) {
  const { isOpen, handler, clickedDate, submit } = props;

  const [cities, setCities] = useState<City[]>();
  const [selectedCityIndex, setSelectedCityIndex] = useState<number>();
  const [weatherInfo, setWeatherInfo] = useState<Weather>();
  const [eventName, setEventName] = useState<string>();
  const [selectedTemperature, setSelectedTemperature] = useState<
    "Kelvin" | "Celsius" | "Fahrenheit"
  >("Fahrenheit");

  const currentDate = new Date();
  const differenceDays = differenceInCalendarDays(clickedDate, currentDate);
  const title = intlFormat(
    isNaN(clickedDate.getDate()) ? new Date() : clickedDate,
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const inputClassName = "flex flex-col";

  const handleCitySearch = async (value: string) => {
    const resp = await (
      await fetch(`/api/geocode/getCity?cityName=${value}`)
    ).json();
    setCities(resp.results);
  };

  const handleWeather = async (value: number) => {
    if (cities) {
      const resp = await (
        await fetch(
          `/api/openWeather/getWeather?lat=${cities[value].geometry.lat}&lng=${cities[value].geometry.lng}`
        )
      ).json();
      setWeatherInfo(resp.daily[differenceDays]);
      console.log("res weather", resp);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        handler={handler}
        header={title}
        submit={() =>
          submit({
            cityName: cities?.[selectedCityIndex ?? 0].formatted,
            date: currentDate,
            lat: cities?.[selectedCityIndex ?? 0].geometry.lat,
            lng: cities?.[selectedCityIndex ?? 0].geometry.lng,
            temperatureMax: weatherInfo?.temp.max,
            temperatureMin: weatherInfo?.temp.min,
            title: eventName,
            weatherDescr: weatherInfo?.weather[0].description,
            weatherIcon: weatherInfo?.weather[0].icon,
            weatherId: weatherInfo?.weather[0].id,
            weatherMain: weatherInfo?.weather[0].main,
          } as CalendarEvent)
        }
      >
        <div className={getClassName(inputClassName)}>
          <label htmlFor="name">Event name</label>
          <input
            name="name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          ></input>
        </div>
        <div className={getClassName(inputClassName)}>
          <label htmlFor="city">Event city</label>
          <DebounceInput
            minLength={2}
            debounceTimeout={300}
            onChange={async (event) =>
              await handleCitySearch(event.target.value)
            }
          />
          {cities && (
            <select
              value={selectedCityIndex}
              onChange={async (value) => {
                setSelectedCityIndex(Number(value.target.value));
                if (differenceDays >= 0 && differenceDays < 7) {
                  await handleWeather(Number(value.target.value));
                }
              }}
            >
              <option>Select a city</option>
              {cities?.map((item: City, index) => {
                return (
                  <option key={`option-${index}`} value={index}>
                    {item.formatted}
                  </option>
                );
              })}
            </select>
          )}
          {selectedCityIndex !== undefined &&
          differenceDays >= 0 &&
          differenceDays < 7 ? (
            <>
              <div>
                <img
                  src={`http://openweathermap.org/img/wn/${weatherInfo?.weather[0].icon}@2x.png`}
                />
                {weatherInfo?.weather[0].icon && (
                  <WeatherIcon iconId={weatherInfo?.weather[0].icon} />
                )}
                <label>{weatherInfo?.weather[0].description}</label>
              </div>
              {weatherInfo?.temp && (
                <div>
                  <p>
                    Max: <span>{fromKToF(weatherInfo.temp.max)}</span>
                  </p>
                  <p>
                    Min: <span>{fromKToF(weatherInfo.temp.min)}</span>
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <div>no weather information</div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
