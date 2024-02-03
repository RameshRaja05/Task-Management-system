export const calculatePriority = (due_date) => {
  const curDate = new Date();
  // get a difference between curDate and due_date of task field in day format
  const timeDiffInDays = Math.floor(
    (due_date - curDate) / (24 * 60 * 60 * 1000)
  );
  switch (true) {
    case timeDiffInDays <= 0: // Today
      return 0;
    case timeDiffInDays <= 2: // between tomorrow and day after tomorrow
      return 1;
    case timeDiffInDays <= 4: // 3-4
      return 2;
    default:
      return 3;
  }
};
