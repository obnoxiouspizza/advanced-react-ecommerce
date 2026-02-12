export const toTitleCase = (value: string): string => {
  return value
    .split(" ")
    .map((word) => {
      const lower = word.toLowerCase();
      return lower.length ? lower[0].toUpperCase() + lower.slice(1) : lower;
    })
    .join(" ");
};
