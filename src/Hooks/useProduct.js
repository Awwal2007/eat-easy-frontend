// src/hooks/useAuth.js
import { useContext } from "react";
import { ProductContext } from "../contexts/productContext";

export const useProduct = () => useContext(ProductContext);
