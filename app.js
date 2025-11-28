const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

// theme toggler elements
const themeToggler = document.getElementById("theme-toggler");
const body = document.body;

async function searchWikipeida(query) {
    const encodedQuery = encodeURIComponent(query);
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${encodedQuery}`;

    const reponse = await fetch(endpoint);

    if (!reponse.ok) {
        throw new Error("failed to fetch search results form wikipedia api.");
    }

    const json = await reponse.json();
    return json;
}

function displayResults(results) {
    // remove loader
    searchResults.innerHTML = "";

    results.forEach((result) => {
        const url = `https://en.wikipedia.org/?curid=${results.pageid}`;
        const titleLink = `<a href="${url}" target="_blank" rel="noopener">${result.title} </a>`;
        const urlLink = `<a href="${url} class="result-link" target="_blank" rel="noopener">${url}</a>`;

        const resultItem = document.createElement("div");
        resultItem.className = "result-item";
        resultItem.innerHTML = `
        <h3 class="result-title">${titleLink}</h3>
        ${urlLink}
        <p class="result-snippet">${result.snippet}</p>
        `;

        searchResults.appendChild(resultItem);
    });
}

searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const query = searchInput.value.trim();

    if (!query) {
        searchResults.innerHTML = "<p>please enter a valid search. </p>";
        return;
    }

    if (body.classList.contains("dark-theme")) {
        searchResults.innerHTML = '<div class="loader-dark"></div>';
    } else {
        searchResults.innerHTML = '<div class="loader-light"></div>';
    }



    try {
        const results = await searchWikipeida(query);

        if (results.query.searchinfo.totalhits === 0) {
            searchResults.innerHTML = "<p>no results found. </p>";
        } else {
            displayResults(results.query.search);
        }
    } catch (error) {
        console.error(error);
        searchResults.innerHTML = `<p>an error occured while searching. please try again later. </p>`;
    }
});

// event listener for theme toggler
themeToggler.addEventListener("click", () => {
    body.classList.toggle("dark-theme");
    if (body.classList.contains("dark-theme")) {
        themeToggler.textContent = "dark";
        themeToggler.style.background = "#fff";
        themeToggler.style.color = "#121212";
    } else {
        themeToggler.textContent = "light";
        themeToggler.style.border = "2px solid #ccc";
        themeToggler.style.color = "#121212";
    }
});