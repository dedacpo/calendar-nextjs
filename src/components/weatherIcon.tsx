export function WeatherIcon(props: { iconId: string; className?: string }) {
  return (
    <img
      className={props.className}
      src={`http://openweathermap.org/img/wn/${props.iconId}@2x.png`}
    />
  );
}
