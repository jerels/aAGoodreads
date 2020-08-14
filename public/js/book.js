const idContainer = document.querySelector('.hidden');
const id = idContainer.innerHTML;
const cover = document.getElementById('cover');
const title = document.getElementById('title');
const summary = document.getElementById('summary');
const authors = document.getElementById('author');
const series = document.getElementById('series');
const readButton = document.querySelector('.read-button');
const reviewContainer = document.querySelector('.review-container');

async function getBook() {
    const res = await fetch(`/api/books/${id}`);
    const data = await res.json();
    const book = data.book;
    const userId = data.userId;
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
    shelves.forEach(shelf => {
        if (shelf.name === 'Read' && shelf.userId === userId) {
            readButton.innerHTML = 'Read';
            readButton.classList.add('green-button');
            readButton.disabled = true;
        } else {
            readButton.innerHTML = 'Already Read?';
        }
    })
};

async function getReviews() {
    const res = await fetch(`/api/books/${id}/reviews`);
    const data = await res.json();
    const reviews = data.reviews;
    reviews.forEach(review => {
        const rev = document.createElement('div');
        const userInfo = document.createElement('div');
        const user = review.User;
        rev.setAttribute('id', 'review');
        userInfo.setAttribute('id', 'user-info');
        userInfo.innerHTML = `- ${user.firstName} ${user.lastName}`;
        rev.innerHTML = review.content;
        rev.appendChild(userInfo);
        reviewContainer.appendChild(rev);
    });

};

readButton.addEventListener('click', async e => {
    e.preventDefault();
    await fetch(`/api/books/${id}/read`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    readButton.innerHTML = 'Read';
    readButton.classList.add('green-button');
    readButton.disabled = true;

});

getBook();
getReviews();