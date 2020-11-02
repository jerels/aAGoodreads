let books;

async function getBooks() {
    const res = await fetch('/api/books/');
    const data = await res.json()
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
    console.log(books);
    let bodyStr = '';
    books.map((book) => {
        let rowArr = ['<div>'];

        rowArr.push(
            `<img src='${book.cover}' />`
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

        rowArr.push (
            `<div>
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

        );

        console.log(rowArr);

        rowArr.push('</div>');

        bodyStr += rowArr.join('');
    })
    return bodyStr;
}

getBooks().then(data => {
    document.querySelector('.book-list').innerHTML = genList(data.books);
});