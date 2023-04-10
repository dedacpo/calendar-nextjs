import { City } from "@/types/city";
import {
  DocumentData,
  addDoc,
  collection,
} from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { firestore } from "../../../../firebase/clientApp";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DocumentData>
) {
  if (req.method === "POST") {
    await addDoc(collection(firestore, "events"), {
      ...JSON.parse(req.body),
      date: new Date(JSON.parse(req.body).date),
    });
  }

  res.status(200).send({});
}
