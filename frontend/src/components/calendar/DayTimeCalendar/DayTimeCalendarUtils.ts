import moment from "moment";
import type { NavigateAction } from "react-big-calendar";

export const disableRemainingDays = (
  date: Date,
  action: NavigateAction,
  setDisabledDates: (value: React.SetStateAction<Date[]>) => void
) => {
  const days: Date[] = [];
  if (action === "NEXT") {
    const endOfWeek = moment(date).endOf("week");
    let currDate = moment(date).clone();
    while (currDate.isBefore(endOfWeek, "day")) {
      currDate = currDate.add(1, "day").clone();
      days.push(currDate.toDate());
    }
  } else {
    const startOfWeek = moment(date).startOf("week");
    let currDate = moment(date).clone();
    while (currDate.isAfter(startOfWeek, "day")) {
      currDate = currDate.subtract(1, "day").clone();
      days.push(currDate.toDate());
    }
  }
  setDisabledDates((prev) => [...prev, ...days]);
};
