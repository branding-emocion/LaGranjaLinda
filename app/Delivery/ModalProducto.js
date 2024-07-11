import AddToCart from "@/components/AddToCart";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { useState } from "react";

const ModalProduct = ({ OpenModal, setOpenModal, name }) => {
  const [InputValues, setInputValues] = useState({});
  const { toast } = useToast();

  const closeOpenModal = () => {
    setOpenModal({
      Visible: false,
      Product: {},
    });
    setInputValues({});
  };
  const HandlerChange = (e) => {
    setInputValues({
      ...InputValues,
      [e.target.name]: e.target.value,
    });
  };
  console.log(OpenModal);

  return (
    <Dialog open={OpenModal?.Visible} onOpenChange={closeOpenModal}>
      <DialogContent className="h-auto  w-[90%] md:w-full max-h-[95vh] overflow-auto   sm:max-w-4xl">
        <DialogHeader className="w-full h-full">
          <DialogTitle>Descripción del producto</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div
          className="  flex  w-full h-full overflow-auto gap-2  gap-x-4  
border rounded-md p-5 "
        >
          <section className="relative w-full h-[400px] aspect-square">
            <Image
              className="rounded-t-lg "
              fill
              src={OpenModal?.Product?.Imagenes[0] || ""}
              alt={OpenModal?.Product?.NombreProducto}
              style={{
                objectFit: "cover",
              }}
            />
          </section>
          <div className=" w-full h-full  space-y-5 ">
            <div className="space-y-2">
              <h1>{OpenModal?.Product?.NombreProducto}</h1>
              <div className=" space-x-2">
                <Badge variant="outline" className="uppercase">
                  {name}
                </Badge>
              </div>
              <p>{OpenModal?.Product?.Descripcion}</p>
            </div>

            <p className="text-2xl font-bold mt-2">
              S/ {OpenModal?.Product?.Precio}
            </p>

            <AddToCart product={OpenModal?.Product} />

            <h1 />

            {/* <h3 className="font-bold text-xl pt-10 "> Specifications</h3> */}

            {/* <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="">Specification</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Product?.specifications?.map((spec) => (
                  <TableRow key={spec.key}>
                    <TableCell className="font-medium">{spec.key}</TableCell>
                    <TableCell>{spec.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalProduct;
