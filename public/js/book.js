const idContainer = document.querySelector('.hidden');
const id = idContainer.innerHTML;
const cover = document.getElementById('cover');
const title = document.getElementById('title');
const summary = document.getElementById('summary');
async function getBook() {
    const res = await fetch(`/api/books/${id}`);
    const data = await res.json();
    const book = data.book;
    console.log(book);
    cover.setAttribute('src', book.cover);
    title.innerHTML = book.title;
    summary.innerHTML = book.summary;
};

getBook();