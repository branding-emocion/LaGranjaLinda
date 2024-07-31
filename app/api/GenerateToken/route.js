import Culqi from "culqi-node";
import { NextResponse } from "next/server";

const culqi = new Culqi({
  privateKey: "sk_test_3b0ad397967347bb",
  pciCompliant: true,
  publicKey: "pk_test_8e2337ddca04e42e",
});

export async function POST(req) {
  try {
    const { amount, currency_code, mail, payment_method } = await req?.json();

    const res = culqi.tokens.createToken({
      amount: Math.round(300 * 100), // Convert to cents
      currency: "PEN",
      email: "jhonned01@gmail.com", // Replace with user's email
      metadata: {
        payment_method: "yape",
      },
    });

    const response = await fetch("https://api.culqi.com/v2/tokens", {
      method: "POST",
      headers: {
        Authorization: `Bearer pk_test_8e2337ddca04e42e`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(300 * 100), // Convert to cents
        currency: "PEN",
        email: "jhonned01@gmail.com", // Replace with user's email
        metadata: {
          payment_method: "yape",
        },
      }),
    });

    const data = await response.json();

    console.log("Data", data);

    return NextResponse.json(
      {
        body: "Agregado correctamente",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("error", error);
    if (error.code === "auth/email-already-exists") {
      return NextResponse.json(
        {
          error: {
            message: "El correo electrónico ya está en uso",
          },
        },
        {
          status: 409,
        }
      );
    } else if (error.code === "auth/invalid-email") {
      return NextResponse.json(
        {
          error: {
            message: "El formato del correo electrónico es inválido",
          },
        },
        {
          status: 400,
        }
      );
    } else if (error.code === "auth/weak-password") {
      return NextResponse.json(
        {
          error: {
            message: "La contraseña es débil. Debe tener al menos 6 caracteres",
          },
        },
        {
          status: 400,
        }
      );
    } else if (error.code === "auth/invalid-phone-number") {
      return NextResponse.json(
        {
          error: {
            message: "El formato del número de teléfono es inválido",
          },
        },
        {
          status: 400,
        }
      );
    } else {
      return NextResponse.json(
        {
          error: { ...error },
        },
        {
          status: 500,
        }
      );
    }
  }
}
