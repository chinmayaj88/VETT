import * as React from "react"
import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

interface DatePickerProps {
  value?: string | null;
  onChange: (date: string | null) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function DatePickerInput({
  value,
  onChange,
  placeholder = "Select date and time",
  className,
  id,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  
  // Validate and parse date safely
  const selectedDate = React.useMemo(() => {
    if (!value) return null;
    try {
      const date = new Date(value);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return null;
      }
      return date;
    } catch {
      return null;
    }
  }, [value]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      // Validate date is not invalid
      if (isNaN(date.getTime())) {
        onChange(null);
        return;
      }
      onChange(date.toISOString());
    } else {
      onChange(null);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {value && selectedDate ? (
            (() => {
              try {
                return selectedDate.toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                });
              } catch {
                return <span>{placeholder}</span>;
              }
            })()
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Date and Time</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            showTimeSelect
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            inline
            className="w-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

