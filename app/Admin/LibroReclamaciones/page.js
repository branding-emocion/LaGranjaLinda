import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BadgePlus } from "lucide-react";
import React from "react";

const LibroReclamaciones = () => {
  const [Reclamos, setReclamos] = useState([]);

  useEffect(() => {
    onSnapshot(
      collection(db, `Reclamos`),
      // orderBy("email", "asc"),
      (snapshot) =>
        setReclamos(
          snapshot?.docs?.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
    );
  }, []);

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Bienvenido al módulo de Categorias</CardTitle>

          <CardDescription>
            En esta sección, puedes ver y modificar los Categorias .
          </CardDescription>
          <div>
            <Button
              title="Agregar nueva Categoria"
              onClick={(e) => {
                e.preventDefault();
                console.log(e);
                setOpenModal({
                  Visible: true,
                  InfoEditar: {},
                });
              }}
              className="space-x-2"
            >
              <BadgePlus />
              <p>Agregar nueva </p>
            </Button>
          </div>
        </CardHeader>
      </Card>
      {Reclamos.map((reclamo) => (
        <></>
      ))}
    </div>
  );
};

export default LibroReclamaciones;
