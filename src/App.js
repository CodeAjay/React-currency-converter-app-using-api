import React, { useEffect, useState } from "react";
import "./styles.css";
import CurrencyRow from "./CurrencyRow";

const BASE_URL =
  "https://v6.exchangerate-api.com/v6/3f803b3bca20489cb8dc0388/latest/USD";

export default function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [exchangeRate, setExchangeRate] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
  let fromAmount, toAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        const firstCurrency = Object.keys(data.conversion_rates)[2];
        setCurrencyOptions([
          data.base_code,
          ...Object.keys(data.conversion_rates)
        ]);
        setFromCurrency(data.base_code);
        setToCurrency(firstCurrency);
        setExchangeRate(data.conversion_rates[firstCurrency]);
      });
  }, []);

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(
        `${BASE_URL}?base_code=${fromCurrency}& conversion_rates=${toCurrency}`
      )
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          return setExchangeRate(data.conversion_rates[toCurrency]);
        });
    }
  }, [fromCurrency, toCurrency]);

  function handleFromchangeAmount(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  }
  function handleTochangeAmount(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  }

  return (
    <div className="App">
      <h1>Convert</h1>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeCurrency={(e) => setFromCurrency(e.target.value)}
        amount={fromAmount}
        onChangeAmount={handleFromchangeAmount}
      />
      <div className="equal">=</div>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={(e) => setToCurrency(e.target.value)}
        amount={toAmount}
        onChangeAmount={handleTochangeAmount}
      />
    </div>
  );
}
