import React from "react";
import Title from "../Title";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Nutricion = () => {
  return (
    <div className="  bg-[#eaeaea]  mb-10">
      <Title title={"Valores Nutricionales"} image="/One.webp" />

      <div className="container mx-auto ">
        <div className=" flex justify-center items-center  p-1 lg:p-10 gap-x-10">
          <div className="s  bg-white p-5 md:p-10 rounded-lg ">
            <div className=" flex flex-col items-center  space-y-7 ">
              <p className="text-justify">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consectetur sint fugiat deleniti fugit tenetur necessitatibus
                voluptatum impedit odit aliquid aliquam numquam, molestiae
                consequuntur harum officia sequi sed dolores nulla esse.
              </p>

              <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">Nombre</TableHead>
                    <TableHead>Calorías Totales (KCAL)</TableHead>
                    <TableHead>Carbohidratos (GR)</TableHead>
                    <TableHead className="text-right">Proteínas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">INV001</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nutricion;
