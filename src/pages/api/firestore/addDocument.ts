import { City } from "@/types/city";
import { DocumentData, addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { firestore } from "../../../../firebase/clientApp";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DocumentData>
) {
  if (req.method === "POST") {
    const parsed = JSON.parse(req.body);
    if(parsed.id){
      await updateDoc(doc(firestore, "events", parsed.id), {
        ...parsed,
        date: new Date(parsed.date),
      });
    }else{
      await addDoc(collection(firestore, "events"), {
        ...parsed,
        date: new Date(parsed.date),
      });
    }
    
  }

  res.status(200).send({});
}
