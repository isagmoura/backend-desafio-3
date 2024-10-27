#!/bin/bash

echo "Seeding..."
curl -s -X POST http://localhost:3000/categories/seed > /dev/null
echo "Seeded categories"
curl -s -X POST http://localhost:3000/products/seed > /dev/null
echo "Seeded products"
echo "Finished seeding!"