async function getUser() {
    const res = await fetch('/api/users/profile');
    const data = await res.json();
    console.log(data);
};

getUser();