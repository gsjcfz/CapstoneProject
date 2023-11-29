import config from './config.js';

async function loadPackLeaderboard(pack_no, context) {
    const leaderboard = context.querySelector("#pack-leaderboard");
    const lb_body = leaderboard.querySelector("& > tbody");
    lb_body.innerHTML = "<tr><td></td><td>Loading...</td><td></td></tr>";
    lb_body.classList.add("skeleton");

    await fetch(`${config.web_server.host}/leaderboard?pack=${pack_no}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem('accessToken')
        }
    })
        .then(response => response.json())
        .then(data => {
            lb_body.innerHTML = "";
            lb_body.classList.remove("skeleton");
            data.scores.forEach((row, idx) => {
                let tablerow = document.createElement("tr");
                
                if (row["username"]==localStorage.getItem("username")) {
                    row["username"] = "YOU";
                    tablerow.id = "you";
                }

                tablerow.innerHTML = `
                <td>${idx+1}</td>
                <td>${row["username"]}</td>
                <td>${row["pack_score"]}</td> `;

                lb_body.appendChild(tablerow);
            })
            if (!(lb_body.querySelector("#you"))) {
                let emptyrow = document.createElement("tr");
                emptyrow.innerHTML =  `
                <td>...</td>
                <td> </td>
                <td>#</td> `;
                lb_body.appendChild(emptyrow);
            
                let packs = JSON.parse(localStorage.getItem("currentPackList")).data;
                let the_pack = packs.find((pack)=>{return Number(pack.ID)==Number(pack_no);});
                if (!(the_pack.pack_score)) {
                    the_pack.pack_score = 0;
                }
                let yourow = document.createElement("tr");
                yourow.innerHTML = `
                <td>?</td>
                <td>YOU</td>
                <td>${the_pack.pack_score}</td> `;
                yourow.id = "you";
                lb_body.appendChild(yourow);
            }
        });
    }
    
document.addEventListener('DOMContentLoaded', async function(event) {
    const modal_cont = document.querySelector("#pack-deet-container");

    modal_cont.querySelector("#pack-start").addEventListener('click', () => {
        window.myAPI.send('navigate', 'launch');
    });

    modal_cont.querySelectorAll(".close").forEach(el => {
        el.addEventListener('click', () => {
            modal_cont.parentNode.classList.remove("open");
        });
    });

});

async function loadPackMetadata (pack_no, context) {
    const title_node = context.querySelector("#pack-title");
    const instr_node = context.querySelector("#pack-instructor");
    const q_num_node = context.querySelector("#q-count");

    let packs = JSON.parse(localStorage.getItem("currentPackList")).data;
    let the_pack = packs.find((pack)=>{return Number(pack.ID)==Number(pack_no);});

    title_node.innerHTML = the_pack.name;
    instr_node.innerHTML = `By ${the_pack.instructor}`;
    q_num_node.innerHTML = `${the_pack.question_count} questions`;
}

async function wakePackModal (pack_id, context=document) {
    const modal = context.querySelector(".pack-modal");
    loadPackLeaderboard(pack_id, modal);
    loadPackMetadata(pack_id, modal);
    modal.classList.add("open");
}
document.getElementById('return_to_menu').addEventListener('click', () => {
    window.myAPI.send('navigate', 'main_menu');
});

export default wakePackModal;