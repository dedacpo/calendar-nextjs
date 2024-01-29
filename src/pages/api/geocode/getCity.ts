import { City } from "@/types/city";
import { NextApiRequest, NextApiResponse } from "next";

const KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const URL_API = "https://api.opencagedata.com/geocode/v1/json";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<City>
) {
  let geoCodeResp;
  if (req.query) {
    geoCodeResp = await fetch(`${URL_API}?q=${req.query.cityName}&key=${KEY}`, {
      method: "GET",
    });
  }
  res.status(200).send(await geoCodeResp?.json());
}
