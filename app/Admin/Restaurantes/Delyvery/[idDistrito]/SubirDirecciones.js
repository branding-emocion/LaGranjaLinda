"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import * as XLSX from "xlsx";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";

const SubirDirecciones = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setResult(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target?.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      let successCount = 0;
      let failedCount = 0;

      for (let i = 0; i < json.length; i++) {
        const row = json[i];
        try {
          await addDoc(collection(db, "DireccionesDelivery"), {
            NombreUbicacion: row.Destino,
            ValorDomicilio: row.Precio,
            idDistrito: "BEA2n8WQwNRDOQFxMVBS",
          });
          successCount++;
        } catch (error) {
          console.error("Error adding document: ", error);
          failedCount++;
        }
        setProgress(((i + 1) / json.length) * 100);
      }

      setResult({ success: successCount, failed: failedCount });
      setUploading(false);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4">Carga de Excel a Firestore</h1>
      <Input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="mb-4"
      />
      <Button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full mb-4"
      >
        {uploading ? "Subiendo..." : "Subir a Firestore"}
      </Button>
      {uploading && <Progress value={progress} className="w-full mb-4" />}
      {result && (
        <Alert>
          <AlertTitle>Carga completada</AlertTitle>
          <AlertDescription>
            Se subieron exitosamente {result.success} registros.
            {result.failed > 0 && ` Fallaron ${result.failed} registros.`}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SubirDirecciones;
