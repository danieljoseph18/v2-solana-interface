import { Bar } from "./types";

export function formatTimeInBarToMs(bar: Bar) {
  return {
    ...bar,
    time: bar.time * 1000,
  };
}
