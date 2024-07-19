import { useDrop } from "react-dnd";
import { useState, useEffect } from "react";
import AdicionalItem from "./AdicionalItem";
import { Button } from "@/components/ui/button";

const Product = ({
  product,
  adicionales,
  selectedAdicionales,
  setSelectedAdicionales,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAdicionales, setFilteredAdicionales] = useState(adicionales);

  useEffect(() => {
    setFilteredAdicionales(
      adicionales.filter(
        (adicional) =>
          !selectedAdicionales.some((selected) => selected.id === adicional.id)
      )
    );
  }, [adicionales, selectedAdicionales]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "adicional",
    drop: (item) => addAdicional(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const addAdicional = (adicional) => {
    // Verificar si el adicional ya está en selectedAdicionales
    if (!selectedAdicionales.some((item) => item.id === adicional.id)) {
      setSelectedAdicionales((prev) => [...prev, adicional]);
      setFilteredAdicionales((prev) =>
        prev.filter((item) => item.id !== adicional.id)
      );
    }
  };

  const removeAdicional = (adicional) => {
    setSelectedAdicionales((prev) =>
      prev.filter((item) => item.id !== adicional.id)
    );
    setFilteredAdicionales((prev) => [...prev, adicional]);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredAdicionales(
      adicionales.filter(
        (adicional) =>
          adicional.NombreProducto.toLowerCase().includes(term) &&
          !selectedAdicionales.some((selected) => selected.id === adicional.id)
      )
    );
  };

  return (
    <div className="p-4 border rounded">
      <h1 className="text-xl font-bold mb-4">{product.nombre}</h1>
      <div className="p-4 border rounded mb-4" ref={drop}>
        <h1 className="font-semibold">Adicionales seleccionados:</h1>
        {selectedAdicionales.map((adicional) => (
          <div
            key={adicional.id}
            className="flex items-center justify-between p-2 border rounded mb-2"
          >
            <span>{adicional.NombreProducto}</span>
            <button
              className="ml-2 text-red-500"
              onClick={() => removeAdicional(adicional)}
            >
              Eliminar
            </button>
          </div>
        ))}
        {isOver && <div className="p-4 bg-green-100">Suelta aquí</div>}
      </div>
      <div className="max-h-[530px] overflow-auto">
        <h1 className="font-semibold">Lista de adicionales:</h1>
        <input
          type="text"
          placeholder="Buscar adicional..."
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 border rounded mb-4 w-full"
        />
        {filteredAdicionales.map((adicional) => (
          <AdicionalItem key={adicional.id} adicional={adicional} />
        ))}
      </div>
    </div>
  );
};

export default Product;
