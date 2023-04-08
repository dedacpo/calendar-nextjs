export default function getClassName(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
