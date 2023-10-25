function fetchPacks() {
    fetch('http://localhost:3000/pack')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const packsList = document.getElementById('packs-list');
            packsList.innerHTML = '';
            data.data.forEach(pack => {
                const listItem = document.createElement('li');
                listItem.textContent = `${pack.name} created by User ID ${pack.user_ID}`;
                packsList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Fetching error:', error);
        });
}

fetchPacks();
