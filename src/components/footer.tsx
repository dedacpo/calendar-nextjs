export function Footer() {
  return (
    <div className="bg-[#2c3e50] p-4 min-h-[200px] grid grid-cols-1 md:grid-cols-2 text-white text-center">
      <div className="flex flex-col gap-2 justify-center">
        <p>© 2023 Denise Calsavara Paiva de Oliveira</p>
      </div>
      <div className="flex flex-col gap-2 justify-center">
        <p>
          <a href="https://github.com/dedacpo/calendar-nextjs">
            check this project at GitHub
          </a>
        </p>
        <p>
          <a href="https://opencagedata.com/">
            learn about OpenCage Geocoding API
          </a>
        </p>
        <p>
          <a href="https://openweathermap.org/">learn about OpenWeather API</a>
        </p>
        <p>
          <a href="https://nextjs.org/">learn about NextJS</a>
        </p>
      </div>
    </div>
  );
}
