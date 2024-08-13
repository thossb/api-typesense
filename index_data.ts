const data = [
    {
      "category": "Anti aging",
      "product_id": "LRC05",
      "product_name": "La Roche Posay Cicaplast Baume B5+ 40 ML",
      "original_price": 247700,
      "price": null,
      "weight": 200,
      "in_stock": true
    },
    {
      "category": "La Roche Posay",
      "product_id": "LRC24",
      "product_name": "La Roche Posay Cicaplast B5 Repair Serum 30 ml",
      "original_price": 650000,
      "price": 610000,
      "weight": 200,
      "in_stock": true
    }
  ];
  
  const response = await fetch("http://localhost:8108/collections/products/documents", {
    method: "POST",
    headers: {
      "X-TYPESENSE-API-KEY": "xyz",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  
  if (response.ok) {
    console.log("Data indexed successfully");
  } else {
    console.log("Failed to index data:", await response.text());
  }
  