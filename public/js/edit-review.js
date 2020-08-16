const bookId = new URL(window.location).toString().split('/')[6];
let rating;

const getBook = async () => {
    const res = await fetch(`/api/books/${bookId}`);
    const data = await res.json();
    return data.book;
};

const getReview = async () => {
    const res = await fetch(`/api/reviews/${bookId}`);
    const data = await res.json();
    return data.review;
}

const getCreatedShelves = async () => {
    const res = await fetch('/api/bookshelves/createdShelves');
    const data = await res.json();
    return data.bookshelves;
}

const populateBookContent = async () => {
    const book = await getBook();

    const header = document.querySelector('.body-header-container__item');
    header.innerHTML = `<a href='/books/${bookId}'>${book.title}</a> &gt; Edit Review`;

    const cover = document.querySelector('.book-container__item--cover').src = book.cover;
};

const populateReviewContent = async () => {
    const review = await getReview();
    document.querySelector('.review-container__item--content').value = review.content;
    rating = review.rating;
};

const populateCreatedShelves = async () => {
    const bookshelves = await getCreatedShelves();
    let shelfStr = '';
    for (const shelf of bookshelves) {
        shelfStr += `<li class='created-shelves__list-item created-shelves__list-item--${shelf.name.toLowerCase()}'>
        <label for='${shelf.name.toLowerCase()}'>${shelf.name}</label>
        <input type='checkbox' id='${shelf.name.toLowerCase()}' name='${shelf.name.toLowerCase()}'>
        </li>`
    }

    document.querySelector('.shelves__dropdown--created-shelves').innerHTML = shelfStr;
}


document.addEventListener('DOMContentLoaded', event => {
    populateBookContent();
    populateReviewContent();
    populateCreatedShelves();

    document.querySelector('.stars').addEventListener('click', event => {
        event.stopPropagation();
        if (!/[0-5]+/.test(event.target.id.split('-')[1])) {
            return;
        } else {
            rating = Number(event.target.id.split('-')[1]);
            console.log(rating);
        }
    });

    document.querySelector('.shelf-arrow-placeholder').addEventListener('mouseenter', event => {
        document.querySelector('.shelve-list-container').classList.remove('hidden');
    })

    const form = document.querySelector('form');
    form.addEventListener('submit', async event => {
        event.preventDefault();
        const formData = new FormData(form);
        const body = {
            bookId,
            content: formData.get('content'),
            rating
        }
        const res = await fetch('/api/reviews', {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (res.ok) {
            window.location.href = '/my-books'
        }
    });
});