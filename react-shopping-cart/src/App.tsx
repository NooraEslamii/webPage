import React, { useState } from "react";
import { useQuery } from "react-query";
import Item from "./Items/Item";
import Cart from "./Cart/Cart";
import './index.css';

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
};

const getProducts = async (): Promise<CartItemType[]> =>
  await (await fetch('https://fakestoreapi.com/products')).json();

const App: React.FC = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);

  const { data, isLoading, error } = useQuery<CartItemType[]>(
    'products',
    getProducts
  );

  const getTotalItems = (items: CartItemType[]): number =>
    items.reduce((ack, item) => ack + item.amount, 0);

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prev => {
      const isItemInCart = prev.find(item => item.id === clickedItem.id);
      if (isItemInCart) {
        return prev.map(item =>
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item
        );
      }
      return [...prev, { ...clickedItem, amount: 1 }];
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev =>
      prev.reduce((ack, item) => {
        if (item.id === id) {
          if (item.amount === 1) return ack;
          return [...ack, { ...item, amount: item.amount - 1 }];
        } else {
          return [...ack, item];
        }
      }, [] as CartItemType[])
    );
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen">Something went wrong ...</div>;

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
          <span className="text-gray-700">Hi, James</span>
        </div>
        <div className="text-2xl font-bold">LOGO</div>
        <div className="relative">
          <span className="text-gray-700">Cart</span>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{getTotalItems(cartItems)}</span>
        </div>
      </header>
      <div className="flex items-center mb-8">
        <input
          type="text"
          placeholder="Search..."
          className="w-1/2 mr-4 p-2 border rounded-md"
        />
        <select className="w-1/3 p-2 border rounded-md mx-auto">
          <option>Category</option>
        </select>
      </div>

      <div className="relative">
        {cartOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-full h-full max-w-full max-h-full p-6 rounded-lg shadow-lg relative">
              <Cart
                cartItems={cartItems}
                addToCart={handleAddToCart}
                removeFromCart={handleRemoveFromCart}
              />
              <button
                onClick={() => setCartOpen(false)}
                className="absolute top-4 right-4 text-gray-700 text-3xl"
              >
                &times;
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => setCartOpen(true)}
          className="fixed top-4 right-4 bg-blue-500 text-white p-2 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
            {getTotalItems(cartItems)}
          </span>
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map(item => (
            <Item key={item.id} item={item} handleAddToCart={handleAddToCart} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
