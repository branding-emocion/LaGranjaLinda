"use client";
import Product from "@/components/Product";
import { db } from "@/firebase/firebaseClient";
import useFirestoreCollection from "@/lib/useFirestoreCollection";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import LoadingSearch from "./loading";
import ModalProduct from "../ModalProducto";

const Search = ({ searchParams: { q, name } }) => {
  const [Productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [OpenModal, setOpenModal] = useState({
    Visible: false,
    Produc: {},
  });
  useEffect(() => {
    if (q) {
      const qProductos = query(
        collection(db, "Productos"),
        where("Disponibilidad", "==", "Si"),
        where("Categoria", "==", q)
        //Agregar  Disponibilidad="Si" para mostrar solo los productos disponibles
      );

      const unsubscribe = onSnapshot(qProductos, (snapshot) => {
        setProductos(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
        setLoading(false);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, [q]);

  return (
    <>
      {OpenModal.Visible && (
        <ModalProduct
          OpenModal={OpenModal}
          setOpenModal={setOpenModal}
          name={name}
        />
      )}
      <div className="p-10 mb-10">
        <h1 className="text-3xl font-bold mb-2 ">
          {" "}
          Resultados para <span className="uppercase">{name}</span>
        </h1>
        <h2 className="mb-5 text-gray-400">({Productos?.length} results)</h2>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading ? (
            <LoadingSearch />
          ) : (
            <>
              {Productos?.map((product) => (
                <li key={product.id}>
                  <Product
                    product={product}
                    name={name}
                    setOpenModal={setOpenModal}
                  />
                </li>
              ))}
            </>
          )}
        </ul>
      </div>
    </>
  );
};
export default Search;
