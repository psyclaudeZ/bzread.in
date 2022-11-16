import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    axios.get("/posts").then((response) => {
      console.log(response);
      setLinks(response.data);
    });
  }, []);

  return (
    <div className="App">
      <h1>bzread.in</h1>
      <h2>Archive all the gold of the Internet</h2>
      <p>
        Need some love of <del>React</del>, <del>TypeScript</del>, and Rust.
      </p>
      <p>
        Here's a <a href="/test">REST endpoint</a> for you to click around!
      </p>
      {links}
    </div>
  );
}

export default App;
