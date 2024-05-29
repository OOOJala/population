import './App.css';
import { useState, useEffect } from 'react';
import React from 'react';

function DaTable({ str }) {
  if (str != null) {
    const kunnat = str.dataset.dimension.Alue.category.label;
    const kielet = str.dataset.dimension.Kieli.category.label;
    const vuodet = str.dataset.dimension.Vuosi.category.label;
    const arvot = str.dataset.value;

    const kuntaResult = [];
    const kieliResult = [];
    const vuosiResult = [];
    const arvoResult = [];

    for (const i in kunnat) kuntaResult.push(kunnat[i]);
    for (const i in kielet) kieliResult.push(kielet[i]);
    for (const i in vuodet) vuosiResult.push(vuodet[i]);
    for (const i in arvot) arvoResult.push(arvot[i]);

    const rows = kuntaResult.length;
    const cols = 2 + vuosiResult.length;
    const taulukko = Array(rows).fill(null).map(() => Array(cols).fill(null));

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (j === 0) {
          taulukko[i][j] = `${i} : ${kuntaResult[i]}`;
        } else if (j === 1) {
          taulukko[i][j] = kieliResult[i];
        } else {
          const arvoIndex = i * vuosiResult.length + (j - 2);
          taulukko[i][j] = `${vuosiResult[j - 2]}: ${arvoResult[arvoIndex]}`;
        }
      }
    }

    return (
      <div>
        <table border="1">
          <tbody>
            {taulukko.map((row, i) => (
              <tr key={`taul-${i}`}>
                {row.map((cell, j) => (
                  <td key={`cell-${i}-${j}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
}

function App() {
  const [result, setResult] = useState(null);

  function handleClick(area) {
    const raw = JSON.stringify({
      "query": [
        {
          "code": "Alue",
          "selection": {
            "filter": "item",
            "values": [
              area
            ]
          }
        },
        {
          "code": "Kieli",
          "selection": {
            "filter": "item",
            "values": [
              "fi",
              "sv",
              "mu"
            ]
          }
        },
        {
          "code": "Vuosi",
          "selection": {
            "filter": "item",
            "values": [
              "2022",
              "2023"
            ]
          }
        }
      ],
      "response": {
        "format": "json-stat"
      }
    });

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": "rxid=98e6715d-eb73-44e3-8c48-c051cb894f21"
      },
      body: raw,
      redirect: "follow"
    };

    fetch("https://stat.hel.fi:443/api/v1/fi/Aluesarjat/vrm/vaerak/umkun/Hginseutu_VA_VR02_Vakiluku_aidinkieli3.px", requestOptions)
      .then(response => response.json())
      .then(result => setResult(result))
      .catch(error => console.error(error));
  }

  return (
    <div>
      <button onClick={() => handleClick('091')}>Helsinki</button>
      <button onClick={() => handleClick('049')}>Espoo</button>
      {result ? <DaTable str={result} /> : <div>Loading...</div>}
    </div>
  );
}

export default App;