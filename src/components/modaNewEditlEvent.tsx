import {
  addDays,
  differenceInCalendarDays,
  format,
  intlFormat,
} from "date-fns";
import { Modal } from "./modal";
import { useCallback, useEffect, useState } from "react";
import { City } from "@/types/city";
import { Weather } from "@/types/weather";
import { CalendarEvent } from "@/types/calendarEvent";
import { Input, Select, Option } from "@material-tailwind/react";
import debounce from "lodash.debounce";
import { WeatherInfo } from "./weatherInfo";

export function ModalNewEditEvent(props: {
  isOpen: boolean;
  handler: () => void;
  clickedDate: Date;
  submit: (event: CalendarEvent) => void;
  eventEdit?: CalendarEvent;
}) {
  const { isOpen, handler, clickedDate, submit, eventEdit } = props;

  console.log("eventEdit", eventEdit);
  let eventWeather: Weather | undefined;

  const [cities, setCities] = useState<City[]>();
  const [selectedCityIndex, setSelectedCityIndex] = useState<number>();
  const [weatherInfo, setWeatherInfo] = useState<Weather>();
  const [eventName, setEventName] = useState<string>();
  const [selectedTemperature, setSelectedTemperature] = useState<
    "Kelvin" | "Celsius" | "Fahrenheit"
  >("Fahrenheit");

  const [formattedCityName, setFormattedCityName] = useState<string>();

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

  const debouncedSave = useCallback(
    debounce((nextValue) => {
      handleCitySearch(nextValue);
      setSelectedCityIndex(undefined);
      setWeatherInfo(undefined);
    }, 300),
    [] // será criada apenas uma vez inicialmente
  );

  const handleCitySearch = async (value: string) => {
    const resp = await (
      await fetch(`/api/geocode/getCity?cityName=${value}`)
    ).json();
    setCities(resp.results);
    console.log("eventEdit", eventEdit);
  };

  const handleWeather = async (value: number) => {
    if (cities) {
      const resp = await (
        await fetch(
          `/api/openWeather/getWeather?lat=${cities[value]?.geometry.lat}&lng=${cities[value]?.geometry.lng}`
        )
      ).json();
      setWeatherInfo(resp.daily[differenceDays]);
    }
  };
  
  useEffect(() => {
    if (eventEdit) {
      eventWeather = {
        temp: {
          max: eventEdit.temperatureMax,
          min: eventEdit.temperatureMin,
        },
        weather: [
          {
            description: eventEdit.weatherDescr,
            icon: eventEdit.weatherIcon,
            id: eventEdit.weatherId,
            main: eventEdit.weatherMain,
          },
        ],
      };
      setWeatherInfo(eventWeather);
      setEventName(eventEdit.title);
      setFormattedCityName(eventEdit.cityName);
      setSelectedCityIndex(eventEdit.cityIndex);
    }
  }, [eventEdit, cities]);

  useEffect(() => {
    debouncedSave(formattedCityName);
  }, [formattedCityName]);

  // useEffect(() => {
  //   console.log("cities", cities, eventEdit)
  //   setSelectedCityIndex(eventEdit?.cityName)
  // }, [cities]);

  const clearInfo = () => {
    setSelectedCityIndex(undefined);
    setWeatherInfo(undefined);
    setCities(undefined);
    setEventName(undefined);
    setFormattedCityName(undefined);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        handler={() => {
          handler();
          clearInfo();
        }}
        header={title}
        secondaryAction={{
          label: "cancel",
          onClick: () => {
            handler();
            clearInfo();
          },
        }}
        primaryAction={{
          label: "Submit",
          onClick: () => {
            submit({
              cityName: cities?.[selectedCityIndex ?? 0].formatted,
              date: clickedDate,
              lat: cities?.[selectedCityIndex ?? 0].geometry.lat,
              lng: cities?.[selectedCityIndex ?? 0].geometry.lng,
              temperatureMax: weatherInfo?.temp.max,
              temperatureMin: weatherInfo?.temp.min,
              title: eventName,
              weatherDescr: weatherInfo?.weather[0].description,
              weatherIcon: weatherInfo?.weather[0].icon,
              weatherId: weatherInfo?.weather[0].id,
              weatherMain: weatherInfo?.weather[0].main,
            } as CalendarEvent);
            clearInfo();
          },
        }}
      >
        <div className="mt-4">
          <Input
            required
            label="Event name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <Input
            required
            label="Event city"
            value={formattedCityName}
            onChange={(e) => {
              debouncedSave(e.target.value);
              setFormattedCityName(e.target.value);
            }}
          />
          {cities && formattedCityName && (
            <div className="mt-4">
              <select
                value={selectedCityIndex?.toString()}
                onChange={(value) => {
                  setSelectedCityIndex(Number(value.target.value));
                  if (differenceDays >= 0 && differenceDays < 7) {
                    handleWeather(Number(value.target.value));
                  }
                }}
              >
                <option value={-1}>
                  Select an option to get weather information for that city
                </option>

                {cities?.map((item: City, index) => {
                  return (
                    <option key={`option-${index}`} value={index.toString()}>
                      {item.formatted}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
          {(selectedCityIndex !== undefined &&
            weatherInfo &&
            differenceDays >= 0 &&
            differenceDays < 7) ||
          (eventEdit && eventEdit.weatherId && weatherInfo) ? (
            <>
              <div className="flex justify-center mt-4">
                <WeatherInfo
                  selectedTemperature={selectedTemperature}
                  onSetSelectedTemperature={setSelectedTemperature}
                  event={
                    {
                      weatherIcon: weatherInfo?.weather[0].icon,
                      temperatureMax: weatherInfo?.temp.max,
                      temperatureMin: weatherInfo?.temp.min,
                      weatherDescr: weatherInfo?.weather[0].description,
                      weatherMain: weatherInfo?.weather[0].main,
                    } as CalendarEvent
                  }
                />
              </div>
            </>
          ) : (
            selectedCityIndex !== undefined && (
              <div className="my-4 flex">
                <p className="m-auto text-center">
                  no weather information *<br />
                  <small>
                    We can only search for weather information for today and
                    next 6 days from today (from{" "}
                    {format(new Date(), "MM/dd/yyyy")} to{" "}
                    {format(addDays(new Date(), 7), "MM/dd/yyyy")})
                  </small>
                </p>
              </div>
            )
          )}
        </div>
      </Modal>
    </>
  );
}
