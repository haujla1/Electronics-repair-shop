import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div>
    <h1>404 - Page Not Found!</h1>
    <Link to="/">Go to HomePage</Link>
  </div>
);

export default NotFound;
