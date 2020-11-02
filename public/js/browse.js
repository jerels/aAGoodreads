let books;

const getBooks = async () => {
    const res = await fetch('/api/books/');
    const data = await res.json()
    return data;
}

const genRows = (books) => {
    console.log(books);
    let bodyStr = '';
    books.map((book) => {
        let rowArr = ['<tr>'];

        // Generate cover image cell
        rowArr.push(
            `<td class='cover'><img src='${book.cover}'/></td>`
        );

        // Generate book title cell
        rowArr.push(
            `<td><a href='/books/${book.id}'>${book.title}</a></td>`
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

        // Add genre for book
        if (book.Genres.length == 2) {
            rowArr.push(
                '<td>' + book.Genres.map((genre) => genre.name).join(" and ") + '</td>'
            );
        } else if (book.Genres.length > 2) {
            let lastGenre = book.Genres[book.Genres.length - 1];
            rowArr.push(
               '<td>' + book.Genres.map((genre) => genre.name).slice(0, book.Genres.length - 1).join(', ') + ", and " + lastGenre.name + '</td>'
            );
        } else {
            rowArr.push(
                '<td>' + book.Genres[0].name + '</td>'
            );
        }

        // Add publisher for book
        rowArr.push(
            `<td>${book.Publisher.name}</td>`
        )

        rowArr.push('</tr>')

        bodyStr += rowArr.join('');
    })
    return bodyStr;
}

getBooks().then(data => {
    document.querySelector('tbody').innerHTML = genRows(data.books);
});