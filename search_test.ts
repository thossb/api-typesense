import "https://deno.land/x/dotenv/load.ts";

const typesenseAPIKey = Deno.env.get("TYPESENSE_API_KEY") || "xyz"; // Replace with your actual API key or use environment variables
const typesenseHost = "http://localhost:8108";
const collectionName = "products";

const searchProducts = async (query: string) => {
  const searchParams = new URLSearchParams({
    q: query,
    query_by: "product_name,description", // Search by product_name and description
  });

  try {
    const response = await fetch(`${typesenseHost}/collections/${collectionName}/documents/search?${searchParams}`, {
      method: "GET",
      headers: {
        "X-TYPESENSE-API-KEY": typesenseAPIKey,
      },
    });

    if (response.ok) {
      const searchResults = await response.json();
      const products = searchResults.hits.map((hit: any) => hit.document);
      console.log(JSON.stringify(products, null, 2));
    } else {
      const errorBody = await response.text();
      console.error("Search failed:", errorBody);
    }
  } catch (error) {
    console.error("Error during search:", error.message);
  }
};

// Example usage: replace "La Roche" with your search query
const query = "Roche";
await searchProducts(query);
