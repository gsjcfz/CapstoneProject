import config from './config.js';

function addPack(id, name, creator) {
    // This will be the container that will contain the new pack
    const packContainer = document.getElementById("pack_container");

    // This div will hold the button that represents the pack
    const newDiv = document.createElement("div");
    // This is the button that will represent the pack
    const newButton = document.createElement("button");
    newButton.className = "pack";
    const packName = document.createTextNode(name);
    newButton.appendChild(packName);
    // This is the buttons functionality
    newButton.addEventListener('click', ()=> {
        localStorage.setItem("currentPackID", id);
        // put the navigation controls here
        // TODO: create window navigation to question editor in main.js
        // window.myAPI.send('navigate', 'launch');
    });

    // This is the base div for displaying the creator
    const newCreatorDiv = document.createElement("div");
    const creatorName = document.createTextNode(`Creator: ${creator}`);

    // This is the button for deletion
    const deleteButton = document.createElement("button");
    const deleteText = document.createTextNode("Delete");
    deleteButton.style.backgroundColor = "#F22";
    deleteButton.appendChild(deleteText);

    // Now we append up the list
    newCreatorDiv.appendChild(creatorName);
    newButton.appendChild(newCreatorDiv);
    newDiv.appendChild(newButton);
    newDiv.appendChild(deleteButton);
    packContainer.appendChild(newDiv);
}

document.addEventListener('DOMContentLoaded', async function(event) {
    const mc_modal = document.getElementById('mc_modal');

    // We load in all the pack data here
    await fetch(`${config.web_server.host}/pack`, {
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
        
                addPack(obj.ID, obj.name, obj.username)
            }
        });
    
});
document.getElementById('return_to_menu').addEventListener('click', () => {
    window.myAPI.send('navigate', 'main_menu');
});
