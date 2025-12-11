export type Product = {
  name: string;
  description: string;
  price: number;
  quantity: number;
  pictureURL: string;
};

export const PRODUCTS: Product[] = [
  {
    name: "Brake Pads",
    description: "All-weather brake pad set for optimal performance.",
    price: 39.99,
    quantity: 10,
    pictureURL: "https://m.media-amazon.com/images/I/61h07ruAEWL._AC_UF894,1000_QL80_.jpg",
  },
  {
    name: "Air Filter",
    description: "High-performance air filter for cleaner air intake.",
    price: 24.5,
    quantity: 15,
    pictureURL: "https://via.placeholder.com/300x200?text=Air+Filter",
  },
  {
    name: "Oil Filter",
    description: "Premium oil filter for extended engine life.",
    price: 14.99,
    quantity: 20,
    pictureURL: "https://via.placeholder.com/300x200?text=Oil+Filter",
  },
];
