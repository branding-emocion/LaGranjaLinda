"use client";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import { auth, db, googleProvider } from "@/firebase/firebaseClient";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ModalCreateUsuario from "./ModaCreateUsuario";
import { useToast } from "@/components/ui/use-toast";
import ModalRecoveryPass from "./ModalRecoveryPass";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const Login = () => {
  const [InputValue, setInputValue] = useState({});
  const [ModalNewUser, setModalNewUser] = useState(false);
  const [OpenModalReset, setOpenModalReset] = useState(false);
  const { toast } = useToast();

  const onSubmit = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, InputValue?.Usuario, InputValue?.Password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log("error", error);

        if (
          errorCode === "auth/invalid-email" ||
          errorCode === "auth/wrong-password" ||
          errorCode === "auth/invalid-credential"
        ) {
          toast({
            title: "Inicio de sesión",
            description: "Usuario o contraseña incorrectos",
          });
        } else if (errorCode === "auth/user-disabled") {
          toast({
            title: "Cuenta deshabilitada",
            description: "La cuenta de usuario ha sido deshabilitada",
          });
        } else {
          toast({
            title: "Error",
            description: "Error al intentar ingresar al sistema",
          });
        }
      });
  };

  const handlerChange = (e) => {
    setInputValue({
      ...InputValue,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <main className="bg-white ">
      {ModalNewUser && (
        <ModalCreateUsuario
          ModalNewUser={ModalNewUser}
          setModalNewUser={setModalNewUser}
        />
      )}

      {OpenModalReset && (
        <ModalRecoveryPass
          OpenModalReset={OpenModalReset}
          setOpenModalReset={setOpenModalReset}
        />
      )}
      <div className="flex justify-center h-screen">
        <div
          className="hidden bg-cover lg:block lg:w-2/3"
          style={{
            backgroundImage: "url(/BannerLogin.webp)",
          }}
        >
          <div className="flex items-center h-full px-20 bg-gray-900/30">
            {/* <div>
              <h2 className="text-4xl font-bold text-white uppercase">
                La Granja Linda
              </h2>
              <p className="max-w-xl mt-3 text-white font-bold">
                Bienvenidos a La Granja Linda, donde cada comida es una
                celebración en familia. Disfruta de nuestros platillos caseros
                preparados con amor y dedicación, en un ambiente acogedor y
                familiar.
              </p>
            </div> */}
          </div>
        </div>
        <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
          <div className="flex-1  ">
            <div className="text-center">
              <span className=" my-2 md:w-full md:h-full md:flex md:justify-center  md:mx-auto mr-2 rounded-md overflow-hidden">
                <Image
                  src={`/GranjaCompleto.webp`}
                  width={250}
                  height={250}
                  alt="Inicio"
                  title="Logo principal"
                  style={{
                    objectFit: "cover",
                  }}
                />
              </span>
              {/* <h2 className="text-3xñ sm:text-4xl font-bold text-center text-gray-900 ">
                ¡ Bienvenido !
              </h2> */}
              <p className="mt-3 text-gray-700 ">
                Inicia sesión para acceder a tu cuenta{" "}
              </p>
            </div>
            <div className="mt-4">
              <form onSubmit={onSubmit}>
                <div>
                  <label
                    htmlFor="Correo"
                    className="block mb-2 text-sm text-gray-700 "
                  >
                    Correo
                  </label>
                  <input
                    autoComplete="off"
                    onChange={handlerChange}
                    type="email"
                    name="Usuario"
                    id="Correo"
                    placeholder="example@example.com"
                    className="block w-full px-4 py-2 mt-2 text-gray-900 placeholder-gray-400 bg-white border border-gray-200 rounded-md   focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    autoFocus
                    required
                  />
                </div>

                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <label
                      htmlFor="Password"
                      className="text-sm text-gray-700 "
                    >
                      Contraseña
                    </label>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenModalReset(true);
                      }}
                      className="text-sm text-gray-600 focus:text-[#7d2d04] hover:text-[#7d2d04] hover:underline"
                    >
                      Olvido su contraseña?
                    </div>
                  </div>
                  <input
                    autoComplete="off"
                    onChange={handlerChange}
                    type="password"
                    name="Password"
                    id="Password"
                    placeholder="Tu Contraseña"
                    className="block w-full px-4 py-2 mt-2 text-gray-900 placeholder-gray-400 bg-white border border-gray-200 rounded-md   focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    pattern=".{6,}"
                    title="6 caracteres mínimo"
                    required
                  />
                </div>
                <div className="mt-8">
                  <Button
                    type="submit"
                    className=" bg-[#7d2d04] w-full hover:opacity-90"
                  >
                    Ingresar{" "}
                  </Button>
                  <div>
                    <hr className="my-6 border-gray-300 w-full" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();

                        signInWithPopup(auth, googleProvider)
                          .then(async (result) => {
                            console.log("result", result);

                            const user = result.user;

                            console.log("user", user);
                            // setDoc
                            await setDoc(doc(db, "Usuarios", user.uid), {
                              uid: user.uid,
                              email: user.email,
                              displayName: user.displayName,
                              photoURL: user.photoURL,
                              lastLogin: serverTimestamp(),
                              Rol: "Cliente",
                            });

                            // IdP data available using getAdditionalUserInfo(result)
                            // ...
                          })
                          .catch((error) => {
                            // Handle Errors here.
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            console.log("error", error);

                            // ...
                          });
                      }}
                      className="w-full block bg-white hover:bg-gray-100 focus:bg-gray-100 text-gray-900 font-semibold rounded-lg px-4 py-3 border border-gray-300 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          className="w-6 h-6"
                          viewBox="0 0 48 48"
                        >
                          <defs>
                            <path
                              id="a"
                              d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                            />
                          </defs>
                          <clipPath id="b">
                            <use xlinkHref="#a" overflow="visible" />
                          </clipPath>
                          <path
                            clipPath="url(#b)"
                            fill="#FBBC05"
                            d="M0 37V11l17 13z"
                          />
                          <path
                            clipPath="url(#b)"
                            fill="#EA4335"
                            d="M0 11l17 13 7-6.1L48 14V0H0z"
                          />
                          <path
                            clipPath="url(#b)"
                            fill="#34A853"
                            d="M0 37l30-23 7.9 1L48 0v48H0z"
                          />
                          <path
                            clipPath="url(#b)"
                            fill="#4285F4"
                            d="M48 48L17 24l-4-3 35-10z"
                          />
                        </svg>
                        <span className="ml-4">Log in with Google</span>
                      </div>
                    </button>
                  </div>
                </div>
              </form>
              <p className="mt-2 mb-2 text-sm text-center text-gray-700">
                ¿Aún no tienes una cuenta?{" "}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setModalNewUser(true);
                  }}
                  className="text-[#7d2d04] focus:outline-none focus:underline hover:underline"
                >
                  Regístrese
                </button>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
