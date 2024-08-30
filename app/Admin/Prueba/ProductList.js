"use client";

import React from "react";
import { useDrag, useDrop } from "react-dnd";

const ItemType = "PRODUCT";

const DraggableProduct = ({ product, index, moveProduct }) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveProduct(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: "16px",
        marginBottom: "8px",
        backgroundColor: "white",
        border: "1px solid #ccc",
        cursor: "move",
        color: "#000",
      }}
    >
      {product.NombreCategoria}
    </div>
  );
};

const ProductList = ({ products, setProducts }) => {
  const moveProduct = (fromIndex, toIndex) => {
    const updatedProducts = [...products];
    const [movedProduct] = updatedProducts.splice(fromIndex, 1);
    updatedProducts.splice(toIndex, 0, movedProduct);
    setProducts(updatedProducts);
  };

  return (
    <div>
      {products.map((product, index) => (
        <DraggableProduct
          key={product.id}
          index={index}
          product={product}
          moveProduct={moveProduct}
        />
      ))}
    </div>
  );
};

export default ProductList;
