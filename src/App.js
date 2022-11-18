import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [links, setLinks] = useState([]);
  /*
  console.log(process.env);
  console.log(process.env.EPISODE_ENDPOINT);
  console.log(process.env.EPISODE_ENDPOINT_API_KEY);
  */

  useEffect(() => {
    axios
      .get(process.env.EPISODE_ENDPOINT, {
        headers: {
          "x-api-key": process.env.EPISODE_ENDPOINT_API_KEY,
        },
      })
      .then((response) => {
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
