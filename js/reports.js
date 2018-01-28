'use strict';
(function ($) {
var endpoint = "js/db.json";
var state = {};
var errTypes = {
    warn: "warn",
    info: "info"
}

//ajax request
function dataRequest(query, method, dataHandler, errorHandler) {
   
    var request = $.ajax({
        url: endpoint,
        method: method,
        dataType: 'json'
    });

    request.done(function (response) {
        dataHandler(response[query]);
    })

    request.fail(function (error) {
        errorHandler(error);
    })
}

//date formatting function
function dateFormatter(dateData) {
    var date = new Date(dateData);

    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }

    return dd + '.' + mm + '.' + yyyy + '.';
}

//render error on UI
function UIerrorHandler(msg, errtype) {
    var warnBtn, warnClass;
    switch (errtype) {
        case "warn":
            warnBtn = `<a class="btn-floating pulse"><i class="material-icons">warning</i></a>`;
            warnClass = "error";
            break;
        case "info":
            warnBtn = `<a class="btn-floating pulse"><i class="material-icons">info</i></a>`;
            warnClass = "info";
            break;
        default:
            warnBtn = "";
            warnClass = "";
    }

    $("#candidate-data").append(`
        <div class="row">
            <div class="col s8 offset-s2">
                <div class="card-panel ${warnClass}">
                    <h5 class="center-align">
                        ${warnBtn}
                        ${msg}
                    </h5>
                </div>
            </div>
        </div>
    `);
}

//render candidates on UI
function renderCandidate(candidate) {
    $("#app").append(`
        <div class="container" id="candidate-data">
            <div class="row">
                <div class="col s8 offset-s2 m4 offset-m4 l3 xl4">
                    <div class="candidate-img">
                        <img src=${candidate.avatar} class="responsive-img round-rot" alt=${candidate.name} width="100%">
                    </div>
                </div>
                <div class="col s12 m12 l9 xl8 cand-info">
                    <div class="row">
                        <div class="col s12 m6 l7 xl6">
                            <small>Name:</small>
                            <h6>${candidate.name}</h6>
                        </div>
                        <div class="col s12 m6 l5 xl6">
                            <small>Date of birth:</small>
                            <h6>${dateFormatter(candidate.birthday)}</h6>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col s12 m6 l7 xl6">
                            <small>Email:</small>
                            <h6>${candidate.email.toLowerCase()}</h6>
                        </div>
                        <div class="col s12 m6 l5 xl6">
                            <small>Education:</small>
                            <h6>${candidate.education}</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
}

//Uppercase first letter
String.prototype.ucFirst = function () {
    return this.charAt(0).toUpperCase() + this.substr(1);
}

//render modal element with report content
function renderModal(report) {
    var $modalContainer = $(".modal-content .row");
    $modalContainer.html("");
    var $modalTitle = $("<h4>").addClass("modal-title").text(report.candidateName);
    $modalContainer.append($modalTitle);
    $modalContainer.append(`
        <div class="row">
            <div class="col s12 m4">
                <p>Company:</p>
                <h6>${report.companyName}</h6>
                <p>Interview Date:</p>
                <h6>${dateFormatter(report.interviewDate)}</h6>
                <p>Phase:</p>
                <h6>${report.phase.toUpperCase()}</h6>
                <p>Status:</p>
                <h6>${report.status.ucFirst()}</h6>
            </div>
            <div class="col s12 m8 note">
                <p>Notes:</p>
                <p>${report.note}</p>
            </div>
        </div>
    `);
}

//render table rows with report data
function renderReportRows(reports) {
    var $reports = $(reports);
    var output = ``;
    $reports.each(function (i, report) {
        output += `
            <tr>
                <td>
                    ${report.companyName}
                </td>
                <td>
                    ${dateFormatter(report.interviewDate)}
                </td>
                <td>
                    ${report.status.ucFirst()}
                </td>
                <td id="seemore">
                    <a href="#report-modal" class="modal-trigger" data-id=${report.id}>
                        <i class="material-icons">remove_red_eye</i>
                    </a>
                <td>
            </tr>
        `;
    });
    return output;
}

//get data for modal element
function getModalData(id) {
    state.reports.forEach(function (report) {
        if (report.id == id) {
            renderModal(report);
        }
    });
}

//add event listener to activate modal
function attachEventListener() {
    var $details = $("a[data-id]");
    $details.each(function (i) {
        var $id = $(this).attr("data-id");
        $(this).on("click", function () {
            getModalData($id);
        })
    })
}

//render reports table
function renderReports(reports) {
    if (!reports.length) {
        UIerrorHandler("There are no reports for this person yet.", errTypes.info);
        return;
    }
    $("#candidate-data").append(`
        <h4>Reports</h4>
        <div class="row">
            <table class="striped">
                <thead>
                <tr>
                    <th>Company</th>
                    <th>Interview Date</th>
                    <th colspan="2">Status</th>
                </tr>
                </thead>
                <tbody>
                    ${renderReportRows(reports)}
                </tbody>
            </table>
        <div class="row">
    `);
    attachEventListener(reports);
}

//fetch reports data for selected candidate
function getReports() {
    if (!state.candidate) {
        redirectToHome();
        return;
    }
    var candidateId = state.candidate.id;
    dataRequest("reports", "GET", function (reports) {
        var filteredReports = reports.filter(function (report) {
            return report.candidateId === candidateId;
        })
        state.reports = filteredReports;
        renderReports(state.reports);
    }, function () {
        UIerrorHandler("Error fetching reports. Please try again.", errTypes.warn);
    })
}

//redirect to home page
function redirectToHome() {
    window.location.href = "index.html";
}

//get candidate data from local storage and render it on UI
function getCandidate() {
    var candidate = JSON.parse(window.localStorage.getItem("candidate"));
    if (!candidate) {
        redirectToHome();
        return;
    }
    state.candidate = candidate;
    renderCandidate(state.candidate);
}

//init functions
function initSetup() {
    $('.modal').modal();
}

//init

    initSetup();
    getCandidate();
    getReports();
})(jQuery);
