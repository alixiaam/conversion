const dropList = document.querySelectorAll(".droplist select"),
      fromCurrency = document.querySelector(".from select"),
      toCurrency = document.querySelector(".to select"),
      getButton = document.querySelector("form button");

const apiKey = "0a4b2184d7427ee74a1abb97"; 

// Populate the currency dropdown lists
for (let i = 0; i < dropList.length; i++) {
    for (let currency_code_key in country_code) {
        let selected = (i === 0 && currency_code_key === "USD") || (i === 1 && currency_code_key === "HNL") ? "selected" : "";
        let optionTag = `<option value="${currency_code_key}" ${selected}>${currency_code_key}</option>`;
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e => {
        loadFlag(e.target);
    });
}

// Load flag based on selected currency
function loadFlag(element) {
    const code = element.value;
    const imgTag = element.parentElement.querySelector("img");
    imgTag.src = `https://flagsapi.com/${country_code[code]}/flat/64.png`;
}

window.addEventListener("load", () => {
    getExchangeRate();
});

getButton.addEventListener("click", e => {
    e.preventDefault(); // Preventing form submission
    getExchangeRate();
});

// Swap currencies
const exchangeIcon = document.querySelector(".droplist .icon");
exchangeIcon.addEventListener("click", () => {
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
});

// Fetch and display exchange rate
function getExchangeRate() {
    const amount = document.querySelector(".amount input");
    const exchangeRateTxt = document.querySelector(".exchangerate");
    let amountVal = amount.value;

    if (amountVal === "" || amountVal === "0") {
        amount.value = "1";
        amountVal = 1;
    }

    exchangeRateTxt.innerText = "Getting exchange rate . . . ";
    let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;

    fetch(url)
        .then(response => response.json())
        .then(result => {
            let exchangeRate = result.conversion_rates[toCurrency.value];
            let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
            exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
        })
        .catch(() => {
            exchangeRateTxt.innerText = "Something went wrong";
        });
}
