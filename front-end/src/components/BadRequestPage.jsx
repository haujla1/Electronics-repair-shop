import React from "react";
import { Link } from "react-router-dom";

const BadRequest = () => (
  <div>
    <h1>400 - Bad Request!</h1>
    <Link to="/">Go To HomePage</Link>
  </div>
);

export default BadRequest;
