import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { TotalValue, user, settings, token, Direccion, Celular } =
      await req.json();

    console.log("TotalValue", TotalValue);
    console.log("user", user);
    console.log("settings", settings);
    console.log("token", token);
    console.log("Direccion", Direccion);
    console.log("Celular", Celular);

    // Validar que se tengan los datos necesarios
    if (!TotalValue || !user?.email || !token) {
      return NextResponse.json(
        { error: "Faltan datos necesarios para procesar el pago" },
        { status: 400 }
      );
    }

    // Iniciar el proceso de pago con la API de Culqi
    const response = await fetch("https://api.culqi.com/v2/charges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer sk_live_XnXkdI1L3dKfd3zY`,
      },
      body: JSON.stringify({
        amount: TotalValue, // Monto en centavos
        currency_code: "PEN",
        email: user?.email,
        source_id: token, // Usar el token generado aquí
        capture: true,
        description: "Pago La granja Linda",
        installments: 1, // Opcional
        antifraud_details: {
          address: Direccion || "La Granja Linda",
          address_city: "Lima",
          country_code: "PE",
          first_name: user?.displayName || "", // Asegúrate de que estos campos existan en el objeto user
          last_name: user?.displayName || "",
          phone_number: Celular || "310403",
        },
        authentication_3DS: {
          xid: "Y2FyZGluYWxjb21tZXJjZWF1dGg=",
          cavv: "AAABAWFlmQAAAABjRWWZEEFgFz+=",
          directoryServerTransactionId: "88debec7-a798-46d1-bcfb-db3075fedb82",
          eci: "06",
          protocolVersion: "2.1.0",
        },
      }),
    });

    const data = await response.json();

    if ((data.type = "card_error" || data.object)) {
      return NextResponse.json(
        { error: { message: data.merchant_message } },
        { status: 400 }
      );
    }
    console.log("data", data);

    return NextResponse.json(
      { message: "Pago realizado correctamente", infoPago: data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: { message: "Internal Server Error", details: error.message } },
      { status: 500 }
    );
  }
}
