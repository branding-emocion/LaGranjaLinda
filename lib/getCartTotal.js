export function getCartTotal(products) {
  const total = products.reduce(
    (acc, el) => acc + parseFloat(el?.Precio) || 0,
    0
  );
  console.log("total", total);

  return `S/ ${total.toFixed(2)}`;
}
