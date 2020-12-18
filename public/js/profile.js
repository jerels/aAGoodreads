async function getUser() {
    const res = await fetch('/api/users/profile');

};

getUser();