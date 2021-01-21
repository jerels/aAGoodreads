const id = Number(new URL(window.location).toString().split('/')[4]);
let sent = true;
let rating;
let clickListener = false;

const cover = document.getElementById('cover');
const title = document.getElementById('title');
const summary = document.getElementById('summary');
const authors = document.getElementById('author');
const series = document.getElementById('series');
const reviewContent = document.getElementById('reviews')
const manageShelves = document.querySelector('.select-shelves-placeholder');
const clearButton = document.getElementById('clear-rating');
const form = document.getElementById('form');
const postButton = document.getElementById('submit-button');
const review = document.getElementById('content');
const reviewButton = document.getElementById('review-button');

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
};

async function getReviews() {
    const res = await fetch(`/api/books/${id}/reviews`);
    const data = await res.json();
    const reviews = data.reviews;
    reviews.forEach(review => {
        const revContainer = document.createElement('tr');
        const revContainer2 = document.createElement('td');
        const rev = document.createElement('p');
        const userInfo = document.createElement('p');
        const user = review.User;
        revContainer.setAttribute('id', 'review-row');
        rev.setAttribute('id', 'review');
        userInfo.setAttribute('id', 'user-info');
        userInfo.innerHTML = `- ${user.firstName} ${user.lastName}`;
        rev.innerHTML = review.content;
        reviewContent.appendChild(revContainer);
        revContainer.appendChild(rev);
        revContainer.appendChild(userInfo);
    });

};

const populateShelves = async () => {
    const res = await fetch('/api/bookshelves');
    const data = await res.json();
    const bookshelves = data.bookshelves;
    let shelfStr = '';
    for (const shelf of bookshelves) {
        const bookIds = shelf.Books.map((book) => Number(book.id));
        if (shelf.defaultShelf) {
            const shelfItem = document.getElementById(shelf.name.toLowerCase().split(' ').join('-'));
            shelfItem.value = shelf.id;
            if (bookIds.includes(id)) {
                shelfItem.setAttribute('checked', true);
            }
        } else {
            shelfStr += `<li class='created-shelves__list-item created-shelves__list-item--${shelf.name.toLowerCase()}'>
            <label for='${shelf.name.toLowerCase()}'>${shelf.name}</label>`

            if (!bookIds.includes(id)) {
                shelfStr += `<input type='checkbox' id='${shelf.name}' name='${shelf.name}'>
                </li>`;
            } else {
                shelfStr += `<input type='checkbox' id='${shelf.name}' name='${shelf.name}' checked>
                </li>`;
            }
        }
    }
    document.querySelector('.shelves__dropdown--created-shelves').innerHTML = shelfStr;
}

manageShelves.addEventListener('click', async event => {
    const target = event.target;
    console.log(target.classList.contains('bookshelves-text'));
    if (!target.classList.contains('select-shelves-placeholder') && !target.classList.contains('bookshelves-text') && !target.classList.contains('shelf-arrow-placeholder')) {
        return;
    }
    document.querySelector('.shelve-list-container').classList.toggle('hidden');
    const formData = new FormData(document.querySelector('form'));
    if (sent) {
        sent = false;
    } else {
        sent = true;
        const text = document.querySelector('.bookshelves-text');
        text.innerHTML = 'Saving...';
        text.classList.add('saving');
        document.querySelector('.shelf-arrow-placeholder').innerHTML = '';
        const body = {
        };
        for (let key of formData.keys()) {
            body[key] = formData.get(key);
        }

        const res = await fetch(`/api/books/${id}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (res.ok) {
            window.location.pathname = '/my-books';
        }
    }
})

document.addEventListener('DOMContentLoaded', e => {
    getBook();
    getReviews();
    populateShelves();
    const stars = document.querySelector('.stars');

    const handleReviewButton = e => {
        e.preventDefault();
        form.removeAttribute('hidden');
        reviewButton.setAttribute('disabled', 'true');
    };

    reviewButton.addEventListener('click', handleReviewButton);

    const handleStarMouseover = e => {
        e.stopPropagation();
        const id = e.target.id.split('-')[2];
        if (!/[0-5]$/.test(id)) {
            return;
        } else {
            for (let i = 1; i <= id; i++) {
                document.querySelector(`#star-path-${i}`).classList.add('star-on');
            };
        };
    };

    if (!rating) {
        stars.addEventListener('mouseover', handleStarMouseover);
        clickListener = true;
    }

    const handleStarMouseout = e => {
        e.preventDefault();
        const id = e.target.id.split('-')[2];
        if (e.target.id === 'star-container') {
            setTimeout(() => {
                for (let i = 1; i <= 5; i++) {
                    document.querySelector(`#star-path-${i}`).classList.remove('star-on');
                }
            }, 200);
        } else {
            for (let i = 5; i >= id; i--) {
                document.querySelector(`#star-path-${i}`).classList.remove('star-on');
            };
        };
    };

    stars.addEventListener('mouseout', handleStarMouseout);

    const handleStarClick = e => {
        e.stopPropagation();
        const id = Number(e.target.id.split('-')[2]);
        if (!/[0-5]/.test(id) || !clickListener) {
            return;
        } else {
            if (clickListener) {
                rating = id;
                for (let i = 1; i <= id; i++) {
                    document.querySelector(`#star-path-${i}`).classList.add('star-on-permanent');
                }
                stars.removeEventListener('mouseover', handleStarMouseover);
                clickListener = false;
            }
        }
    };

    stars.addEventListener('click', handleStarClick);

    clearButton.addEventListener('click', e => {
        rating = undefined;
        for (let i = 1; i <= 5; i++) {
            document.querySelector(`#star-path-${i}`).classList.remove('star-on-permanent');
        }
        clickListener = true;
        stars.addEventListener('mouseover', handleStarMouseover);

    });

    postButton.addEventListener('click', async e => {
        debugger;
        e.preventDefault();
        const body = {
            bookId: id,
            content: review.value,
            rating
        };
        const res = await fetch('/api/reviews/', {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (res.ok) {
            form.setAttribute('hidden', 'true');
            window.location.href = `/books/${id}`;
        }
    });
})