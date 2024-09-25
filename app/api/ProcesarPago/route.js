import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { TotalValue, user, settings, culquiToken, Direccion, Celular } =
      await req.json();

    const nameParts = user?.displayName?.split(" ") || [];

    // Asignar el primer valor como el primer nombre y el resto como el apellido
    const FirsName = nameParts[0] || "";
    const LastName = nameParts.slice(1).join(" ") || "";

    const InfoEnviarPago = {
      amount: TotalValue, // Monto en centavos
      currency_code: "PEN",
      email: user?.email,
      source_id: culquiToken, // Usar el token generado aquí
      capture: true,
      description: "Pago La granja Linda",
      installments: 1, // Opcional
      antifraud_details: {
        address: Direccion || "La Granja Linda",
        address_city: "Lima",
        country_code: "PE",
        first_name: FirsName || user?.displayName || "", // Asegúrate de que estos campos existan en el objeto user
        last_name: LastName || "",
        phone_number: Celular || "310403",
      },
      // authentication_3DS: {
      //   xid: "Y2FyZGluYWxjb21tZXJjZWF1dGg=",
      //   cavv: "AAABAWFlmQAAAABjRWWZEEFgFz+=",
      //   directoryServerTransactionId: "88debec7-a798-46d1-bcfb-db3075fedb82",
      //   eci: "06",
      //   protocolVersion: "2.1.0",
      // },
    };

    // Validar que se tengan los datos necesarios
    if (!TotalValue || !user?.email || !culquiToken) {
      return NextResponse.json(
        { error: { message: "Faltan datos necesarios para procesar el pago" } },
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
      body: JSON.stringify(InfoEnviarPago),
    });

    const data = await response.json();
    console.log("data", data);

    if ((data.type = "card_error" || data?.object == "error")) {
      return NextResponse.json(
        { error: { message: data?.merchant_message } },
        { status: 400 }
      );
    }

    if (data.type == "charge") {
      return NextResponse.json(
        { message: "Pago realizado correctamente", infoPago: data },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: { message: "Internal Server Error", details: error.message } },
      { status: 500 }
    );
  }
}
