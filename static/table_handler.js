var app = app || {};

app.tableHandler = {
    loadTable: function (apiUrlPlanets) {
        $.getJSON(apiUrlPlanets, function(planetsRequest){
            var previousPage = planetsRequest.previous;
            var nextPage = planetsRequest.next;
            var planetsData = planetsRequest.results;
            console.log(planetsData);
            
            // create table:
            var tableBody = document.getElementById('table-body');
            for (planetIndex = 0; planetIndex < planetsData.length; planetIndex++) {
                var newRow = document.createElement('tr');

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

                newRow.appendChild(planetName);
                newRow.appendChild(planetDiameter);
                newRow.appendChild(planetClimate);
                newRow.appendChild(planetTerrain);
                newRow.appendChild(planetSurface);
                newRow.appendChild(planetPopulation);

                tableBody.appendChild(newRow);
            }

            // create turn page buttons
            var turnPageParagraph = document.getElementById('turn-page');
            var turnPage = document.createElement('p');                
            
            var previousPageButtonSpan = document.createElement('span');
            var previousPageButton = document.createElement('button');
            previousPageButton.className = 'btn-primary';
            previousPageButton.id = previousPage;
            previousPageButton.textContent = 'Previous'
            previousPageButtonSpan.appendChild(previousPageButton);
            
            var nextPageButtonSpan = document.createElement('span');
            var nextPageButton = document.createElement('button');
            nextPageButton.className = 'btn-primary';
            nextPageButton.id = nextPage;
            nextPageButton.textContent = 'Next'
            nextPageButtonSpan.appendChild(nextPageButton);

            turnPage.appendChild(previousPageButtonSpan);
            turnPage.appendChild(nextPageButtonSpan);
            turnPageParagraph.appendChild(turnPage);
        });
        
    }
    
}