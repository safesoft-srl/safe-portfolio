"use client";

import * as React from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react";

import { cn } from "@/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { CaretDownIcon, XIcon, CheckIcon } from "@phosphor-icons/react";

export type ComboboxOption = {
  value: string;
  label: string;
};

type Props = {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Seleccione una opción",
  disabled = false,
}: Props) {
  const [open, setOpen] = React.useState(false);

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? "";

  return (
    <ComboboxPrimitive.Root
      open={open}
      onOpenChange={setOpen}
      value={value}
      onValueChange={(val: unknown) => {
        if (typeof val === "string") {
          onChange(val);
        } else {
          onChange("");
        }
      }}
      disabled={disabled}
    >
      <InputGroup className="w-full">
        <ComboboxPrimitive.Input
          render={
            <InputGroupInput
              disabled={disabled}
              placeholder={selectedLabel || placeholder}
            />
          }
        />

        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            onClick={() => setOpen((v) => !v)}
          >
            <CaretDownIcon className="size-4" />
          </InputGroupButton>

          {value && (
            <InputGroupButton
              size="icon-xs"
              variant="ghost"
              onClick={() => onChange("")}
            >
              <XIcon />
            </InputGroupButton>
          )}
        </InputGroupAddon>
      </InputGroup>

      <ComboboxPrimitive.Portal>
        <ComboboxPrimitive.Positioner className="z-50">
          <ComboboxPrimitive.Popup
            className="mt-2 max-h-72 w-[--anchor-width] overflow-auto rounded-md border dark:bg-[#1f2552] p-1 shadow-md"
          >
            {options.length === 0 && (
              <div className="py-2 text-center text-sm text-muted-foreground">
                Sin resultados
              </div>
            )}

            {options.map((option) => (
              <ComboboxPrimitive.Item
                key={option.value}
                value={option.value}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-[#5c61eb]"
                )}
              >
                {option.label}

                {value === option.value && (
                  <CheckIcon className="size-4" />
                )}
              </ComboboxPrimitive.Item>
            ))}
          </ComboboxPrimitive.Popup>
        </ComboboxPrimitive.Positioner>
      </ComboboxPrimitive.Portal>
    </ComboboxPrimitive.Root>
  );
}