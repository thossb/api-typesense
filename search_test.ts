const searchResponse = await fetch("http://localhost:8000/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query: "Cicaplast" })
  });
  
  const searchResults = await searchResponse.json();
  console.log(searchResults);
  