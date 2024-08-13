// test_script.ts

const url = "http://localhost:8000/search";
const payload = {
  data: [
    {
      category: "Anti aging",
      product_id: "LRC05",
      product_name: "La Roche Posay Cicaplast Baume B5+ 40 ML",
      original_price: "247700",
      price: "",
      weight: "200",
      in_stock: "TRUE"
    },
    {
      category: "La Roche Posay",
      product_id: "LRC24",
      product_name: "La Roche Posay Cicaplast B5 Repair Serum 30 ml",
      original_price: "650000",
      price: "610000",
      weight: "200",
      in_stock: "TRUE"
    }
  ],
  row: 1,
  created_at: "2023-12-21T03:35:10.228Z",
  updated_at: "2024-08-12T09:30:08.063Z"
};

const response = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});

if (response.ok) {
  const jsonResponse = await response.json();
  console.log("Response:", jsonResponse);
} else {
  console.error("Error:", response.statusText);
}
