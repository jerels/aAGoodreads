const getBookshelves = async () => {
    const res = await fetch('/api/bookshelves');
    const data = await res.json();
    return data.bookshelves;
}

const getMyBooksData = async () => {
    const res = await fetch('/api/bookshelves/data');
    const data = await res.json();
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
        }, 0)/ratings.length).toFixed(2);
        return avgRating;
    }
    return 'N/A';
}

const shelveListGen = (bookshelves) => {
    let shelveArr = bookshelves.map((bookshelf) => bookshelf.name);
    let shelveStr = '';
    for (shelf of shelveArr) {
        shelveStr += `<li>${shelf}</li>`;
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

const populatePageContent = async () => {
    // Get bookshelves
    const bookshelves = await getBookshelves();
    // Get related books
    const myBooksData = await getMyBooksData();

    // Populate the Bookshelf list
    const bookshelfList = document.querySelector('.defaults__item--list');

    let bookshelfStr = `<li class='defaults__list-item defaults__list-item--0'>
    <a class='defaults__list-item-link defaults__list-item-link--link-0' href='/my-books'>All (${myBooksData.books.length})</a>
    </li>`;

    for (bookshelf of bookshelves) {
        bookshelfStr += `
        <li class='defaults__list-item defaults__list-item--${bookshelf.id}'>
        <a class='defaults__list-item-link defaults__list-item-link--link-${bookshelf.id}' href='/my-books/bookshelf/${bookshelf.id}'>${bookshelf.name} (${bookshelf.Books.length})</a>
        </li>`;
    }

    bookshelfList.innerHTML = bookshelfStr;

    // Populate table
    const booksTable = document.querySelector('tbody');

    let bookStr = '';

    for (book of myBooksData.books) {
        console.log(book);
        const rating = book.Reviews[0].rating;
        bookStr += `<tr>
        <td><img src='${book.cover}'></td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${await getAvgRating(book)}</td>
        <td>${rating ? rating : 'N/A'}</td>
        <td>${shelveListGen(book.Bookshelves)}</td>
        <td>${editOrWriteReview(book)}</td>
        </tr>`;
    }

    booksTable.innerHTML = bookStr;

}

populatePageContent();