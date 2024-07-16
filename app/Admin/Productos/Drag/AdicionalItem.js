// src/components/AdicionalItem.js
import { useDrag } from "react-dnd";

const AdicionalItem = ({ adicional }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "adicional",
    item: adicional,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-2 border rounded mb-2 ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {adicional.NombreProducto}
    </div>
  );
};

export default AdicionalItem;
