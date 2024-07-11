"use client";

import { db } from "@/firebase/firebaseClient";
import { collection, onSnapshot, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";

const useFirestoreCollection = (collectionName, orderByField) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      orderByField ? orderBy(orderByField, "asc") : "",
      (snapshot) => {
        const newData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(newData);
      }
    );

    return () => unsubscribe();
  }, [collectionName, orderByField]);

  return data;
};

export default useFirestoreCollection;
