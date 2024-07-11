const groupBySKU = (products) => {
  return products.reduce((acc, el) => {
    const sku = el?.id;

    if (!acc[sku]) {
      acc[sku] = [];
    }

    acc[sku].push(el); // Modificar para solo acc[sku].push(el);

    return acc; // Devolver el acumulador completo en lugar del resultado de push
  }, {});
};

export default groupBySKU;
