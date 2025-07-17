import React from "react";
import { Link } from "react-router-dom";


const NotFound = () => {
  return (
    <div style={{height: "100vh",textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    background: "#f8f8f8",}}>
      <h1 style={{fontSize: "48px",
    marginBottom: "16px",
    color: "#333",}}>404 - Page Not Found</h1>
      <p style={{fontSize: "18px",
    marginBottom: "24px",
    color: "#555",}}>Sorry, the page you're looking for doesn't exist.</p>
      <Link to="/" style={{textDecoration: "none",
    color: "#ffbf00ff",
    fontSize: "18px",}}>Go back home</Link>
    </div>
  );
};


export default NotFound;
