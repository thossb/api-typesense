import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const app = new Application();
const router = new Router();

const typesenseAPIKey = "xyz";  // Replace with your actual API key
const typesenseHost = "http://localhost:8108";
const collectionName = "products";

// Create the collection if it doesn't exist
const createCollection = async () => {
  const schema = {
    name: collectionName,
    fields: [
      { name: "name", type: "string" },
      { name: "description", type: "string" },
      { name: "price", type: "float" },
      { name: "category", type: "string", facet: true },
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
      console.log("Collection already exists or another error occurred:", await response.text());
    }
  } catch (error) {
    console.error("Error creating collection:", error);
  }
};

// Call the createCollection function to ensure the collection is created
await createCollection();

router.post("/search", async (context) => {
  const { query } = await context.request.body().value;

  const searchParams = new URLSearchParams({
    q: query,
    query_by: "name,description",
  });

  const response = await fetch(`${typesenseHost}/collections/${collectionName}/documents/search?${searchParams}`, {
    method: "GET",
    headers: {
      "X-TYPESENSE-API-KEY": typesenseAPIKey,
    },
  });

  const searchResults = await response.json();
  context.response.body = searchResults;
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });
