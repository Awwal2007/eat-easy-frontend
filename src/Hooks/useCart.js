// src/hooks/useAuth.js
import { useContext } from "react";
import { CartContext } from "../contexts/cartContex";

export const useCart = () => useContext(CartContext);
