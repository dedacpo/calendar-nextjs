export function fromKToF(value: number) {
  return (((value - 273.15) * 9) / 5 + 32).toFixed(0);
}

export function fromKToC(value: number) {
  return (value - 273.15).toFixed(0);
}
