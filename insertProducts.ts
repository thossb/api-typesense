import "https://deno.land/x/dotenv/load.ts";

// const typesenseAPIKey = Deno.env.get("TYPESENSE_API_KEY") || "xyz"; // Replace with your actual API key or use environment variables
const typesenseHost = "http://localhost:8108";
const collectionName = "products";

const products = [
  {
    category: "Anti aging",
    product_id: "LRC05",
    product_name: "La Roche Posay Cicaplast Baume B5+ 40 ML",
    original_price: "247700",
    price: "", // Empty price
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
  },
  {
    category: "Anti aging",
    product_id: "WDH29",
    product_name: "WARDAH LIGHTENING BLUE CLAY MASK 50 G",
    original_price: "19500",
    price: "", // Empty price
    weight: "200",
    in_stock: "TRUE"
  },
  {
    category: "Other mother & child",
    product_id: "MBRGB",
    product_name: "MILNA BABY BISC ORIGINAL 130 GR",
    original_price: "16700",
    price: "", // Empty price
    weight: "200",
    in_stock: "TRUE"
  },
  {
    category: "Vitamin lainnya",
    product_id: "K90W1",
    product_name: "EVER E 250 IU 6 KPS",
    original_price: "16900",
    price: "", // Empty price
    weight: "200",
    in_stock: "TRUE"
  },
  {
    category: "Other beauty",
    product_id: "LMCPS",
    product_name: "MAKARIZO VITACAPS HAIR VITAMIN PRISMATIC SHINE AND COLOR REFLECT 6 X 1ML",
    original_price: "15000",
    price: "", // Empty price
    weight: "200",
    in_stock: "TRUE"
  }
];

// Function to insert products into the collection
const insertProducts = async () => {
  const insertPromises = products.map(async (product) => {
    // Convert fields
    product.price = product.price === "" ? 0 : parseFloat(product.price);
    product.original_price = parseFloat(product.original_price);
    product.weight = parseFloat(product.weight);
    product.in_stock = product.in_stock.toLowerCase() === "true";

    try {
      const response = await fetch(`${typesenseHost}/collections/${collectionName}/documents`, {
        method: "POST",
        headers: {
          "X-TYPESENSE-API-KEY": typesenseAPIKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        console.log(`Product "${product.product_name}" inserted successfully`);
      } else {
        const errorBody = await response.text();
        console.error(`Failed to insert product "${product.product_name}":`, errorBody);
      }
    } catch (error) {
      console.error(`Error inserting product "${product.product_name}":`, error);
    }
  });

  // Wait for all insertions to complete
  await Promise.all(insertPromises);
};

await insertProducts();

