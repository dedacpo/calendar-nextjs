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
    result.push({
      ...doc.data(),
      date: new Date(
        doc.data().date.toDate().getTime() +
          Math.abs(doc.data().date.toDate().getTimezoneOffset() * 60000)
      ),
      id: doc.id,
    });
  });
  res.status(200).send(result);
}
