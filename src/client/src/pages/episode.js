import React from "react";
import data from './links.js'

function Episode() {
  const links_jsx =
    data == null || data.links == null ? (
      <div>Encountered an error fetching links.</div>
    ) : (
      <div>
        <ol>
          {data.links.map((link) => (
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
