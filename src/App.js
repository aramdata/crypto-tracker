import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [tokens, setTokens] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Load tokens from local JSON
    fetch("tokens.json")
      .then((res) => res.json())
      .then((tokens) => setTokens(tokens));
  }, []);

  useEffect(() => {
    const fetchPrices = async () => {
      const updatedData = await Promise.all(
        tokens.map(async (token) => {
          const { symbol, buyPrice, investment, targets } = token;
          try {
            const response = await axios.get(
              `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
            );
            const currentPrice = parseFloat(response.data.price);
            const profit = ((currentPrice - buyPrice) * (investment / buyPrice)).toFixed(2);
            const currentTarget = targets.find((target) => currentPrice < target) || "All targets reached!";
            return { symbol, buyPrice, investment, currentPrice, profit, targets, currentTarget };
          } catch (error) {
            console.error(`Error fetching price for ${symbol}:`, error);
            return { symbol, error: "Error fetching data" };
          }
        })
      );
      setData(updatedData);
    };
    if (tokens.length > 0) fetchPrices();
  }, [tokens]);

  return (
    <div className="App">
      <h1>Crypto Tracker</h1>
      <div className="tokens-container">
        {data.map((token, index) => (
          <div key={index} className="token-card">
            <h2>{token.symbol}</h2>
            {token.error ? (
              <p>{token.error}</p>
            ) : (
              <>
                <p>Buy Price: ${token.buyPrice}</p>
                <p>Investment: ${token.investment}</p>
                <p>Current Price: ${token.currentPrice?.toFixed(2)}</p>
                <p>Profit: ${token.profit}</p>
                <p>Targets: {token.targets.join(", ")}</p>
                <p>Current Target: {token.currentTarget}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
