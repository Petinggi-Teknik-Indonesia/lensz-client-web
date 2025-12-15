"use client";

import * as React from "react";
import Color from "color";
import { Pipette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type ColorFormat = "hex" | "rgb" | "hsl" | "css";

interface ColorPickerContextValue {
  color: InstanceType<typeof Color>;
  setColor: (color: InstanceType<typeof Color>) => void;
  format: ColorFormat;
  setFormat: (format: ColorFormat) => void;
}

const ColorPickerContext = React.createContext<
  ColorPickerContextValue | undefined
>(undefined);

function useColorPicker() {
  const context = React.useContext(ColorPickerContext);
  if (!context) {
    throw new Error("useColorPicker must be used within ColorPicker");
  }
  return context;
}

interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  defaultValue?: string;
  className?: string;
  children: React.ReactNode;
}

export function ColorPicker({
  value,
  onChange,
  defaultValue = "#3b82f6",
  className,
  children,
}: ColorPickerProps) {
  const [internalColor, setInternalColor] = React.useState(() =>
    Color(defaultValue)
  );
  const [format, setFormat] = React.useState<ColorFormat>("hex");

  const color = value ? Color(value) : internalColor;

  const handleColorChange = React.useCallback(
    (newColor: InstanceType<typeof Color>) => {
      if (!value) {
        setInternalColor(newColor);
      }
      onChange?.(newColor.hex());
    },
    [value, onChange]
  );

  return (
    <ColorPickerContext.Provider
      value={{ color, setColor: handleColorChange, format, setFormat }}
    >
      <div className={cn("space-y-3", className)}>{children}</div>
    </ColorPickerContext.Provider>
  );
}

export function ColorPickerSelection({ className }: { className?: string }) {
  const { color, setColor } = useColorPicker();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const hsv = color.hsv().object();
  const saturation = hsv.s;
  const lightness = hsv.v;

  const updateColor = React.useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const y = Math.max(0, Math.min(clientY - rect.top, rect.height));

      const newSaturation = (x / rect.width) * 100;
      const newLightness = 100 - (y / rect.height) * 100;

      const newColor = Color.hsv(hsv.h, newSaturation, newLightness);
      setColor(newColor);
    },
    [hsv.h, setColor]
  );

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      updateColor(e.clientX, e.clientY);
    },
    [updateColor]
  );

  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateColor(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, updateColor]);

  const hueColor = Color.hsv(hsv.h, 100, 100).hex();

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-10 cursor-crosshair ", className)}
      style={{
        background: `
          linear-gradient(to bottom, transparent, black),
          linear-gradient(to right, white, ${hueColor})
        `,
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
        style={{
          left: `${saturation}%`,
          top: `${100 - lightness}%`,
          backgroundColor: color.hex(),
        }}
      />
    </div>
  );
}

export function ColorPickerHue() {
  const { color, setColor } = useColorPicker();
  const hsl = color.hsl().object();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = Number.parseInt(e.target.value);
    const newColor = Color.hsl(newHue, hsl.s, hsl.l);
    setColor(newColor);
  };

  return (
    <div className=" w-full">
      <input
        type="range"
        min="0"
        max="360"
        value={hsl.h}
        onChange={handleChange}
        className="h-3 w-full cursor-pointer appearance-none rounded-md"
        style={{
          background:
            "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
        }}
      />
    </div>
  );
}

export function ColorPickerAlpha() {
  const { color, setColor } = useColorPicker();
  const alpha = color.alpha();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAlpha = Number.parseFloat(e.target.value);
    const newColor = color.alpha(newAlpha);
    setColor(newColor);
  };

  return (
    <div className="w-full">
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={alpha}
        onChange={handleChange}
        className="h-3 w-full cursor-pointer appearance-none rounded-md"
        style={{
          background: `linear-gradient(to right, 
            transparent 0%, 
            ${color.hex()} 100%
          ), 
          repeating-conic-gradient(#e5e7eb 0% 25%, white 0% 50%) 50% / 8px 8px`,
        }}
      />
    </div>
  );
}

export function ColorPickerEyeDropper() {
  const { setColor } = useColorPicker();
  const [isSupported, setIsSupported] = React.useState(false);

  React.useEffect(() => {
    setIsSupported("EyeDropper" in window);
  }, []);

  const handleClick = async () => {
    if (!("EyeDropper" in window)) {
      alert("EyeDropper API is not supported in your browser");
      return;
    }

    try {
      // @ts-ignore - EyeDropper is not in TypeScript types yet
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      setColor(Color(result.sRGBHex));
    } catch (error) {
      // User cancelled or error occurred
      console.error("EyeDropper error:", error);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={handleClick}
      className="h-9 w-9 shrink-0 bg-transparent"
    >
      <Pipette className="h-4 w-4" />
    </Button>
  );
}

export function ColorPickerOutput() {
  const { color, format, setColor } = useColorPicker();

  const getColorString = () => {
    switch (format) {
      case "hex":
        return color.hex();
      case "rgb":
        return color.rgb().string();
      case "hsl":
        return color.hsl().string();
      case "css":
        return color.string();
      default:
        return color.hex();
    }
  };

  const colorString = getColorString();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const newColor = Color(e.target.value);
      setColor(newColor);
    } catch {
      // Invalid color, ignore
    }
  };

  return (
    <div className="flex flex-1 items-center gap-2">
      <div
        className="h-9 w-9 shrink-0 rounded-md border"
        style={{ backgroundColor: color.string() }}
      />
      <Input
        value={colorString}
        onChange={handleInputChange}
        className="flex-1"
      />
      <div className="text-sm text-muted-foreground whitespace-nowrap">
        {Math.round(color.alpha() * 100)} %
      </div>
    </div>
  );
}

export function ColorPickerFormat() {
  const { format, setFormat } = useColorPicker();

  return (
    <Select
      value={format}
      onValueChange={(value: ColorFormat) => setFormat(value)}
    >
      <SelectTrigger className="w-20">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="hex">HEX</SelectItem>
        <SelectItem value="rgb">RGB</SelectItem>
        <SelectItem value="hsl">HSL</SelectItem>
        <SelectItem value="css">CSS</SelectItem>
      </SelectContent>
    </Select>
  );
}
