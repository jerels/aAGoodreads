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
}


document.addEventListener('DOMContentLoaded', event => {
    populateBookContent();
    populateReviewContent();

    document.querySelector('.stars').addEventListener('click', event => {
        event.stopPropagation();
        if (!/[0-5]+/.test(event.target.id.split('-')[1])) {
            return;
        } else {
            rating = Number(event.target.id.split('-')[1]);
            console.log(rating);
        }
    });

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