import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import { Fragment, ReactNode, useState } from "react";

export type ModalProps = {
  isOpen: boolean;
  handler: () => void;
  header: string;
  children: ReactNode;
  submit?: (data: any) => void;
};

export function Modal(props: ModalProps) {
  const { isOpen, handler, header, children, submit } = props;

  return (
    <>
      <Fragment>
        <Dialog open={isOpen} handler={handler}>
          <DialogHeader className="justify-center">{header}</DialogHeader>
          <DialogBody divider>{children}</DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={handler}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button variant="gradient" color="green" onClick={submit}>
              <span>Confirm</span>
            </Button>
          </DialogFooter>
        </Dialog>
      </Fragment>
    </>
  );
}
