const [, , browseType] = window.location.pathname.toString().split('/');

const shelveText = document.getElementsByClassName('bookshelves-text');

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

function genList(books, bookshelves) {
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
                <span id='bookshelves-text-${book.id}' class='bookshelves-text'>Manage Bookshelves<span class='self-arrow-placeholder'>▾</span></span>
                <form id='book-${book.id}-shelves'>
                    <div id='shelve-list-container-${book.id}' class='shelve-list-container hidden'>
                        ${genDefaultShelves(book, bookshelves)}
                        ${genCreatedShelves(book, bookshelves)}
                    </div>
                </form>
            </div>`
        );

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
    resultArr.push('</ul>')

    return resultArr.join("");
}

function genCreatedShelves(book, bookshelves) {
    const resultArr = ['<ul>'];

    for (const shelf of bookshelves) {
        if (!shelf.defaultShelf) {
            const bookIds = shelf.Books.map((book) => book.id);
            let shelfStr = '<li>';

            shelfStr += `<label>${shelf.name}</label>`;

            if (bookIds.includes(book.id)) {
                shelfStr += `<input type='checkbox' id='${shelf.name}-${book.id}' name='createdShelf' value='${shelf.id}' checked/></li>`;
            } else {
                shelfStr += `<input type='checkbox' id='${shelf.name}-${book.id}' name='createdShelf' value='${shelf.id}' /></li>`;
            }

            resultArr.push(shelfStr);
        }
    }

    resultArr.push('</ul>');
    return resultArr.join("");
}

function compareState(state1, state2) {
    console.log(state1, state2);
    if (typeof state1 === 'string' && typeof state2 === 'string') {
        return state1 !== state2;
    }

    if (state1.length !== state2.length) {
        return true
    }

    return !state1.every((val) => state2.includes(val));
}

document.addEventListener('DOMContentLoaded', async event => {
    const bookRes = await fetch('/api/books/');
    let { books } = await bookRes.json();

    const shelfRes = await fetch('/api/bookshelves/');
    let { bookshelves } = await shelfRes.json();

    let prevState;


    document.querySelector('.browse-header').innerText = `Browse by ${browseType.slice(0, browseType.length - 1)}`;
    document.querySelector('.book-list').innerHTML = genList(books, bookshelves);

    for (const shelf of shelveText) {


        shelf.addEventListener('click', async event => {
            const [, , bookId] = event.target.id.split('-');
            const originalInnerHTML = `Manage Bookshelves<span class='self-arrow-placeholder'>▾</span>`;

            const formData = new FormData(document.getElementById(`book-${bookId}-shelves`));
            console.log(prevState);

            const shelveListContainer = document.getElementById(`shelve-list-container-${bookId}`);
            shelveListContainer.classList.toggle('hidden');

            if (!shelveListContainer.classList.contains('hidden')) {
                prevState = {
                    defaultShelf: formData.getAll('defaultShelf'),
                    createdShelf: formData.getAll('createdShelf')
                }
            }

            else {

                const body = {};
                for (let key of formData.keys()) {
                    body[key] = formData.getAll(key);
                }

                if (compareState(prevState['defaultShelf'], body['defaultShelf']) || compareState(prevState['createdShelf'], body['createdShelf'])) {
                    event.target.innerHTML = 'Saving...';
                    event.target.classList.add('no-pointer-events');

                    const res = await fetch(`/api/books/${bookId}`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(body)
                    });


                    const { book } = await res.json();

                    if (res.ok) {

                        const shelfRes = await fetch('/api/bookshelves');
                        const { bookshelves } = await shelfRes.json();

                        setTimeout(() => {
                            shelveListContainer.innerHTML = genDefaultShelves(book, bookshelves) + genCreatedShelves(book, bookshelves);
                            event.target.innerHTML = originalInnerHTML;
                            event.target.classList.remove('no-pointer-events');
                        }, 250);
                    }
                }
            }
        });
    }

});