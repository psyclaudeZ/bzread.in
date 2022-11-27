import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [links, setLinks] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    axios
      .get("/api/v1/episode")
      .then((response) => {
        setLinks(response.data);
      })
      .catch((error) => {
        setErrorMessage(
          error.message ? error.message : "Failed to fetch data from server."
        );
      });
  }, []);

  const links_jsx =
    links.length === 0 ? (
      errorMessage != null ? (
        <div>Encountered an error: {errorMessage}.</div>
      ) : (
        "Loading..."
      )
    ) : (
      <div>
        <ol>
          {links.map((link) => (
            <li key={link.id}>
              <a href={link.uri}>{link.title}</a>
            </li>
          ))}
        </ol>
      </div>
    );

  const d = new Date().toISOString().slice(0, 10);
  return (
    <div className="App">
      <h1>bzread.in</h1>
      <hr></hr>
      <h2>Episode of {d}</h2>
      {links_jsx}
    </div>
  );
}

export default App;
