const browseType = window.location.pathname.toString().split('/')[2];
let bookshelves;
let books;

async function getBooks() {
    const res = await fetch('/api/books/');
    const data = await res.json()
    return data;
}

async function getShelves() {
    const res = await fetch('/api/bookshelves');
    const data = await res.json();
    return data;
}

function getAvgRating(reviews) {
    // Filter out reviews with no rating
    let ratings = reviews.map((review) => review.rating).filter((rating) => rating >= 1);
    if (ratings.length) {
        let avgRating = ratings.reduce((accum, val) => accum += val) / ratings.length;
        return `avg rating ${avgRating.toFixed(1)}`;
    } else {
        return "This book has no ratings";
    }
}

function genList(books) {
    let bodyStr = '';
    books.map((book) => {
        let rowArr = ['<div class="book-list-item">'];

        rowArr.push(
            `<img class="book-list-item__cover" src='${book.cover}' />`
        );

        let authorList = '<span>';

        if (book.Authors.length > 2) {
            let lastAuthor = book.Authors[book.Authors.length - 1];
            authorList += book.Authors.slice(0, book.Authors.length - 1).map((author) => {
                return `<a href='/browse/authors/${id}>${author.firstName + " " + author.lastName}</a>`;
            }).join(', ');
            authorList += `, and <a href='/browse/authors/${lastAuthor.id}>${lastAuthor.firstName + " " + lastAuthor.lastName}</a>`;
        } else if (book.Authors.length == 2) {
            authorList += book.Authors.map((author) => {
                return `<a href='/browse/authors/${author.id}>${author.firstName + " " + author.lastName}</a>`;
            }).join(" and ");
        } else {
            authorList += `<a href='/browse/authors/${book.Authors[0].id}'>${book.Authors[0].firstName + " " + book.Authors[0].lastName}</a>`;
        }
        authorList += '</span>';

        rowArr.push(
            `<div class='book-list-item__text-container'>
                <h3><a href='/books/${book.id}'>${book.title}</a></h3>
                <div>
                    <span>by </span>${authorList}
                </div>
                <div>
                    <span>${getAvgRating(book.Reviews)} - published by ${book.Publisher.name}</span>
                </div>
            </div>`
        )


        rowArr.push(
            `<div class='body-shelves-container' id='select-shelves-placeholder-${book.id}'>
                <span class='bookshelves-text'>Manage Bookshelves</span><span class='self-arrow-placeholder'>▾</span>
                <form id='book-${book.id}-shelves'>
                    <div class='shelve-list-container-hidden'>
                        ${genDefaultShelves(book, bookshelves)}
                        ${genCreatedShelves(book, bookshelves)}
                    </div>
                </form>
            </div>`
        );

        console.log(rowArr);

        rowArr.push('</div>');

        bodyStr += rowArr.join('');
    })
    return bodyStr;
}

function genDefaultShelves(book, bookshelves) {
    const resultArr = ['<ul>'];

    for (const shelf of bookshelves) {
        if (shelf.defaultShelf) {
            const bookIds = shelf.Books.map((book) => book.id);
            let shelfStr = '<li>';
            let forAndId = shelf.name.split(" ").join('-').toLowerCase();

            shelfStr += `<label>${shelf.name}</label>`;

            if (bookIds.includes(book.id)) {
                shelfStr += `
                <input type='radio' id='${forAndId}-${book.id}' name='defaultShelf' value='${shelf.id}' checked />
                </li>`
            } else {
                shelfStr += `
                <input type='radio' id='${forAndId}-${book.id}' name='defaultShelf' value='${shelf.id}' /></li>`
            }

            resultArr.push(shelfStr);
        }
    }
    return resultArr.join("");
}

function genCreatedShelves(book, bookshelves) {
    const resultArr = ['<ul>'];

    for (const shelf of bookshelves) {
        if (!shelf.defaultShelf) {
            const bookIds = shelf.Books.map((book) => book.id);
            let shelfStr = '<li>';
            let forAndId = shelf.name.split(" ").join('-').toLowerCase();

            shelfStr += `<label>${shelf.name}</label>`;

            if (bookIds.includes(book.id)) {
                shelfStr += `<input type='checkbox' id='${forAndId}-${book.id}' name='${forAndId}-${book.id}' value='${shelf.id}' checked/></li>`;
            } else {
                shelfStr += `<input type='checkbox' id='${forAndId}-${book.id}' name='${forAndId}-${book.id}' value='${shelf.id}' /></li>`;
            }

            resultArr.push(shelfStr);
        }
    }

    resultArr.push('</ul>');
    return resultArr.join("");
}

getShelves().then(shelveData => bookshelves = shelveData.bookshelves);

getBooks().then(data => {
    document.querySelector('.book-list').innerHTML = genList(data.books);
});

document.addEventListener('DOMContentLoaded', event => {
    document.querySelector('.browse-header').innerText = `Browse by ${browseType.slice(0, browseType.length - 1)}`;
})
