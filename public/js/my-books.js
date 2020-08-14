const [,,,,, shelfId] = new URL(window.location).toString().split('/');

const getBookshelves = async () => {
    const res = await fetch('/api/bookshelves');
    const data = await res.json();

    return data.bookshelves;
}
const getBooksCount = async () => {
    const res = await fetch('/api/bookshelves/book-count');
    const data = await res.json();
    return data.count;
}
const getMyBooksData = async () => {
    let res;
    let data;

    if (!shelfId) {
        res = await fetch('/api/bookshelves/data');
        data = await res.json();
    } else {
        res = await fetch(`/api/bookshelves/data/${shelfId}`);
        data = await res.json();
    }
    return data;
}

const getAvgRating = async (book) => {
    // Fetch all ratings of book by id
    const res = await fetch(`/api/books/${book.id}/reviews`);
    const data = await res.json();

    // Generate array of reviews only if rating isn't empty
    let ratings = data.reviews.filter((obj) => obj.rating !== null);
    if (ratings.length > 0) {
        let avgRating = Number.parseFloat(ratings.reduce((accum, val) => {
            return accum += Number(val.rating)
        }, 0) / ratings.length).toPrecision(2);
        return avgRating;
    }
    return 'N/A';
}

const authors = (authors) => {
    let authorStr = '';

    for (author of authors) {
        authorStr += `<li>${author.lastName}, ${author.firstName}</li>`;
    }

    return authorStr;
}

const shelvesGen = (bookshelves) => {
    let shelveArr = bookshelves.map((bookshelf) => {
        return { id: bookshelf.id, name: bookshelf.name }
    }).sort((a, b) => {
        // Sorting shelf names alphabetically
        let nameA = a.name.toUpperCase();
        let nameB = b.name.toUpperCase();

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        return 0;
    });
    let shelveStr = '';
    for (shelf of shelveArr) {
        shelveStr += `<li><a href='my-books/bookshelf/${shelf.id}'>${shelf.name}</a></li>`;
    }

    return shelveStr;
}

const editOrWriteReview = (book) => {
    let linkStr = '';

    if (!book.Reviews.length) {
        return `<a href='/books/${book.id}/review'>Write a review</a>`
    }

    return `<a href='/books/${book.id}/review'>Edit your review</a>`;
}

const readDate = (book) => {
    let shelveArr = book.Bookshelves.map((bookshelf) => {
        return {
            bookId: book.id,
            name: bookshelf.name,
            readDate: bookshelf.BookBookshelf.createdAt
        }
    });

    for (shelf of shelveArr) {
        if (shelf.name === 'Read') {
            return new Date(shelf.readDate).toLocaleString('US-en', { year: 'numeric', month: 'long', day: 'numeric' });
        }
    }

    return 'N/A';
}

const dateAdded = (book) => {
    let shelveArr = book.Bookshelves.map((bookshelf) => {
        return {
            bookId: book.id,
            name: bookshelf.name,
            readDate: bookshelf.BookBookshelf.createdAt
        }
    });

    for (shelf of shelveArr) {
        return new Date(shelf.readDate).toLocaleString('US-en', { year: 'numeric', month: 'long', day: 'numeric' });
    }
}

const populatePageContent = async () => {
    // Get bookshelves
    const bookshelves = await getBookshelves();

    // Get all books count
    const count = await getBooksCount();

    // Get related books
    const myBooksData = await getMyBooksData();

    // Populate the Bookshelf list
    const defaultShelfList = document.querySelector('.default__item--list');
    const addedShelfList = document.querySelector('.content__added-bookshelves--list');

    let defaultShelfStr = `<li class='defaults__list-item defaults__list-item--0'>
    <a class='defaults__list-item-link defaults__list-item-link--link-0' href='/my-books'>All (${count})</a>
    </li>`;
    let addedShelfStr = '';

    for (bookshelf of bookshelves) {
        if (bookshelf.defaultShelf) {
            defaultShelfStr += `
            <li class='defaults__list-item defaults__list-item--${bookshelf.id}'>
            <a class='defaults__list-item-link defaults__list-item-link--link-${bookshelf.id}' href='/my-books/bookshelf/${bookshelf.id}'>${bookshelf.name} (${bookshelf.Books.length})</a>
            </li>`;
        } else {
            addedShelfStr += `
            <li class='added__list-item added__list-item--${bookshelf.id}'>
            <a class='added__list-item-link added__list-item-link--link-${bookshelf.id}' href='/my-books/bookshelf/${bookshelf.id}'>${bookshelf.name} (${bookshelf.Books.length})</a>
            </li>`
        }
    }

    // Populate table filter header
    const filterHeader = document.querySelector('.book-table__shelf-name');
    if (shelfId) {
        filterHeader.innerHTML = bookshelves.filter((shelf) => shelf.id === parseInt(shelfId))[0].name;
    } else {
        filterHeader.innerHTML = 'All';
    }

    // Populate table
    const booksTable = document.querySelector('tbody');

    let bookStr = '';

    for (book of myBooksData.books) {
        const rating = book.Reviews[0].rating;
        bookStr += `<tr>
        <td class='cover-cell'><img class='cover' src='${book.cover}'></td>
        <td class='title-cell'><a href='/books/${book.id}'>${book.title}</a></td>
        <td>${authors(book.Authors)}</td>
        <td>${await getAvgRating(book)}</td>
        <td>${rating ? rating : 'N/A'}</td>
        <td>${shelvesGen(book.Bookshelves)}</td>
        <td>${editOrWriteReview(book)}</td>
        <td>${readDate(book)}</td>
        <td>${dateAdded(book)}</td>
        <td><button id='delete-book-${book.id}' type='button'>Remove from My Books</button></td>
        </tr>`;
    }

    defaultShelfList.innerHTML = defaultShelfStr;
    addedShelfList.innerHTML = addedShelfStr;
    booksTable.innerHTML = bookStr;

}

populatePageContent();
getBooksCount();

document.addEventListener('DOMContentLoaded', () => {
    const addBookshelfForm = document.querySelector('.add-bookshelf-form');
    addBookshelfForm.addEventListener('submit', async event => {
        event.preventDefault();
        const formData = new FormData(addBookshelfForm);
        const body = { name: formData.get('bookshelfName') };

        const res = await fetch('/api/bookshelves', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (res.ok) {
            location.reload();
        } else {
            const data = await res.json();
            alert(data.errors[0]);
        }

        return;
    });

    const table = document.querySelector('.book-table__item--table');
    table.addEventListener('click', async event => {
        if (!/delete-book-\d+/.test(event.target.id)) {
            return;
        }
        const [, , id] = event.target.id.split('-');

        const res = await fetch(`/api/bookshelves/book/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (res.ok) {
            location.reload();
        }
    })
});