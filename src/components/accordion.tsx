import { Fragment, ReactNode, useState } from "react";
import {
  Accordion as AccordionLib,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

export type AccordionProps = {
  isOpen?: boolean;
  title: string;
  children: ReactNode;
};

export default function Accordion(props: AccordionProps) {
  const { isOpen, children, title } = props;

  const [open, setOpen] = useState(isOpen ?? false);

  return (
    <Fragment>
      <AccordionLib open={open}>
        <AccordionHeader
          onClick={() => {
            setOpen(!open);
          }}
        >
          {title}
        </AccordionHeader>
        <AccordionBody>{children}</AccordionBody>
      </AccordionLib>
    </Fragment>
  );
}
