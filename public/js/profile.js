const reviews = document.getElementById('reviews');
const ratings = document.getElementById('ratings');
const activity = document.querySelector('.activity-content');
const bookshelves = document.querySelector('.bookshelves-container');
const userName = document.querySelector('.username');
const bookshelfTitle = document.querySelector('.bookshelves-header');

async function getUser() {
    const res = await fetch('/api/users/profile');
    const data = await res.json();
    userName.innerHTML = data.name;
    reviews.innerHTML = `${data.numOfReviews} reviews`;
    ratings.innerHTML = `${data.ratingTotal} ratings (${data.reviewAvg} avg)`;
    activity.innerHTML = `Joined in ${data.date}`;
    const nameArr = data.name.split(' ');
    bookshelfTitle.innerHTML = `${nameArr[0].toUpperCase()}'S BOOKSHELVES`;
    for (const shelf in data.bookshelfObj) {
        const bookshelf = document.createElement('p');
        bookshelf.setAttribute('class', 'bookshelf');
        bookshelf.innerHTML = `${shelf.toLowerCase()} (${data.bookshelfObj[shelf]})`;
        bookshelves.appendChild(bookshelf);
    };
};

getUser();