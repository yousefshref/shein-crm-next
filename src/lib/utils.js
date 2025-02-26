import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (number) => {
  return Number(number).toLocaleString() || 0;
};
