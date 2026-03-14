import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { addMonths, subMonths, addWeeks, subWeeks } from "date-fns";
import CalendarNav, { type CalViewMode } from "./CalendarNav";
import CalendarGrid from "./CalendarGrid";
import DayDetailPanel from "./DayDetailPanel";

export default function TodoCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calView, setCalView] = useState<CalViewMode>("month");
  const [direction, setDirection] = useState(0);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentDate((d) =>
      calView === "month" ? subMonths(d, 1) : subWeeks(d, 1)
    );
  }, [calView]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentDate((d) =>
      calView === "month" ? addMonths(d, 1) : addWeeks(d, 1)
    );
  }, [calView]);

  const handleToday = useCallback(() => {
    setDirection(0);
    setCurrentDate(new Date());
  }, []);

  const handleSelectDate = useCallback((d: Date) => {
    setSelectedDate((prev) =>
      prev && prev.toDateString() === d.toDateString() ? null : d
    );
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedDate(null);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <CalendarNav
        currentDate={currentDate}
        calView={calView}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onViewChange={setCalView}
      />

      <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
        <CalendarGrid
          currentDate={currentDate}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
          direction={direction}
          calView={calView}
        />
        <DayDetailPanel
          selectedDate={selectedDate}
          onClose={handleClosePanel}
        />
      </div>
    </motion.div>
  );
}
