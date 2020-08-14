const [http, host, post, main, sub] = new URL(window.location).toString().split('/');

document.addEventListener('DOMContentLoaded', () => {
    const search = document.getElementById("myInput");
    search.addEventListener('keyup', async (event) => {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            event.preventDefault();
            const res = await fetch(`/browse/${sub}/${search.value}`);
            if (res.ok) {
                window.location.href = `/browse/${sub}/${search.value}`;
            }
        }
    });
})
