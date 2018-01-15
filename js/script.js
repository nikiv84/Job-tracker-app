'use strict';

var endpoint = "http://localhost:3333/api/";
var state = [];

function getRequest(query, dataHandler, errorHandler) {
    var url = endpoint + query;
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            dataHandler(data);
        })
        .catch(function (error) {
            errorHandler(error);
        });
}

function UIerrorHandler(msg) {
    var errorEl = document.createElement("h3");
    errorEl.innerHTML = msg;
    document.querySelector("#app .container .row").appendChild(errorEl);
}

function renderCandidates(candidates) {
    console.table(candidates);
    document.querySelector("#app").innerHTML = "";

    var container = document.createElement("div");
    container.classList.add("container");
    document.querySelector("#app").appendChild(container);

    var row = document.createElement("div");
    row.classList.add("row");
    document.querySelector("#app .container").appendChild(row);

    if (candidates.length <= 0) {
        UIerrorHandler("Sorry, no matches!");
        return;
    }

    candidates.forEach(function (candidate) {
        candidate.avatar = candidate.avatar ? candidate.avatar : './img/avatar.png';
        var output = document.createElement("div");
        output.classList.add("col", "xl4", "l5", "offset-l1", "m6", "s12");
        output.innerHTML =
            `<div class="card medium" data-id="${candidate.id}">
                <div class="card-image">
                    <img src=${candidate.avatar} alt="avatar">
                </div>
            <div class="card-content">
                <h6>${candidate.name}</h6>
                <a href="mailto:${candidate.email}"><i class="material-icons">email</i> ${candidate.email.toLowerCase()}</a>
            </div>
        </div>`;
        document.querySelector("#app .container .row").appendChild(output);
        attachEventListener(candidate.id);
    })
    // particles();
}

function getCandidates() {
    getRequest("candidates", function (data) {
        state = JSON.parse(JSON.stringify(data));
        renderCandidates(state);
    }, function () {
        UIerrorHandler("Houston, we've got a problem!");
    });
}

function attachEventListener(id) {
    var card = document.querySelector(`[data-id="${id}"]`);
    card.addEventListener("click", function () {
        var id = parseFloat(this.getAttribute("data-id"));
        var candidate;
        for (var key in state) {
            if (state[key].id === id) {
                candidate = JSON.stringify(state[key]);
            }
        }
        localStorage.setItem("candidate", candidate);
        window.location.href = "reports.html";
    });
}

function setupEventListeners() {
    var searchInput = document.getElementById("search");
    searchInput.addEventListener("keyup", liveSearch);
}

function liveSearch(e) {
    console.log(e.target.value);
    var query = e.target.value.toLowerCase();
    var arr = state.filter(function (candidate) {
        return candidate.name.toLowerCase().includes(query);
    });
    renderCandidates(arr);
}
// function particles() {
//     if (!document.querySelector('#particles canvas')) {
//         particleground(document.getElementById('particles'), {
//             dotColor: '#1a237e',
//             lineColor: '#283593',
//             particleRadius: 6,
//             curveLines: true,
//             density: 9000,
//             proximity: 100
//         });
//     }
// }

(function () {
    getCandidates();
    setupEventListeners();
})();