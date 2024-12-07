import React, { useEffect, useState } from "react";
import axios from "axios";
// "homepage": "https://aramdata.github.io/crypto-tracker",

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
    var {totalInvest,totalProfit,totalFinalInvest}=0;

    const fetchPrices = async () => {
      const updatedData = await Promise.all(
        tokens.map(async (token) => {
          const { symbol, buyPrice, investment, targets } = token;
          try {
            const response = await axios.get(
              `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
            );
            const currentPrice = parseFloat(response.data.price);
            const profit = ((currentPrice - buyPrice) * (investment / buyPrice));
            var currentTarget = targets.find((target) => currentPrice > target) || "down with first target!";
            const currentInvest=investment+profit;
            return { symbol, buyPrice, investment, currentPrice, profit, targets, currentTarget,currentInvest };
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
      {}
      <p>totalInvest: ${data.reduce((n, {investment}) => n + investment, 0)?.toFixed(2)}</p>
                <p>totalProfit: ${data.reduce((n, {profit}) => n + profit, 0)?.toFixed(2)}</p>
                <p>totalFinalInvest: ${data.reduce((n, {currentInvest}) => n + currentInvest, 0)?.toFixed(2)}</p>
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
                <p>Profit: ${token.profit?.toFixed(2)}</p>
                <p>Targets: {token.targets.join(", ")}</p>
                <p>Current Target: {token.currentTarget}</p>
                <p>Current Inverst: {token.currentInvest?.toFixed(2)}</p>

              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
