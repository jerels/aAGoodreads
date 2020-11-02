let books;

const getBooks = async () => {
    const res = await fetch('/api/books/');
    const data = await res.json()
    return data;
}

const genRows = (books) => {
    let bodyStr = '';
    books.map((book) => {
        let rowArr = ['<tr>'];

        // Generate cover image cell
        rowArr.push(
            `<td class='cover'><img src='${book.cover}'/></td>`
        );

        // Generate book title cell
        rowArr.push(
            `<a href='/books/${book.id}'>${book.title}</a>`
        );

        // Generate authors for each book
        if (book.Authors.length == 2) {
            rowArr.push(
                '<td>' + book.Authors.map((author) => author.firstName + " " + author.lastName).join(" and ") + '</td>'
            );
        } else if (book.Authors.length > 2) {
            let lastAuthor = book.Authors[book.Authors.length - 1];
            rowArr.push(
               '<td>' + book.Authors.map((author) => author.firstName + " " + author.lastName).slice(0, book.Authors.length - 1).join(', ') + ", and " + lastAuthor.firstName + " " + lastAuthor.lastName + '</td>'
            );
        } else {
            rowArr.push(
                '<td>' + book.Authors[0].firstName + " " + book.Authors[0].lastName + '</td>'
            );
        }

        // Add series for book
        rowArr.push(
            `<td>${book.Series.name}</td>`
        );

        // Add publisher for book
        rowArr.push(
            `<td>${book.Publisher.name}</td>`
        )

        rowArr.push('</tr>')

        bodyStr += rowArr.join('');
    })
    return bodyStr;
}

getBooks().then(books => {
    const { books: bookData } = books;
    genRows(bookData);
});