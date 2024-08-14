import { Application, Router, Context } from "https://deno.land/x/oak@v11.0.0/mod.ts";

const app = new Application();
const router = new Router();

const typesenseAPIKey = Deno.env.get("TYPESENSE_API_KEY") || "xyz";  // Replace with your actual API key or use environment variables
const typesenseHost = "http://localhost:8108";
const collectionName = "products";

// Create the collection if it doesn't exist
const createCollection = async () => {
  const schema = {
    name: collectionName,
    fields: [
      { name: "product_name", type: "string" },                 
      { name: "description", type: "string", optional: true },  // Optional in case it's not provided
      { name: "price", type: "float", default: 0 },             // Price as float with default value
      { name: "original_price", type: "float", default: 0 },    // Original price as float
      { name: "category", type: "string", facet: true },
      { name: "product_id", type: "string" },                   
      { name: "weight", type: "float", default: 0 },            // Weight as float with default value
      { name: "in_stock", type: "bool" }                        // in_stock as boolean
    ],
    default_sorting_field: "price",
  };

  try {
    const response = await fetch(`${typesenseHost}/collections`, {
      method: "POST",
      headers: {
        "X-TYPESENSE-API-KEY": typesenseAPIKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(schema),
    });

    if (response.ok) {
      console.log("Collection created successfully");
    } else {
      const responseBody = await response.text();
      console.log("Collection already exists or another error occurred:", responseBody);
    }
  } catch (error) {
    console.error("Error creating collection:", error);
  }
};

await createCollection();

//1. search data
router.post("/search", async (context: Context) => {
  try {
    const body = context.request.body(); // Get the body object
    if (body.type === "json") { // Check if the body type is JSON
      const { query } = await body.value; // Await and extract the value
      
      if (!query) {
        context.response.status = 400;
        context.response.body = { error: "Query parameter is required" };
        return;
      }

      const searchParams = new URLSearchParams({
        q: query,
        query_by: "product_name,description",
      });

      const response = await fetch(`${typesenseHost}/collections/${collectionName}/documents/search?${searchParams}`, {
        method: "GET",
        headers: {
          "X-TYPESENSE-API-KEY": typesenseAPIKey,
        },
      });

      if (response.ok) {
        const searchResults = await response.json();
        const products = searchResults.hits.map((hit: any) => hit.document);
        context.response.body = products;
      } else {
        const errorBody = await response.text();
        context.response.status = response.status;
        context.response.body = { error: errorBody };
      }
    } else {
      context.response.status = 400;
      context.response.body = { error: "Invalid content type. Expected JSON." };
    }
  } catch (error) {
    console.error("Search error:", error.message);
    context.response.status = 500;
    context.response.body = { error: "Internal server error" };
  }
});

//2. get all data
router.get("/products", async (context: Context) => {
  try {
    const searchParams = new URLSearchParams({
      q: "*",  // Wildcard query to get all documents
      query_by: "product_name,description",  // Adjusted to 'product_name'
    });

    const response = await fetch(`${typesenseHost}/collections/${collectionName}/documents/search?${searchParams}`, {
      method: "GET",
      headers: {
        "X-TYPESENSE-API-KEY": typesenseAPIKey,
      },
    });

    if (response.ok) {
      const products = await response.json();
      context.response.body = products;
    } else {
      const errorBody = await response.text();
      context.response.status = response.status;
      context.response.body = { error: errorBody };
    }
  } catch (error) {
    console.error("Error retrieving products:", error);
    context.response.status = 500;
    context.response.body = { error: "Internal server error" };
  }
});

//3. post products
router.post("/products", async (context: Context) => {
  try {
    const body = context.request.body({ type: "json" });
    const productData = await body.value;

    const productsArray = Array.isArray(productData) ? productData : [productData]; // Handle single product or array

    let insertedCount = 0;

    for (const productData of productsArray) {
      // Validate required fields
      if (!productData.product_name || !productData.product_id) {
        context.response.status = 400;
        context.response.body = { error: "product_name and product_id are required fields for all products" };
        return;
      }

      // Convert and validate fields
      const product = {
        product_name: productData.product_name,
        product_id: productData.product_id,
        description: productData.description || "",
        price: isNaN(parseFloat(productData.price)) ? 0 : parseFloat(productData.price),
        original_price: isNaN(parseFloat(productData.original_price)) ? 0 : parseFloat(productData.original_price),
        category: productData.category || "General",
        weight: isNaN(parseFloat(productData.weight)) ? 0 : parseFloat(productData.weight),
        in_stock: productData.in_stock?.toString().toLowerCase() === "true",
      };

      console.log("Product being sent to TypeSense:", JSON.stringify(product, null, 2));

      const response = await fetch(`${typesenseHost}/collections/${collectionName}/documents`, {
        method: "POST",
        headers: {
          "X-TYPESENSE-API-KEY": typesenseAPIKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        insertedCount++;
      } else {
        const errorBody = await response.text();
        console.error("TypeSense API error response:", errorBody);
        context.response.status = response.status;
        context.response.body = { error: errorBody };
        return;
      }
    }

    context.response.status = 201;
    context.response.body = {
      message: `${insertedCount} product(s) successfully inserted`
    };
  } catch (error) {
    console.error("Error inserting products:", error.message);
    context.response.status = 500;
    context.response.body = { error: "Internal server error" };
  }
});

// 4. delete all collections
router.delete("/collections", async (context: Context) => {
  try {
    const response = await fetch(`${typesenseHost}/collections`, {
      method: "GET",
      headers: {
        "X-TYPESENSE-API-KEY": typesenseAPIKey,
      },
    });

    if (response.ok) {
      const collections = await response.json();

      for (const collection of collections) {
        const deleteResponse = await fetch(`${typesenseHost}/collections/${collection.name}`, {
          method: "DELETE",
          headers: {
            "X-TYPESENSE-API-KEY": typesenseAPIKey,
          },
        });

        if (!deleteResponse.ok) {
          const errorBody = await deleteResponse.text();
          console.error(`Error deleting collection ${collection.name}:`, errorBody);
        }
      }

      context.response.body = { message: "All collections deleted successfully" };
    } else {
      const errorBody = await response.text();
      context.response.status = response.status;
      context.response.body = { error: errorBody };
    }
  } catch (error) {
    console.error("Error deleting collections:", error);
    context.response.status = 500;
    context.response.body = { error: "Internal server error" };
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });
