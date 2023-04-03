import React, { useState, useEffect } from "react";
import axios from "axios";

function Episode() {
  const [links, setLinks] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    axios
      .get("/api/v1/episode")
      .then((response) => {
        // Sanity checks whether it's of valid JSON format
        JSON.parse(JSON.stringify(response.data));
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
    <div>
      <h3>Episode of {d}</h3>
      {links_jsx}
    </div>
  );
}

export default Episode;
