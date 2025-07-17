import React from "react";
import { Link } from "react-router-dom";


const styles = {
  container: {
    height: "100vh",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    background: "#f8f8f8",
  },
  title: {
    fontSize: "48px",
    marginBottom: "16px",
    color: "#333",
  },
  text: {
    fontSize: "18px",
    marginBottom: "24px",
    color: "#555",
  },
  link: {
    textDecoration: "none",
    color: "#007bff",
    fontSize: "18px",
  },
};
const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404 - Page Not Found</h1>
      <p style={styles.text}>Sorry, the page you're looking for doesn't exist.</p>
      <Link to="/" style={styles.link}>Go back home</Link>
    </div>
  );
};


export default NotFound;
