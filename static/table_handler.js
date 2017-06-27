var app = app || {};

app.tableHandler = {
    loadTable: function (apiUrlPlanets) {
        $.getJSON(apiUrlPlanets, function(planetsRequest){
            var previousPage = planetsRequest.previous;
            var nextPage = planetsRequest.next;
            var planetsData = planetsRequest.results;
            console.log(planetsData);
            
            // clear screen after turning page:
            var deleteRows = document.getElementsByClassName('table-row');
            while (deleteRows.length > 0) {
                deleteRows[0].remove();
            }
            // var deleteTurnPageParagraph = document.getElementById('turn-page-paragraph');
            // deleteTurnPageParagraph.remove();

            // create table:
            var tableBody = document.getElementById('table-body');

            for (planetIndex = 0; planetIndex < planetsData.length; planetIndex++) {
                var newRow = document.createElement('tr');
                newRow.className = 'table-row';

                var planetName = document.createElement('td');
                var planetNameText = document.createTextNode(planetsData[planetIndex].name);
                planetName.appendChild(planetNameText);
                
                var planetDiameter = document.createElement('td');
                var planetDiameterText = document.createTextNode(planetsData[planetIndex].diameter);
                planetDiameter.appendChild(planetDiameterText);
                                
                var planetClimate = document.createElement('td');
                var planetClimateText = document.createTextNode(planetsData[planetIndex].climate);
                planetClimate.appendChild(planetClimateText);

                var planetTerrain = document.createElement('td');
                var planetTerrainText = document.createTextNode(planetsData[planetIndex].terrain);
                planetTerrain.appendChild(planetTerrainText);

                var planetSurface = document.createElement('td');
                var planetSurfaceText = document.createTextNode(planetsData[planetIndex].surface_water);
                planetSurface.appendChild(planetSurfaceText);

                var planetPopulation = document.createElement('td');
                var planetPopulationText = document.createTextNode(planetsData[planetIndex].population);
                planetPopulation.appendChild(planetPopulationText);

                var planetResidents = document.createElement('td');
                var numberOfResidents = planetsData[planetIndex].residents.length;
                if (numberOfResidents > 0) {
                    var planetResidentsButton = document.createElement('button');
                    planetResidentsButton.className = 'btn-default';
                    planetResidentsButton.textContent = numberOfResidents.toString() + " resident(s)";
                    planetResidents.appendChild(planetResidentsButton);
                } else {
                    var planetResidentsText = document.createTextNode('No known residents');
                    planetResidents.appendChild(planetResidentsText);
                }
                
                newRow.appendChild(planetName);
                newRow.appendChild(planetDiameter);
                newRow.appendChild(planetClimate);
                newRow.appendChild(planetTerrain);
                newRow.appendChild(planetSurface);
                newRow.appendChild(planetPopulation);
                newRow.appendChild(planetResidents);

                tableBody.appendChild(newRow);
            }

            // add API URLs to turn page buttons
            var previousPageButton = document.getElementById('previous');
            var nextPageButton = document.getElementById('next');

            previousPageButton.onclick = function() {
                if (previousPage != null) {
                    app.tableHandler.loadTable(previousPage);
                }
            };

            nextPageButton.onclick = function() {
                if (nextPage != null) {
                    app.tableHandler.loadTable(nextPage);
                }
            };

            
        });   
    },

    showTurningPageButtons: function() {
        // create turn page buttons
        var turnPageParagraph = document.getElementById('turn-page');
        var turnPage = document.createElement('p');
        turnPage.id = 'turn-page-paragraph';
        
        var previousPageButtonSpan = document.createElement('span');
        var previousPageButton = document.createElement('button');
        previousPageButton.className = 'btn-primary';
        previousPageButton.id = 'previous';
        previousPageButton.textContent = 'Previous'
        previousPageButtonSpan.appendChild(previousPageButton);
        
        var nextPageButtonSpan = document.createElement('span');
        var nextPageButton = document.createElement('button');
        nextPageButton.className = 'btn-primary';
        nextPageButton.id = 'next';
        nextPageButton.textContent = 'Next'
        nextPageButtonSpan.appendChild(nextPageButton);

        turnPage.appendChild(previousPageButtonSpan);
        turnPage.appendChild(nextPageButtonSpan);
        turnPageParagraph.appendChild(turnPage);
    }
}