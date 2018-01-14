'use strict';
var endpoint = "http://localhost:3333/api/";
var state = [];

function getRequest(query, dataHandler) {
    var url = endpoint + query;
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("response: ", data);
            dataHandler(data);
            return state = data;
        })
        .catch(function (error) {
            console.error(error);
        })
}

function renderCandidates(candidates) {
    console.log(candidates);
    document.querySelector("#app").innerHTML = "";
    var container = document.createElement("div");
    container.classList.add("container");
    var row = document.createElement("div");
    row.classList.add("row");
    document.querySelector("#app").appendChild(container);
    document.querySelector("#app .container").appendChild(row);
    candidates.forEach(function (candidate) {
        candidate.avatar = candidate.avatar ? candidate.avatar : './img/avatar.jpg';
        var output = document.createElement("div");
        output.classList.add("col", "l4", "m6", "s12");
        output.innerHTML =
            `<div class="card large" data-id="${candidate.id}">
            <div class="card-image">
                <img src=${candidate.avatar}>
            </div>
            <div class="card-content">
            <h4>${candidate.name}</h4>
                <a href="mailto:${candidate.email}">${candidate.email}</a>
            </div>
        </div>`;
        document.querySelector("#app .container .row").appendChild(output);
        attachEventListener(candidate.id);
    })
}

function getCandidates() {
    getRequest("candidates", function (data) {
        renderCandidates(data);
        // setupEventListeners();
    });
}

function attachEventListener(id) {
    var card = document.querySelector(`[data-id="${id}"]`);
    card.addEventListener("click", function () {
        var id = this.getAttribute("data-id");
        localStorage.setItem("id", id);
        window.location.href = "reports.html";
    });
}

function getReports() {
    var candidateId = parseFloat(window.localStorage.getItem("id"));
    console.log("candidateId: ", candidateId);
    getRequest("reports", function (data) {
        data.forEach(function (report) {
            console.log(report.candidateId === candidateId);
        })
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

(function () {
    setupEventListeners();
    if (window.location.href.indexOf("index.html") > -1) {
        getCandidates();
        return;
    }
    getReports();

})();