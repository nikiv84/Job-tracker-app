'use strict';
var endpoint = "http://localhost:3333/api/";
// var candidates = [];
// (function (method) {
//     var myInit = {
//         method
//     }
//     var url = endpoint + "candidates";
//     fetch(url, myInit)
//         .then(function (response) {
//             return response.json();
//         })
//         .then(function (data) {
//             return candidates = data;
//         })
//     // .then(function (candidates) {
//     //     candidates.forEach(function (candidate) {
//     //         var el = document.createElement("h6");
//     //         el.innerHTML = candidate.name;
//     //         document.getElementById("app").appendChild(el);
//     //     });
//     // })
// })("GET");

function getRequest(query, dataHandler) {
    var url = endpoint + query;
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("response: ", data);
            dataHandler(data);
        })
        .catch(function (error) {
            console.error(error);
        })
}

function renderCandidates(candidates) {
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
        `<div class="card large">
            <div class="card-image">
                <img src=${candidate.avatar}>
            </div>
            <div class="card-content">
            <h4>${candidate.name}</h4>
            <a href="mailto:${candidate.email}">${candidate.email}</a>
            </div>
        </div>`;
        document.querySelector("#app .container .row").appendChild(output);
    })
}

function getCandidates() {
    getRequest("candidates", function (data) {
        renderCandidates(data);
    });
}

(function () {
    getCandidates();
})();