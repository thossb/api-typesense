# Deno typesense API

This API to create collection in typesense, the code will accept data from payload json, then do search algorithm using typesense

### Start

- Make sure to install Deno: https://deno.land/manual/getting_started/installation
- install and run typesense server
- change typesenseAPIKey and typesenseHost
  
Then start the project:
```
denon run --allow-net index.ts
```
### Usage
run the inserProducts.ts to try seeding the typesense
```
deno run --allow-net --allow-env insertProducts.ts
```
run or modify the search_test.ts to try search product
```
deno run --allow-net --allow-env search_test.ts  
```

### POSTMAN DEMO
i have uploaded the postman collection to be tried locally
- insert product
![image](https://github.com/user-attachments/assets/39449c9e-5c2f-4fc2-8c32-89134a6558ad)
- get all product
![image](https://github.com/user-attachments/assets/3ddc9b0e-8be2-4b4d-917d-365d1b740ba8)
- delete typesense collection
- search algorithm ( example "roche" )
![image](https://github.com/user-attachments/assets/5ebb52f3-282e-49d3-9caf-9bab26924a3b)

###Note
- this is a mockupapps, with unfinished routing. ( to be discussed if needed )
- yellow ai payload json must be formated / parsed to be the following ( to be discussed if needed )
```
[
  {
    "product_name": "WARDAH LIGHTENING BLUE CLAY MASK 50 G",
    "product_id": "WDH29",
    "description": "",
    "price": "",
    "original_price": "19500",
    "category": "Anti aging",
    "weight": "200",
    "in_stock": "true"
  },
  {
    "product_name": "MILNA BABY BISC ORIGINAL 130 GR",
    "product_id": "MBRGB",
    "description": "",
    "price": "",
    "original_price": "16700",
    "category": "Other mother & child",
    "weight": "200",
    "in_stock": "true"
  }
]
```
