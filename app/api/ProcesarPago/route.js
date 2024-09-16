import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { TotalValue, user, settings, token } = await req.json();

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
        amount: Math.round(TotalValue * 100), // Monto en centavos
        currency_code: "PEN",
        description: "Pago La granja Linda",
        email: user.email,
        capture: true,
        source_id: token, // Usar el token generado aquí
        installments: settings?.installments || 1, // Opcional, establecer cuotas si están habilitadas
      }),
    });

    const data = await response.json();
    console.log(data);

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
