const form = document.querySelector(".search__form");
let resultsContainer = document.querySelector(".search__findings-list");
const countContainer = document.querySelector(".search__findings");
const errorContainer = document.querySelector(".search__error");
form.addEventListener("submit", onSubmit);

const renderError = () => {
  errorContainer.innerHTML = `
        <img src="https://code.s3.yandex.net/web-code/entrance-test/search.svg" alt="" class="search__error-icon" />
        <p class="search__error-message">
            Произошла ошибка...
        </p>
  `;
  countContainer.innerHTML = "";
};

const renderEmptyResults = () => {
  errorContainer.innerHTML = `
        <img src="https://code.s3.yandex.net/web-code/entrance-test/search.svg" alt="" class="search__error-icon" />
        <p class="search__error-message">
            По вашему запросу ничего не найдено, попробуйте уточнить запрос
        </p>
  `;
  countContainer.innerHTML = "";
};

const renderCount = (count) => {
  countContainer.innerHTML = `
      Найдено <span class="search__findings-amount">${count.toLocaleString(
        "ru-RU"
      )}</span> результатов
  `;
};

const onSubmitStart = () => {
  countContainer.innerHTML = `Загрузка...`;
  resultsContainer.innerHTML = "";
  errorContainer.innerHTML = "";
};

function template(item) {
  const newElement = document.createElement("li");
  newElement.classList.add("search__finding-item");
  newElement.innerHTML = `
  <div><a href =${item.html_url} target = 'blank' class="search__finding-link">${item.full_name}</a></div>
  <span class="search__finding-description">${item.description}</span>
	`;
  return newElement;
}

async function onSubmit(event) {
  const lookingFor = event.target.getElementsByClassName("search__textfield")[0]
    .value;
  console.log(lookingFor);
  const url = `https://api.nomoreparties.co/github-search?q=${lookingFor}`;
  onSubmitStart();

  fetch(url)
    .then((res) => res.json())
    // .then((json) => console.log(json)) // {total_count: 696, incomplete_results: false, items: Array(30)}
    .then((json) =>
      json.total_count > 0
        ? renderCount(json.total_count) +
          json.items.map(
            (el) => (resultsContainer.innerHTML += template(el).innerHTML)
          )
        : renderEmptyResults()
    )
    .catch(() => renderError());
  event.preventDefault();
}
