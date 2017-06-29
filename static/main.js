var app = app || {};

app.init = function() {
    app.tableHandler.loadTable('https://swapi.co/api/planets/');
    app.tableHandler.showTurningPageButtons();
    app.tableHandler.getVoteStatistics();
    app.tableHandler.flyTie();
}

app.init();