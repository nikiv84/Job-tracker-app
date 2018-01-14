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
        })
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
        output.classList.add("col", "l4", "m6", "s12");
        output.innerHTML =
            `<div class="card medium" data-id="${candidate.id}">
                <div class="card-image">
                    <img src=${candidate.avatar} alt="avatar">
                </div>
            <div class="card-content">
                <h5>${candidate.name}</h5>
                 <a href="mailto:${candidate.email}"><i class="material-icons">email</i> ${candidate.email.toLowerCase()}</a>
            </div>
        </div>`;
        document.querySelector("#app .container .row").appendChild(output);
        attachEventListener(candidate.id);
    })
    particles();

}

function getCandidates() {
    getRequest("candidates", function (data) {
        state = JSON.parse(JSON.stringify(data));
        renderCandidates(state);
    }, function(){
        UIerrorHandler("Oops! Sorry, there's been a mistake!");
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
        console.log(data);
        data.forEach(function (report) {
            if (report.candidateId === candidateId) {
                var reportEl = document.createElement("h5");
                reportEl.innerHTML = report.candidateName;
                document.getElementById("app").appendChild(reportEl);
            };
        })
    }, UIerrorHandler);
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
function particles() {
    if (!document.querySelector('#particles canvas')) {
        particleground(document.getElementById('particles'), {
            dotColor: '#1a237e',
            lineColor: '#283593',
            particleRadius: 6,
            curveLines: true,
            density: 9000,
            proximity: 100
        });
    }
}