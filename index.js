const APIURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=b6cac70eb852bb91a229705eb87a3216&page=1";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=b6cac70eb852bb91a229705eb87a3216&query=";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const sort = document.getElementById("sort");
const filter = document.getElementById("filter");

let moviesData = [];

// Function to fetch movies from the API
async function getMovies(url) {
    const resp = await fetch(url);
    const respData = await resp.json();
    moviesData = respData.results;
    showMovies(moviesData);
}

// Function to display movies on the webpage
function showMovies(movies) {
    main.innerHTML = "";

    movies.forEach((movie) => {
        const { poster_path, title, vote_average, overview } = movie;

        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");

        movieEl.innerHTML = `
            <img
                src="https://image.tmdb.org/t/p/w1280${poster_path}"
                alt="${title}"
            />
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview:</h3>
                ${overview}
            </div>
        `;

        main.appendChild(movieEl);
    });
}

// Function to get CSS class based on movie rating
function getClassByRate(vote) {
    if (vote >= 8) {
        return "green";
    } else if (vote >= 5) {
        return "orange";
    } else {
        return "red";
    }
}

// Event listener for form submission (search)
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = search.value.trim();
    const searchUrl = searchTerm ? `${SEARCHAPI}${searchTerm}` : APIURL;
    getMovies(searchUrl);
    search.value = "";
});

function sortMoviesAlphabetically(order) {
    moviesData.sort((a, b) => {
        const titleA = a.title.toUpperCase();
        const titleB = b.title.toUpperCase();
        if (order === "asc") {
            if (titleA < titleB) return -1;
            if (titleA > titleB) return 1;
        } else {
            if (titleA > titleB) return -1;
            if (titleA < titleB) return 1;
        }
        return 0;
    });
}

// Event listener for sorting dropdown
sort.addEventListener("change", () => {
    const selectedSort = sort.value;

    // Sort movies based on selected criteria
    if (selectedSort === "popularity.desc") {
        moviesData.sort((a, b) => b.popularity - a.popularity); // Sort by popularity in descending order
    } else if (selectedSort === "popularity.asc") {
        moviesData.sort((a, b) => a.popularity - b.popularity); // Sort by popularity in ascending order
    } else if (selectedSort === "vote_average.desc") {
        moviesData.sort((a, b) => b.vote_average - a.vote_average); // Sort by rating in descending order
    } else if (selectedSort === "vote_average.asc") {
        moviesData.sort((a, b) => a.vote_average - b.vote_average); // Sort by rating in ascending order
    } else if (selectedSort === "az") {
        sortMoviesAlphabetically("asc"); // Sort alphabetically from A to Z
    } else if (selectedSort === "za") {
        sortMoviesAlphabetically("desc"); // Sort alphabetically from Z to A
    }

    // Display sorted movies
    showMovies(moviesData);
});

// Event listener for filtering dropdown
filter.addEventListener("change", () => {
    const selectedGenre = filter.value;
    const genreUrl = selectedGenre ? `${APIURL}&with_genres=${selectedGenre}` : APIURL;
    getMovies(genreUrl);
});

// Initialize the app by fetching movies when the page loads
getMovies(APIURL);
