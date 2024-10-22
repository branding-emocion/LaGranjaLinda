"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Escribenos = () => {
  const [activeTab, setActiveTab] = useState("contact");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted for:", activeTab);
  };

  const commonFields = (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Nombres</Label>
        <Input id="name" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input id="email" type="email" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input id="phone" type="tel" required />
      </div>
    </>
  );

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto mt-10 mb-28">
        <CardHeader>
          <CardTitle>CONTÁCTANOS</CardTitle>
          <CardDescription>A brasa lo nuestro</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="contact">Contacto General</TabsTrigger>
              <TabsTrigger value="job">Trabaja con Nosotros</TabsTrigger>
            </TabsList>
            <TabsContent value="contact">
              <form onSubmit={handleSubmit} className="space-y-4">
                {commonFields}

                <div className="space-y-2">
                  <Label htmlFor="message">Su mensaje</Label>
                  <Textarea id="message" required />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-sm">
                    He leído y acepto los Términos y Condiciones y Políticas de
                    Privacidad
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="promotions" />
                  <Label htmlFor="promotions" className="text-sm">
                    Acepto el envío de Cortesías, Ofertas, Promociones y otros
                    fines
                  </Label>
                </div>

                <Button type="submit" className="w-full">
                  Enviar Mensaje
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="job">
              <form onSubmit={handleSubmit} className="space-y-4">
                {commonFields}

                <div className="space-y-2">
                  <Label htmlFor="cv">Hoja de Vida (CV)</Label>
                  <Input
                    id="cv"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Carta de Presentación</Label>
                  <Textarea id="coverLetter" required />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="jobTerms" required />
                  <Label htmlFor="jobTerms" className="text-sm">
                    He leído y acepto los Términos y Condiciones y Políticas de
                    Privacidad
                  </Label>
                </div>

                <Button type="submit" className="w-full">
                  Enviar
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
};

export default Escribenos;
