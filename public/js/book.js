const idContainer = document.querySelector('.hidden');
const id = idContainer.innerHTML;
const cover = document.getElementById('cover');
const title = document.getElementById('title');
const summary = document.getElementById('summary');
const authors = document.getElementById('author');
const series = document.getElementById('series');
const readButton = document.querySelector('.read-button');

async function getBook() {
    const res = await fetch(`/api/books/${id}`);
    const data = await res.json();
    const book = data.book;
    const author = book.Authors[0];
    const seriesData = book.Series;
    const genres = book.Genres;
    const pub = book.Publisher;
    const shelves = book.Bookshelves;

    cover.setAttribute('src', book.cover);
    title.innerHTML = book.title;
    summary.innerHTML = book.summary;
    authors.innerHTML = `By ${author.firstName} ${author.lastName}`;
    series.innerHTML = `(${seriesData.name} Series #${book.id})`;

};

async function getReviews() {
    const res = await fetch(`/api/books/${id}/reviews`);
    const reviews = await res.json();
};

readButton.addEventListener('click', async e => {
    e.preventDefault();
    await fetch(`/api/books/${id}/read`);
    if (res.ok) {
        readButton.innerHTML = "";
        readButton.innerHTML = "Read";
    }

})

getBook();
getReviews();