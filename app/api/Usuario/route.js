import { NextResponse } from "next/server";
import { AuthAdmin, dbAdmin, timeAdmin } from "@/firebase/firebaseAdmin.js";

export async function POST(req) {
  try {
    const { NombreCompleto, Correo, Pass, Rol, IdRestaurante } =
      await req?.json();

    let InfoAdd = {
      email: Correo,
      emailVerified: false,
      displayName: NombreCompleto?.toUpperCase() || "",
      disabled: false,
      Rol: Rol,
    };

    let ListClaim = {
      Rol: Rol,
    };
    if (IdRestaurante) {
      InfoAdd.IdRestaurante = IdRestaurante;
      ListClaim.IdRestaurante = IdRestaurante;
    }

    const CreateUser = await AuthAdmin.createUser({
      ...InfoAdd,
      password: Pass,
    });
    await dbAdmin
      .collection("Usuarios")
      .doc(`${CreateUser.uid}`)
      .set({
        ...InfoAdd,
        createdAt: timeAdmin,
      });

    const AddClaim = await AuthAdmin.setCustomUserClaims(
      CreateUser.uid,
      ListClaim
    );

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

export async function GET(req) {
  const listAllUsers = async (nextPageToken) => {
    try {
      // List batch of users, 1000 at a time.
      const listUsersResult = await AuthAdmin.listUsers(1000, nextPageToken);
      let users = listUsersResult.users.map((userRecord) =>
        userRecord.toJSON()
      );

      if (listUsersResult.pageToken) {
        // List next batch of users.
        return users.concat(await listAllUsers(listUsersResult.pageToken));
      } else {
        return users;
      }
    } catch (error) {
      console.log("Error listing users:", error);
      throw error; // Re-throw the error to be caught by the calling function
    }
  };

  try {
    // Start listing users from the beginning, 1000 at a time.
    const usuarios = await listAllUsers();

    return NextResponse.json(
      {
        usuarios,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message: "Error al obtener la lista de usuarios",
        },
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams?.get("uid");
  console.log("uid", uid);

  try {
    if (!uid) {
      return NextResponse.json(
        { body: "No se proporcionó un ID de usuario para eliminar." },
        { status: 400 }
      );
    }

    // Eliminar usuario de la autenticación
    await AuthAdmin.deleteUser(uid);

    // Eliminar usuario de la colección "Usuarios"
    await dbAdmin.collection("Usuarios").doc(uid).delete();

    return NextResponse.json(
      { body: "Usuario eliminado correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return NextResponse.json(
      { body: "Se produjo un error interno al intentar eliminar el usuario." },
      { status: 500 }
    );
  }
}
export async function PUT(req) {
  try {
    const {
      NombreCompleto,
      Correo,
      Pass,
      uid,
      Habilitar,
      Inhabilitar,
      IdRestaurante,
    } = await req?.json();

    let InfoEditar = {};

    if (Habilitar) {
      InfoEditar.disabled = false;
    } else if (Inhabilitar) {
      InfoEditar.disabled = true;
    }

    if (IdRestaurante) {
      InfoEditar.IdRestaurante = IdRestaurante;
    }

    if (NombreCompleto) {
      InfoEditar.displayName = NombreCompleto;
    } else if (Correo) {
      InfoEditar.email = Correo;
    } else if (Pass) {
      InfoEditar.password = Pass;
    }

    if (Object.keys(InfoEditar).length) {
      await AuthAdmin.updateUser(uid, InfoEditar);

      await dbAdmin.collection("Usuarios").doc(`${uid}`).update(InfoEditar);

      return NextResponse.json(
        { body: "Usuario editado correctamente" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { body: "No se editó información" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error);
    if (error.code) {
      return NextResponse.json({ body: error.message }, { status: 400 });
    } else {
      return NextResponse.json(
        {
          body: "Se produjo un error interno al intentar editar el usuario.",
          error: error,
        },
        { status: 500 }
      );
    }
  }
}
