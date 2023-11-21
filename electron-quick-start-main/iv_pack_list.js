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
    deleteButton.style.backgroundColor = '#f55';
    const deleteText = document.createTextNode("Delete");
    // This is the modal that will appear when the user tries to delete a pack
    const delete_modal = document.getElementById("delete_pack_modal");
    deleteButton.addEventListener('click', async ()=> {
        const dp_submit = document.getElementById('dp_submit-modal');

        dp_submit.addEventListener('click', async ()=>{
            // Change the text of the modal button to let the user know its working
            dp_submit.textContent = "Deleting...";
            // DELETE request to delete a specific pack
            await fetch(`${config.web_server.host}/pack/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + localStorage.getItem('accessToken')
                }
            });
            // Delete the element
            newDiv.remove();
            // Hide the modal
            delete_modal.style.display = 'none';
            // Change the delete button text back
            dp_submit.textContent = "Delete";
        });
        
        delete_modal.style.display = 'block';
    });
    deleteButton.className = "pack-delete";
    deleteButton.appendChild(deleteText);

    // Now we append up the list
    newCreatorDiv.appendChild(creatorName);
    newButton.appendChild(newCreatorDiv);
    newDiv.appendChild(newButton);
    newDiv.appendChild(deleteButton);
    packContainer.appendChild(newDiv);
}

document.addEventListener('DOMContentLoaded', async function(event) {
    // Configure Modal Elements
    // Add pack modal
    const add_pack_modal = document.getElementById('add_pack_modal');
    const ap_modal_close = document.getElementById('ap_close-modal');
    ap_modal_close.addEventListener('click', () => {
        add_pack_modal.style.display = 'none';
    });
    // Delete pack modal
    const delete_pack_modal = document.getElementById('delete_pack_modal');
    const dp_modal_close = document.getElementById('dp_close-modal');
    dp_modal_close.addEventListener('click', () => {
        delete_pack_modal.style.display = 'none';
    });

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
    // This will be the button to create a new pack.
    // When clicking this, it should create a new pack in the DB, set the current pack local variable
    // and take the user to the question editor
    const packContainer = document.getElementById("pack_container");

    const newDiv = document.createElement("div");
    const newButton = document.createElement("button");
    newButton.className = "pack-create";
    const packName = document.createTextNode("Create New Pack");
    newButton.appendChild(packName);
    // This is the buttons functionality
    newButton.addEventListener('click', async ()=> {
        // Edit the functionality of the add pack modal
        const ap_form = document.getElementById('ap_form');
        ap_form.addEventListener('submit', async function(e) {
            // Keeps the page from refreshing right after hitting submit
            e.preventDefault();

            const pack_name = document.getElementById('name').value;
            // Wipe all elements from the modal
            add_pack_modal.innerHTML = "";
            // POST new pack via web-server
            await fetch(`${config.web_server.host}/pack`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + localStorage.getItem('accessToken')
                },
                body: JSON.stringify({
                    name: pack_name
                })
                
            })
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem("currentPackID", data.pack_ID);
                    // put the navigation controls here
                    // TODO: create window navigation to question editor in main.js
                    window.myAPI.send('navigate', 'main_menu');
                });
        });

        // Open the add pack modal
        add_pack_modal.style.display = 'block';
    });

    newDiv.appendChild(newButton);
    packContainer.appendChild(newDiv);
        
    
});
document.getElementById('return_to_menu').addEventListener('click', () => {
    window.myAPI.send('navigate', 'main_menu');
});
