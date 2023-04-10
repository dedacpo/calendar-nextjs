import { intlFormat } from "date-fns";
import { Modal } from "./modal";
import { useState } from "react";
import { CalendarEvent } from "@/types/calendarEvent";
import Accordion from "./accordion";
import { Button } from "@material-tailwind/react";
import { WeatherInfo } from "./weatherInfo";

export function ModalViewEvent(props: {
  isOpen: boolean;
  handler: () => void;
  clickedDate: Date;
  events: CalendarEvent[];
  onAddNewEvent: () => void;
}) {
  const { isOpen, handler, clickedDate, events, onAddNewEvent } = props;

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
      <Modal
        secondaryAction={{
          label: "close",
          onClick: handler,
        }}
        isOpen={isOpen}
        handler={handler}
        header={title}
      >
        {events.map((item, index) => {
          return (
            <Accordion
              key={`event-accordion-${item.id}`}
              title={item.title}
              isOpen={index === 0}
            >
              <div className="flex justify-center">
                <div>
                  <strong className="font-bold">{item.cityName}</strong>
                  <WeatherInfo
                    onSetSelectedTemperature={setSelectedTemperature}
                    event={item}
                    selectedTemperature={selectedTemperature}
                  />
                </div>
              </div>
            </Accordion>
          );
        })}
        <div className="flex justify-center">
          <Button
            variant="filled"
            color="teal"
            onClick={onAddNewEvent}
            className="mr-1 mt-6 text-2xl"
          >
            <span>+</span>
          </Button>
        </div>
      </Modal>
    </>
  );
}
