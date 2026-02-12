# Advanced React E-Commerce Web App (React + TypeScript)

This project is a modern e-commerce demo app built with React + TypeScript using the FakeStoreAPI.
It demonstrates asynchronous data fetching with React Query and state management with Redux Toolkit.

## Features

- Product catalog displayed on the Home page
- Products fetched with React Query
- Dynamic category dropdown (fetched from the API, not hard-coded)
- Category filtering (fetches products from the category endpoint)
- Add products to cart from the Home page
- Shopping cart state managed with Redux Toolkit
- Cart persistence using sessionStorage
- Cart totals:
  - Total number of items
  - Total price
- Checkout simulation clears Redux state and sessionStorage with a success message
- Image fallback placeholder if product images fail to load

## Tech Stack

- React + TypeScript (Vite)
- React Router
- Redux Toolkit
- React Query
- Axios

## How to Run Locally

```bash
npm install
npm run dev
```
