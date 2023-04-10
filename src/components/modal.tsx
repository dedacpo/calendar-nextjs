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
  header: string;
  children: ReactNode;
  primaryAction?: {
    label: string;
    onClick: (data?: any) => void;
  };
  secondaryAction?: {
    label: string;
    onClick: (data?: any) => void;
  };
  handler: () => void;
};

export function Modal(props: ModalProps) {
  const { isOpen, primaryAction, header, children, secondaryAction, handler } =
    props;

  return (
    <>
      <Fragment>
        <Dialog open={isOpen} handler={handler}>
          <DialogHeader className="justify-center">{header}</DialogHeader>
          <DialogBody divider>{children}</DialogBody>
          {(secondaryAction || primaryAction) && (
            <>
              <DialogFooter>
                {secondaryAction && (
                  <Button
                    variant="outlined"
                    color="teal"
                    onClick={secondaryAction.onClick}
                    className="mr-1"
                  >
                    <span>{secondaryAction.label}</span>
                  </Button>
                )}

                {primaryAction && (
                  <Button
                    variant="filled"
                    color="teal"
                    onClick={primaryAction.onClick}
                    className="mr-1"
                  >
                    <span>{primaryAction.label}</span>
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </Dialog>
      </Fragment>
    </>
  );
}
