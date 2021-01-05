const reviews = document.getElementById('reviews');
const ratings = document.getElementById('ratings');
const activity = document.querySelector('.activity-content');

async function getUser() {
    const res = await fetch('/api/users/profile');
    const data = await res.json();
    reviews.innerHTML = `${data.numOfReviews} reviews`;
    ratings.innerHTML = `${data.ratingTotal} ratings (${data.reviewAvg} avg)`;
    activity.innerHTML = `Joined in ${data.date}`;
    console.log(data);
};

getUser();