import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 20,
  },
  title: {
    color: "#4C46B6",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  itemContainer: {
    width: "48%",
    alignItems: "center",
    marginVertical: 8,
  },
  label: {
    color: "#666",
    fontSize: 14,
  },
  value: {
    color: "#4C46B6",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },
});
