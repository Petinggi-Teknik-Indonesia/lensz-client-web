"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerEyeDropper,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from "@/components/ui/shadcn-io/color-picker";

type Props = {
  value?: string;
  defaultValue?: string;
  onChange: (color: string) => void;
};

const ColorPickerComponent = ({
  value,
  defaultValue = "#FFFFFF",
  onChange,
}: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded-full border"
              style={{ backgroundColor: value || defaultValue }}
            />
            <span>{value || "Select color"}</span>
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[260px] p-2 bg-gray-100 border-none shadow-md"
        align="start"
        side="bottom"
      >
        <ColorPicker
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
        >
          <ColorPickerSelection className="h-40" />

          <div className="flex items-center gap-2 mt-2">
            <ColorPickerEyeDropper />
            <div className="grid w-full gap-1">
              <ColorPickerHue />
              <ColorPickerAlpha />
            </div>
          </div>

          <div className="mt-2">
            <ColorPickerOutput />
          </div>
        </ColorPicker>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPickerComponent;
