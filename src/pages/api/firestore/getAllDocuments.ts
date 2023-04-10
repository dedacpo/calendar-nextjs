import { City } from "@/types/city";
import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { firestore } from "../../../../firebase/clientApp";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DocumentData>
) {
  let querySnapshot;
  if (req.query?.dateStart && req.query?.dateEnd) {
    let start = new Date(req.query.dateStart.toString());
    let end = new Date(req.query.dateEnd.toString());
    const q = query(
      collection(firestore, "events"),
      where("date", ">", start),
      where("date", "<", end)
    );
    querySnapshot = await getDocs(q);
  } else {
    querySnapshot = await getDocs(collection(firestore, "events"));
  }

  const result: DocumentData = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    result.push({
      ...doc.data(),
      date: new Date(doc.data().date.seconds * 1000),
      id: doc.id,
    });
  });
  console.log(result);
  res.status(200).send(result);
}
