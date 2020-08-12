const getBookshelves = async () => {
    const res = await fetch('/api/bookshelves');
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
        let avgRating = ratings.reduce((accum, val) => {
            return accum += Number(val.rating)
        }, 0);
        return avgRating;
    }
    return 'N/A';
}