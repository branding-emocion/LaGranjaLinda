import dynamic from "next/dynamic";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";

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
    width: "33%", // Ajustado para ancho proporcional
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

const ReportesProductosPDF = ({ Orders, RangesData }) => {
  // Agrupando productos y calculando cantidad vendida y total generado por producto
  const productSales = {};

  const totalGeneral = Object.values(productSales).reduce(
    (acc, product) => acc + product.totalValue,
    0
  );

  return (
    <PDFViewer style={{ width: "100%", height: "600px" }}>
      <Document>
        <Page style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.title}>Reporte de Ventas por Producto</Text>
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
                    Producto
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={[styles.tableCell, styles.tableHeaderCell]}>
                    Cantidad Vendida
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={[styles.tableCell, styles.tableHeaderCell]}>
                    Valor Total
                  </Text>
                </View>
              </View>

              {Object.keys(Orders).map((productName, index) => {
                console.log("Produc", Orders[productName]);

                const TotalValue = Orders[productName]?.Productos?.reduce(
                  (acc, product) => acc + parseFloat(product.Precio),
                  0
                );

                return (
                  <View
                    style={[
                      styles.tableRow,
                      index % 2 === 0 && styles.tableRowAlt, // Alterna color de fila
                    ]}
                    key={index}
                  >
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {Orders[productName]?.nombreproducto}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {Orders[productName]?.Productos?.length}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {formatCurrency(TotalValue) || 0}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default ReportesProductosPDF;
