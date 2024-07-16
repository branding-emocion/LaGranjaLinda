import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { useToast } from "@/components/ui/use-toast";
import React, { useEffect, useState } from "react";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Pencil, XIcon } from "lucide-react";

const ModalPreguntas = ({ ModalQuestion, setModalQuestion }) => {
  const [InputValues, setInputValues] = useState({});
  const [ListaPreguntas, setListaPreguntas] = useState([]);
  console.log("ListaPreguntas", ListaPreguntas);

  const [Loading, setLoading] = useState(false);
  const { toast } = useToast();

  const closeModalQuestion = () => {
    setModalQuestion({
      Visible: false,
      Producto: {},
    });
    setInputValues({});
  };

  const HandlerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!InputValues?.Opciones?.length > 0) {
        alert("Debes agregar al menos una opción");
        return;
      }

      if (InputValues?.id) {
        const docRef = await updateDoc(
          doc(
            db,
            `Productos`,
            `${ModalQuestion?.Producto?.id}`,
            "OpcionesPersonalizables",
            `${InputValues?.id}`
          ),
          {
            ...InputValues,
          }
        );
      } else {
        const docRef = await addDoc(
          collection(
            db,
            `Productos`,
            `${ModalQuestion?.Producto?.id}`,
            "OpcionesPersonalizables"
          ),
          {
            ...InputValues,
            createdAt: serverTimestamp(),
          }
        );
      }
      setInputValues({});
      e.target.reset();
    } catch (err) {
      console.error("Error:", err);
      toast({
        title: err?.error?.errorInfo?.code || "Internal Server Error",
        description: err?.error?.errorInfo?.message || "Contacte con soporte",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onSnapshot(
      collection(
        db,
        `Productos`,
        `${ModalQuestion?.Producto?.id}`,
        "OpcionesPersonalizables"
      ),
      // orderBy("email", "asc"),
      (snapshot) => {
        const data = snapshot?.docs?.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setListaPreguntas(data);
      }
    );
  }, []);

  console.log("InputValues", InputValues);
  return (
    <Dialog open={ModalQuestion?.Visible} onOpenChange={closeModalQuestion}>
      <DialogContent className="h-auto  w-[90%] md:w-full max-h-[95vh] overflow-auto   sm:max-w-4xl">
        <DialogHeader className="w-full h-full">
          <DialogTitle>Preguntas adicionales</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={HandlerSubmit} className="space-y-4 w-full h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3  ">
            <div className=" space-y-2">
              <div className="">
                <Label htmlFor="Pregunta" className="">
                  Pregunta ? <span className="text-red-600">(*)</span>
                </Label>
                <Input
                  id="Pregunta"
                  name="Pregunta"
                  className="w-full text-gray-900"
                  onChange={(e) => {
                    setInputValues({
                      ...InputValues,
                      Pregunta: e.target.value,
                    });
                  }}
                  value={InputValues?.Pregunta}
                  required
                  autoComplete="off"
                  autoFocus
                  type="text"
                />
              </div>
              <div className="space-y-2  ">
                <Label htmlFor="TipoPregunta" className="">
                  Tipo de Pregunta? <span className="text-red-600">(*)</span>
                </Label>
                <Select
                  id="TipoPregrunta?"
                  value={InputValues?.TipoPregunta}
                  required
                  onValueChange={(e) => {
                    setInputValues({
                      ...InputValues,
                      TipoPregunta: e,
                    });
                  }}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Tipo de Pregrunta?" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      // esAdicional
                      { label: "Seleccion" },
                      { label: "Seleccion Multiple" },
                    ].map((adi, key) => (
                      <SelectItem key={adi.label} value={adi.label}>
                        {adi.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="Obligatoria" className="">
                  Es obligatoria u opcional?{" "}
                  <span className="text-red-600">(*)</span>
                </Label>
                <Select
                  id="Obligatoria ?"
                  value={InputValues?.Obligatoria}
                  required
                  onValueChange={(e) => {
                    setInputValues({
                      ...InputValues,
                      Obligatoria: e,
                    });
                  }}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Obligatirio u opcional" />
                  </SelectTrigger>
                  <SelectContent>
                    {[{ label: "Opcional" }, { label: "Obligatorio" }].map(
                      (adi, key) => (
                        <SelectItem key={adi.label} value={adi.label}>
                          {adi.label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>

                <div className="w-full mx-auto">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold">Opciones </h1>
                    <div className="mt-4 flex">
                      <input
                        className="w-80 border-b-2 border-gray-500 text-black px-2"
                        type="text"
                        placeholder="Ingresa la opción ?"
                        onChange={(e) => {
                          setInputValues({
                            ...InputValues,
                            TextoOpcion: e.target.value,
                          });
                        }}
                        value={InputValues?.TextoOpcion}
                      />
                      <button
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          if (!InputValues?.TextoOpcion) return;

                          setInputValues({
                            ...InputValues,
                            Opciones: [
                              ...(InputValues?.Opciones || []),
                              InputValues?.TextoOpcion,
                            ],
                            TextoOpcion: "",
                          });
                        }}
                        className="ml-2 border-2 border-green-500 p-2 text-green-500 hover:text-white hover:bg-green-500 rounded-lg flex"
                      >
                        <svg
                          className="h-6 w-6"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {" "}
                          <path stroke="none" d="M0 0h24v24H0z" />{" "}
                          <circle cx={12} cy={12} r={9} />{" "}
                          <line x1={9} y1={12} x2={15} y2={12} />{" "}
                          <line x1={12} y1={9} x2={12} y2={15} />
                        </svg>
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                  <div className="mt-8">
                    <ul>
                      {InputValues?.Opciones?.map((opcion, key) => (
                        <li className="p-2 rounded-lg">
                          <div className="flex align-middle flex-row justify-between">
                            <div className="p-2">
                              <p className="text-lg text-black">{opcion}</p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setInputValues({
                                  ...InputValues,
                                  Opciones: InputValues?.Opciones.filter(
                                    (item, index) => index !== key
                                  ),
                                });
                              }}
                              className="flex text-red-500 border-2 border-red-500 p-2 rounded-lg"
                            >
                              <svg
                                className="h-6 w-6 text-red-500"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                {" "}
                                <circle cx={12} cy={12} r={10} />{" "}
                                <line x1={15} y1={9} x2={9} y2={15} />{" "}
                                <line x1={9} y1={9} x2={15} y2={15} />
                              </svg>
                              <span>Remove</span>
                            </button>
                          </div>
                          <hr className="mt-2" />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-gray-400 rounded-md p-3 space-y-1 ">
              {ListaPreguntas?.map((pregunta, key) => (
                <div key={pregunta.id} className=" ">
                  <h1 className="text-lg font-bold">
                    {pregunta?.Pregunta}{" "}
                    {pregunta?.Obligatoria == "Obligatorio" ? (
                      <span className="font-normal text-red-700">
                        Obligatorio (*){" "}
                      </span>
                    ) : (
                      ""
                    )}
                  </h1>

                  {pregunta?.TipoPregunta == "Seleccion" ? (
                    <div>
                      {pregunta?.Opciones?.map((option) => (
                        <div className="space-x-1" key={option?.id}>
                          <input
                            type="radio"
                            id={`radio-${option?.id}`}
                            name={`seleccion-${pregunta?.id}`} // Asegúrate de que cada grupo de preguntas tenga un nombre único
                            value={option?.valor} // Asigna el valor correspondiente
                          />
                          <label htmlFor={`radio-${option?.id}`}>
                            {option}
                          </label>{" "}
                        </div>
                      ))}
                    </div>
                  ) : (
                    pregunta?.TipoPregunta == "Seleccion Multiple" && (
                      <div>
                        {pregunta?.Opciones?.map((option) => (
                          <div key={option?.id} className="space-x-1">
                            <input
                              type="checkbox"
                              id={`checkbox-${option?.id}`}
                              name={`seleccionMultiple-${pregunta?.id}`}
                              value={option?.valor}
                            />
                            <label htmlFor={`checkbox-${option?.id}`}>
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                  <div className="flex justify-center items-center gap-2 pb-1">
                    <Button
                      className="p-1 h-6 bg-red-600"
                      title="Eliminar pregunta"
                      onClick={async (e) => {
                        e.preventDefault();

                        if (confirm("¿Estás seguro de eliminar la pregunta?")) {
                          await deleteDoc(
                            doc(
                              db,
                              `Productos`,
                              `${ModalQuestion?.Producto?.id}`,
                              "OpcionesPersonalizables",
                              `${pregunta.id}`
                            )
                          );
                        }
                      }}
                    >
                      <XIcon className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        setInputValues(pregunta);
                      }}
                      className="p-1 h-6"
                      title="Editar Pregunta"
                    >
                      <Pencil className="w-5 h-5" />
                    </Button>
                  </div>
                  <hr />
                </div>
              ))}
            </div>
          </div>
          <Button
            disabled={Loading}
            className="   disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
          >
            Guardar{" "}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalPreguntas;
