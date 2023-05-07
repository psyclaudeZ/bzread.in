import React, { useState, useEffect } from "react";
import axios from "axios";

const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;
const EPISODE_INTERVAL = 3; // days

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

  return (
    <div>
      <h3>Episode of {getEpisodeDate()}</h3>
      {links_jsx}
    </div>
  );
}

/**
 * Bumped every three days.
 */
function getEpisodeDate() {
  const episodeNumber = Math.floor(
    new Date().getTime() / MILLISECONDS_IN_A_DAY / EPISODE_INTERVAL
  );
  const date = new Date(
    episodeNumber * EPISODE_INTERVAL * MILLISECONDS_IN_A_DAY
  );
  return date.toISOString().slice(0, 10);
}

export default Episode;
