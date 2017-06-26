var app = app || {};

app.init = function() {
    app.tableHandler.loadTable('https://swapi.co/api/planets/');
}

app.init();