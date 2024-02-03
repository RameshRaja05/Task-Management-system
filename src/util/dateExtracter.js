import { ExpressError } from "./expressError.js";
export const dateExtracter = (due_date) => {
  const dateRe = /(?<day>\d{1,2})[//-](?<month>\d{1,2})[//-](?<year>\d{4})/gs;
  const dateMat = dateRe.exec(due_date);
  if (!dateMat) {
    throw new ExpressError("date must be in dd/mm/yyyy", 422);
  }
  const { year, month, day } = dateMat.groups;
  return new Date(+year, +month - 1, +day + 1);
};
