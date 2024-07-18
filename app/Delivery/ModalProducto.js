import AddToCart from "@/components/AddToCart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/firebase/firebaseClient";
import { useCarStore } from "@/store";
import {
  collection,
  documentId,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";

const ModalProduct = ({ OpenModal, setOpenModal, name }) => {
  const [cart, addToCardProduc, addToCard, removeFromCart] = useCarStore(
    (state) => [
      state.cart,
      state.addToCardProduc,
      state.addToCard,
      state.removeFromCart,
    ]
  );

  const [Cantidad, setCantidad] = useState(
    cart.filter((p) => p.id === OpenModal?.Product.id) || []
  );
  const [ListaPreguntas, setListaPreguntas] = useState([]);

  const [Adicionales, setAdicionales] = useState([]);
  console.log("cart", cart);

  const { toast } = useToast();

  const closeOpenModal = () => {
    setOpenModal({
      Visible: false,
      Product: {},
    });

    setCantidad([]);
  };

  useEffect(() => {
    if (OpenModal?.Product?.id) {
      const unsubscribe = onSnapshot(
        collection(
          db,
          `Productos`,
          `${OpenModal?.Product?.id}`,
          "OpcionesPersonalizables"
        ),
        (snapshot) => {
          const resAndQue = cart.find((p) => p.id === OpenModal?.Product.id);
          const data = snapshot?.docs?.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          if (resAndQue?.PreguntasRespuestas?.length) {
            const newPreguntas = data.map((pregunta) => {
              const preguntaRespuesta = resAndQue?.PreguntasRespuestas.find(
                (p) => p.id === pregunta.id
              );
              return {
                ...pregunta,
                Respuesta: preguntaRespuesta?.Respuesta || "",
                Respuestas: preguntaRespuesta?.Respuestas || [],
              };
            });

            setListaPreguntas(newPreguntas);
          } else {
            setListaPreguntas(data);
          }
        }
      );

      return () => unsubscribe();
    }
  }, [OpenModal?.Product?.id]);

  useEffect(() => {
    const adicionalesIds =
      OpenModal?.Product?.Adicionales?.map((adc) => adc.id) || [];

    if (adicionalesIds.length > 0) {
      const q = query(
        collection(db, "Productos"),
        where(documentId(), "in", adicionalesIds)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot?.docs?.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Data", data);
        setAdicionales(data);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [OpenModal?.Product?.Adicionales]);

  const handleInputChange = (preguntaId, optionId, checked, tipoPregunta) => {
    setListaPreguntas((prevListaPreguntas) =>
      prevListaPreguntas.map((pregunta) => {
        if (pregunta.id === preguntaId) {
          if (tipoPregunta === "Seleccion") {
            return {
              ...pregunta,
              Respuesta: optionId,
            };
          } else if (tipoPregunta === "Seleccion Multiple") {
            const respuestasActuales = pregunta.Respuestas || [];
            let nuevasRespuestas;
            if (checked) {
              nuevasRespuestas = [...respuestasActuales, optionId];
            } else {
              nuevasRespuestas = respuestasActuales.filter(
                (respuesta) => respuesta !== optionId
              );
            }
            return {
              ...pregunta,
              Respuestas: nuevasRespuestas,
            };
          }
        }
        return pregunta;
      })
    );
  };

  return (
    <Dialog open={OpenModal?.Visible} onOpenChange={closeOpenModal}>
      <DialogContent className="h-auto w-[90%] md:w-full max-h-[95vh] overflow-auto sm:max-w-4xl">
        <DialogHeader className="w-full h-full">
          <DialogTitle>Descripción del producto</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!Cantidad.length) {
              toast({
                title: "Alerta",
                description: " Debe seleccionar al menos una cantidad",
              });
              return;
            }
            addToCardProduc(OpenModal?.Product, Cantidad, ListaPreguntas);
            // closeOpenModal();
          }}
          className="border rounded-md p-3 space-y-2"
        >
          <div className="uppercase flex items-center space-x-2 text-gray-800 text-sm">
            <div className="">{name}</div>

            <span>
              <svg
                className="h-5 w-5 leading-none text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
            <div className="">{OpenModal?.Product?.NombreProducto}</div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full overflow-auto gap-2 gap-x-4 ">
            <section className="relative w-full h-[400px] aspect-square">
              <Image
                className="rounded-t-lg"
                fill
                src={OpenModal?.Product?.Imagenes[0] || ""}
                alt={OpenModal?.Product?.NombreProducto}
                style={{
                  objectFit: "cover",
                }}
              />
            </section>
            <div className="w-full h-full space-y-3">
              <div className="space-y-1">
                <h1 className="font-medium uppercase text-lg">
                  {OpenModal?.Product?.NombreProducto}
                </h1>
                <div className="flex items-center space-x-4 my-4">
                  <div className="flex gap-x-2">
                    <div className="rounded-lg bg-gray-100 flex py-2 px-3">
                      <span className="font-bold text-green-600 text-3xl">
                        S/ {OpenModal?.Product?.Precio}
                      </span>
                    </div>
                  </div>
                </div>
                <p>{OpenModal?.Product?.Descripcion}</p>
              </div>
              {ListaPreguntas?.length > 0 && (
                <div className="border border-gray-400 rounded-md p-3 space-y-1 capitalize">
                  {ListaPreguntas?.map((pregunta) => (
                    <div key={pregunta.id}>
                      <h1 className="text-lg font-bold">
                        {pregunta?.Pregunta}{" "}
                        {pregunta?.Obligatoria === "Obligatorio" ? (
                          <span className="font-normal text-red-700">
                            Obligatorio (*)
                          </span>
                        ) : (
                          ""
                        )}
                      </h1>

                      {pregunta?.TipoPregunta === "Seleccion" ? (
                        <div className="grid grid-cols-2 justify-center items-center gap-x-2">
                          {pregunta?.Opciones?.map((option, key) => (
                            <div className="space-x-1" key={key}>
                              <input
                                required={
                                  pregunta?.Obligatoria === "Obligatorio"
                                }
                                type="radio"
                                id={`radio-${option}`}
                                name={`seleccion-${pregunta.id}`}
                                onChange={(e) =>
                                  handleInputChange(
                                    pregunta.id,
                                    option,
                                    e.target.checked,
                                    "Seleccion"
                                  )
                                }
                                defaultChecked={pregunta?.Respuesta === option}
                              />
                              <label htmlFor={`radio-${option}`}>
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        pregunta?.TipoPregunta === "Seleccion Multiple" && (
                          <div className="grid grid-cols-2 justify-center items-center gap-x-2">
                            {pregunta?.Opciones?.map((option, key) => (
                              <div key={option} className="space-x-1">
                                <input
                                  required={
                                    pregunta?.Obligatoria === "Obligatorio"
                                  }
                                  type="checkbox"
                                  id={`checkbox-${option}`}
                                  name={`seleccionMultiple-${option}`}
                                  value={option}
                                  defaultChecked={pregunta?.Respuestas?.includes(
                                    option
                                  )}
                                  onChange={(e) =>
                                    handleInputChange(
                                      pregunta.id,
                                      option,
                                      e.target.checked,
                                      "Seleccion Multiple"
                                    )
                                  }
                                />
                                <label htmlFor={`checkbox-${option}`}>
                                  {option}
                                </label>
                              </div>
                            ))}
                          </div>
                        )
                      )}

                      <hr />
                    </div>
                  ))}
                </div>
              )}

              {Adicionales?.length > 0 && (
                <div className="border border-gray-400 rounded-md p-3 space-y-1 capitalize">
                  <h1 className="text-lg font-bold">Adicionales</h1>
                  <div className="grid grid-cols-2 justify-center items-center gap-x-2">
                    {Adicionales?.map((option, key) => (
                      <div key={option.id} className="space-x-1">
                        <input
                          type="checkbox"
                          id={`checkbox-${option.id}`}
                          name={`seleccionMultiple-${option.id}`}
                          value={option.id}
                          defaultChecked={cart.find((p) => p.id === option.id)}
                          onChange={(e) => {
                            // addToCard

                            if (e.target.checked) {
                              addToCard(option);
                              return;
                            } else if (!e.target.checked) {
                              removeFromCart(option);
                              return;
                            }
                          }}
                        />
                        <label htmlFor={`checkbox-${option.id}`}>
                          {option?.NombreProducto}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <AddToCart
                product={OpenModal?.Product}
                Cantidad={Cantidad}
                setCantidad={setCantidad}
                show={true}
              />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalProduct;
