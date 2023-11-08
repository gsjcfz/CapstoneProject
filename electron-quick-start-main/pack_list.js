function addPack(name) {
    // This will be the container that will contain the new pack
    const packContainer = document.getElementById("pack_container");

    // This div will hold the button that represents the pack
    const newDiv = document.createElement("div");
    // This is the button that will represent the pack
    const newButton = document.createElement("button");
    newButton.className = "pack";
    const packName = document.createTextNode(name)
    newButton.appendChild(packName)
    // This is the base div for the progress bar
    const newProgressBar = document.createElement("div");
    newProgressBar.className = "pack-progress-bar";
    // This is the div that represents the user's score for this pack
    const newProgress = document.createElement("div");
    newProgress.className = "progress";

    // Now we append up the list
    newProgressBar.appendChild(newProgress)
    newButton.appendChild(newProgressBar)
    newDiv.appendChild(newButton)
    packContainer.appendChild(newDiv)
}

document.addEventListener('DOMContentLoaded', async function(event) {
    const mc_modal = document.getElementById('mc_modal');

    // We load in all the pack data here
    await fetch('http://localhost:3000/pack', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem('accessToken')
        }
    })
        .then(response => response.json())
        .then(data => {
            // Remove our skeleton packs
            const skeletons = document.querySelectorAll(".skeleton");
            for (let i = 0; i < skeletons.length; i++) {
                skeletons.item(i).remove();
            }
            // Add the pack data
            for (let i = 0; i < data.data.length; i++) {
                let obj = data.data[i];
        
                addPack(obj.name);
            }
        });
    
});
document.getElementById('return_to_menu').addEventListener('click', () => {
    window.myAPI.send('navigate', 'main_menu');
});
