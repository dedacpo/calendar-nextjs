import { City } from "@/types/city";
import { Weather } from "@/types/weather";
import { NextApiRequest, NextApiResponse } from "next";

const KEY = process.env.NEXT_PUBLIC_OPENCAGE_GEOCODE_API_KEY;
const URL_API = "https://api.openweathermap.org/data/2.5/onecall";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Weather>
) {
  let weatherResp;
  if (req.query) {
    weatherResp = await fetch(
      `${URL_API}?lat=${req.query.lat}&lon=${req.query.lng}&appid=${KEY}`,
      {
        method: "GET",
      }
    );
  }
  res.status(200).send(await weatherResp?.json());
}
