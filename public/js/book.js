const idContainer = document.querySelector('.hidden');
const id = idContainer.innerHTML;
async function getBook() {
    const res = await fetch(`/api/books/${id}`);
    console.log(res);
    const book = await res.json();
    console.log(book);
}

getBook();