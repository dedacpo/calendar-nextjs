import { City } from "@/types/city";
import { DocumentData, deleteDoc, doc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { firestore } from "../../../../firebase/clientApp";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DocumentData>
) {
  if (req.method === "POST") {
    await deleteDoc(doc(firestore, "events", JSON.parse(req.body).id));
  }

  res.status(200).send({});
}
