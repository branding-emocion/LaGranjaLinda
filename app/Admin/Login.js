"use client";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "@/firebase/firebaseClient";
import Link from "next/link";

const Login = () => {
  const [InputValue, setInputValue] = useState({});
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
          alert("Usuario a contraseña incorrectos");
        } else {
          alert("Error al intentar ingresar al sistema ");
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
    <div>
      <div className=" absolute top-0 left-0 bg-gradient-to-b from-gray-600  to-lagranja bottom-0 leading-5 h-full w-full overflow-hidden"></div>
      <div className="relative   min-h-screen  sm:flex sm:flex-row  justify-center bg-transparent rounded-3xl shadow-xl">
        <div className="flex justify-center self-center  z-10">
          <form
            onSubmit={onSubmit}
            className="p-12 bg-white mx-auto rounded-3xl w-96 "
          >
            <div className="mb-7">
              <h3 className="font-semibold text-2xl text-gray-800">
                Iniciar sesión{" "}
              </h3>
            </div>
            <div className="space-y-6">
              <div className>
                <input
                  className=" w-full text-sm  px-4 py-3 bg-gray-200 focus:bg-gray-100 border  border-gray-200 rounded-lg focus:outline-none focus:border-lagranja"
                  type="email"
                  placeholder="Email"
                  onChange={handlerChange}
                  name="Usuario"
                  required
                />
              </div>
              <div>
                <input
                  onChange={handlerChange}
                  type="password"
                  placeholder="Password"
                  className="text-sm text-gray-800 px-4 py-3 rounded-lg w-full bg-gray-200 focus:bg-gray-100 border border-gray-200 focus:outline-none focus:border-lagranja"
                  name="Password"
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center bg-lagranja  hover:bg-[#131b2c] text-gray-100 p-3  rounded-lg tracking-wide font-semibold  cursor-pointer transition ease-in duration-500"
                >
                  Iniciar sesión{" "}
                </button>
              </div>
            </div>
            <div className="mt-7 text-center  text-xs">
              <span>
                Copyright © {new Date().getFullYear()}-
                {new Date().getFullYear() + 1}{" "}
                <Link className="text-lagranja " href="/">
                  la granja linda
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
