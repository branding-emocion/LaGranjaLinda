import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";

// Desactivar SSR para PDFViewer

// Estilos mejorados para una apariencia tipo Excel
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderCollapse: "collapse",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderBottomWidth: 1,
  },
  tableRowAlt: {
    backgroundColor: "#f9f9f9",
  },
  tableCol: {
    width: "15%", // Ajustado para ancho proporcional
    padding: 8,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    textAlign: "center",
    wordWrap: "break-word", // Permite el ajuste de texto
  },
  tableColEmail: {
    width: "25%", // Más espacio para la columna del correo
    padding: 8,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    textAlign: "center",
    wordWrap: "break-word", // Permite el ajuste de texto
  },
  tableCell: {
    fontSize: 10, // Reducción del tamaño de la fuente
  },
  tableHeaderCell: {
    fontWeight: "bold",
    fontSize: 12,
  },
  totalRow: {
    fontWeight: "bold",
    backgroundColor: "#e0e0e0",
  },
});

// Formateo de moneda
const formatCurrency = (value) =>
  value ? `S/ ${value.toFixed(2)}` : "S/ 0.00";

const ReporteClientesPDF = ({ Orders, RangesData }) => {
  const totalGeneral = Object.keys(Orders).reduce((acc, order) => {
    const totalValue = Orders[order].orders?.reduce(
      (total, el) => total + (el.TotalValue || 0),
      0
    );
    return acc + totalValue;
  }, 0);
  return (
    <PDFViewer style={{ width: "100%", height: "600px" }}>
      <Document>
        <Page style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.title}>Reporte de Compras por Usuario</Text>
            <Text style={styles.subtitle}>
              Fecha de inicio:{" "}
              {RangesData?.startDate
                ? new Date(RangesData.startDate).toLocaleDateString()
                : "N/A"}{" "}
              - Fecha de fin:{" "}
              {RangesData?.endDate
                ? new Date(RangesData.endDate).toLocaleDateString()
                : "N/A"}
            </Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <View style={styles.tableCol}>
                  <Text style={[styles.tableCell, styles.tableHeaderCell]}>
                    Nombre Completo
                  </Text>
                </View>
                <View style={styles.tableColEmail}>
                  <Text style={[styles.tableCell, styles.tableHeaderCell]}>
                    Correo
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={[styles.tableCell, styles.tableHeaderCell]}>
                    Teléfono
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={[styles.tableCell, styles.tableHeaderCell]}>
                    Cantidad de Compras
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={[styles.tableCell, styles.tableHeaderCell]}>
                    Cantidad de Productos
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={[styles.tableCell, styles.tableHeaderCell]}>
                    Valor Total
                  </Text>
                </View>
              </View>

              {Object.keys(Orders).map((order, index) => {
                const totalValue = Orders[order].orders?.reduce(
                  (acc, el) => acc + (el.TotalValue || 0),
                  0
                );

                let cantidadProductos = 0;
                Orders[order]?.orders?.forEach((item) => {
                  cantidadProductos += item?.cart?.length || 0;
                });

                const NumeroCelular = Orders[order]?.orders?.find(
                  (item) => item?.Celular?.length > 0
                );
                console.log("NumeroCelular", NumeroCelular);

                return (
                  <View
                    style={[
                      styles.tableRow,
                      index % 2 === 0 && styles.tableRowAlt, // Alterna color de fila
                    ]}
                    key={order}
                  >
                    <View style={styles?.tableCol}>
                      <Text style={styles?.tableCell}>
                        {Orders[order].nombre || "N/A"}
                      </Text>
                    </View>
                    <View style={styles?.tableColEmail}>
                      <Text style={styles?.tableCell}>
                        {Orders[order].email || "N/A"}
                      </Text>
                    </View>
                    <View style={styles?.tableCol}>
                      <Text style={styles?.tableCell}>
                        {NumeroCelular?.Celular || "N/A"}
                      </Text>
                    </View>
                    <View style={styles?.tableCol}>
                      <Text style={styles?.tableCell}>
                        {Orders[order]?.orders?.length || 0}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {cantidadProductos || 0}
                      </Text>
                    </View>
                    <View style={styles?.tableCol}>
                      <Text style={styles?.tableCell}>
                        {formatCurrency(totalValue)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
            <View style={[styles.tableRow, styles.totalRow]}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Total</Text>
              </View>
              <View style={styles.tableColEmail}>
                <Text style={styles.tableCell}></Text> {/* Columna vacía */}
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}></Text> {/* Columna vacía */}
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}></Text> {/* Columna vacía */}
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}></Text> {/* Columna vacía */}
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {formatCurrency(totalGeneral)}
                </Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default ReporteClientesPDF;
