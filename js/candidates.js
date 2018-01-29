'use strict';
(function () {
var endpoint = "https://hr-app-json-server.herokuapp.com/api/";
var state = {};

//ajax get request
function getRequest(query, dataHandler, errorHandler) {
    var url = endpoint + query
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

//render error on UI
function UIerrorHandler(msg) {
    var errorEl = document.createElement("h3");
    errorEl.innerHTML = msg;
    var container = document.createElement("div");
    container.classList.add("container");
    document.querySelector("#app").appendChild(container);

    var row = document.createElement("div");
    row.classList.add("row");
    document.querySelector("#app .container").appendChild(row);

    document.querySelector("#app .container .row").appendChild(errorEl);
}

//render candidates on UI
function renderCandidates(candidates) {
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
}

//fetch candidates from server
function getCandidates() {
    getRequest("candidates", function (data) {
        state.candidates = [...data];
        renderCandidates(state.candidates);
    }, function () {
        UIerrorHandler("Houston, we've got a problem!");
    });
}

//add event listeners on canidate elements
function attachEventListener(id) {
    var card = document.querySelector(`[data-id="${id}"]`);
    card.addEventListener("click", function () {
        var id = parseFloat(this.getAttribute("data-id"));
        var candidate;
        var candidates = state.candidates;
        for (var i in candidates) {
            if (candidates[i].id === id) {
                candidate = JSON.stringify(candidates[i]);
            }
        }
        localStorage.setItem("candidate", candidate);
        window.location.href = "reports.html";
    });
}

//add event listener on search element
function addSearchEventListener() {
    var searchInput = document.getElementById("search");
    searchInput.addEventListener("keyup", liveSearch);
}

//live search function
function liveSearch(e) {
    var query = e.target.value.toLowerCase();
    var arr = state.candidates.filter(function (candidate) {
        return candidate.name.toLowerCase().includes(query);
    });
    renderCandidates(arr);
}

//init
    getCandidates();
    addSearchEventListener();
})();