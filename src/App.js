import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [tokens, setTokens] = useState([]);
  const [data, setData] = useState([]);



  useEffect(() => {
    // Load tokens from local JSON
    fetch("crypto-tracker/tokens.json")
      .then((res) => res.json())
      .then((tokens) => setTokens(tokens));
  }, []);

  useEffect(() => {
    var { totalInvest, totalProfit, totalFinalInvest } = 0;

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
            const currentInvest = investment + profit;
            return { symbol, buyPrice, investment, currentPrice, profit, targets, currentTarget, currentInvest };
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
        <table class="styled-table">
          <thead>
            <tr>
              <td>Symbol</td>
              <td>Buy Price</td>
              <td>Investment</td>
              <td>Current Price</td>
              <td>Profit</td>
              <td>Targets</td>
              <td>Current Target</td>
              <td>Current Inverst</td>

            </tr>
          </thead>
          <tbody>

            {data.map((token, index) => (
              <tr key={index} className="token-card">
                <td>{token.symbol}</td>
                <td>{token.buyPrice}</td>
                <td>{token.investment}</td>
                <td>{token.currentPrice}</td>
                <td>{token.profit?.toFixed(2)}</td>
                <td>{token.targets.join(", ")}</td>
                <td>{token.currentTarget}</td>
                <td>{token.currentInvest?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tr key="sum" className="token-card">
                <td>Total</td>
                <td></td>
                <td>{data.reduce((n, { investment }) => n + investment, 0)?.toFixed(2)}</td>
                <td></td>
                <td>{data.reduce((n, { profit }) => n + profit, 0)?.toFixed(2)}</td>
                <td></td>
                <td></td>
                <td>{data.reduce((n, { currentInvest }) => n + currentInvest, 0)?.toFixed(2)}</td>
              </tr>
        </table>

      </div>
    </div>
  );
};

export default App;
