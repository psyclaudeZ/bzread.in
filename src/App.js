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

  const idx = Math.floor(Math.random() * links.length);
  const links_jsx =
    links.length === 0 ? (
      <div>Loading...</div>
    ) : (
      <div>
        <ul>
          {links.slice(idx, idx + 5).map((link) => (
            <li key={link.id}>
              <a href={link.uri}>{link.title}</a>
            </li>
          ))}
        </ul>
      </div>
    );

  return (
    <div className="App">
      <h1>bzread.in</h1>
      <h2>Today's episode:</h2>
      {links_jsx}
    </div>
  );
}

export default App;
