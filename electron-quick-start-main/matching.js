document.addEventListener('DOMContentLoaded', (event) => {
    const match_items = document.querySelectorAll('.match_list>button');
    const mc_modal = document.getElementById('mc_modal');
    const mc_modalText = document.getElementById('mc_modal-text');
    const mc_closeModal = document.getElementById('mc_close-modal');
    
    match_correct  = function (lnode, rnode) {
        // TODO: make this check for an actual correct answer
        return lnode.getAttribute("data-key") == rnode.getAttribute("data-val");
    };
    
    let correctAnswersCount = 0;

    mc_closeModal.addEventListener('click', () => {
        mc_modal.style.display = 'none';
    });

    let match_evhandler = function(event) {
        let selected_node = event.currentTarget;
        let selected_list = selected_node.parentNode;
        let lists = document.querySelectorAll(".match_list");
        let other_list = (lists[0] == selected_list) ? lists[1] : lists[0];
        selected_list.querySelectorAll(".match_selected").forEach(el => {
            el.classList.remove("match_selected");
        });
        selected_node.classList.add("match_selected");
        let selected_mate = other_list.querySelector(".match_selected");
        if (selected_mate) {
            [selected_node, selected_mate].forEach((el) => {
                el.classList.remove("match_selected");
                if ( match_correct(selected_mate, selected_node) ) {
                    el.classList.add("match_greyout");
                    el.removeEventListener('click', match_evhandler);
                } else {
                    el.classList.add("match_fail");
                    window.setTimeout(() => {
                        el.classList.remove("match_fail");
                    }, 1000);
                }
            });
        }
        
        const mc_progress = document.getElementById('mc_progress');
        if (!selected_list.querySelector(":not(.match_greyout)")) {
            mc_modalText.textContent = "Correct!";
            correctAnswersCount++;
            // Update the progress bar based on correct answers
            let progressPercentage = (correctAnswersCount / 10) * 100;
            mc_progress.style.width = `${progressPercentage}%`;
    
            mc_modal.style.display = 'block';
        }
    };

    match_items.forEach(match_item => {
        match_item.addEventListener('click', match_evhandler);
    });
});
document.getElementById('return_to_menu').addEventListener('click', () => {
    window.myAPI.send('navigate', 'main_menu');
});
