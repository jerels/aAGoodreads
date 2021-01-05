const reviews = document.getElementById('reviews');
const ratings = document.getElementById('ratings');
const activity = document.querySelector('.activity-content');
const bookshelves = document.querySelector('.bookshelves-container');

async function getUser() {
    const res = await fetch('/api/users/profile');
    const data = await res.json();
    reviews.innerHTML = `${data.numOfReviews} reviews`;
    ratings.innerHTML = `${data.ratingTotal} ratings (${data.reviewAvg} avg)`;
    activity.innerHTML = `Joined in ${data.date}`;
    for (const shelf in data.bookshelfObj) {
        const bookshelf = document.createElement('p');
        bookshelf.setAttribute('class', 'bookshelf');
        bookshelf.innerHTML = `${shelf.toLowerCase()} (${data.bookshelfObj[shelf]})`;
        bookshelves.appendChild(bookshelf);
    };
    console.log(data);
};

getUser();