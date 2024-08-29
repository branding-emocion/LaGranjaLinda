// components/ReporteClientesPDF.js
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    borderCollapse: "collapse",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
  },
  tableCell: {
    textAlign: "center",
    fontSize: 12,
  },
  tableHeaderCell: {
    fontWeight: "bold",
    backgroundColor: "#e0e0e0",
    fontSize: 12,
  },
});

const ReporteClientesPDF = ({ Orders, RangesData }) => (
  <PDFViewer style={{ width: "100%", height: "600px" }}>
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Reporte de Clientes</Text>
          <Text>
            Fecha de inicio:{" "}
            {RangesData?.startDate
              ? new Date(RangesData.startDate).toLocaleString().split(",")[0]
              : ""}{" "}
            - Fecha de fin:{" "}
            {RangesData?.endDate
              ? new Date(RangesData.endDate).toLocaleString().split(",")[0]
              : ""}
          </Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableCol}>
                <Text style={[styles.tableCell, styles.tableHeaderCell]}>
                  Nombre completo
                </Text>
              </View>
              <View style={styles.tableCol}>
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
                  Cantidad de compras
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={[styles.tableCell, styles.tableHeaderCell]}>
                  Valor Total{" "}
                </Text>
              </View>
            </View>
            {Object.keys(Orders).map((order) => (
              <View style={styles.tableRow} key={order}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {Orders[order].nombre || ""}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {Orders[order].email || ""}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {Orders[order]?.telefono || ""}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {Orders[order].orders.length || ""}
                  </Text>
                </View>

                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    S/{" "}
                    {Orders[order].orders?.reduce((acc, el) => {
                      return acc + el?.paymentDetails?.amount;
                    }, 0) || ""}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  </PDFViewer>
);

export default ReporteClientesPDF;
