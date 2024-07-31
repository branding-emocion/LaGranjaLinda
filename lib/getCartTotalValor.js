export function getCartTotalValor(products) {
  const total = products.reduce(
    (acc, el) => acc + parseFloat(el?.Precio) || 0,
    0
  );

  return parseFloat(total.toFixed(2));
}
