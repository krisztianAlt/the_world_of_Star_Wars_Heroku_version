var app = app || {};

app.tableHandler = {
    loadTable: function (apiUrlPlanets) {
        $.getJSON(apiUrlPlanets, function(planetsRequest){
            var previousPage = planetsRequest.previous;
            var nextPage = planetsRequest.next;
            var planetsData = planetsRequest.results;
            
            // clear screen after turning page:
            var deleteRows = document.getElementsByClassName('table-row');
            while (deleteRows.length > 0) {
                deleteRows[0].remove();
            }

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
                    planetResidentsButton.classList.add('residents-button');
                    planetResidentsButton.textContent = numberOfResidents.toString() + " resident(s)";
                    planetResidentsButton.value = planetsData[planetIndex].name;
                    
                    // additions for using modal:
                    var toggleAttribute = document.createAttribute("data-toggle");
                    toggleAttribute.value = "modal";
                    planetResidentsButton.setAttributeNode(toggleAttribute);
                    var targetAttribute = document.createAttribute("data-target");
                    targetAttribute.value = "#residentsModal";
                    planetResidentsButton.setAttributeNode(targetAttribute);

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

                // add vote button if user logged in -- to the AJAX version:
                let nameHolder = document.getElementById('identification')
                if (nameHolder !== null) {
                    var planetVote = document.createElement('td');
                    if (planetsData[planetIndex].name === 'unknown') {
                        var noPlanetText = document.createTextNode('No planet')
                        planetVote.appendChild(noPlanetText);
                    } else {
                        var nameOfUser = nameHolder.dataset.nameofuser;
                        var nameOfPlanet = planetsData[planetIndex].name;
                        var voteButton = document.createElement('button')
                        voteButton.className = 'btn-default';
                        voteButton.classList.add('vote-button');
                        voteButton.textContent = 'Vote';

                        // add datas to the button:
                        var userNameAttribute = document.createAttribute("data-username");
                        userNameAttribute.value = nameOfUser;
                        voteButton.setAttributeNode(userNameAttribute);
                        var planetNameAttribute = document.createAttribute("data-planetname");
                        planetNameAttribute.value = nameOfPlanet;
                        voteButton.setAttributeNode(planetNameAttribute);

                        planetVote.appendChild(voteButton);
                    }
                    newRow.appendChild(planetVote);
                }
                
                // Original version of adding vote button -- without AJAX:
                //
                // let nameHolder = document.getElementById('identification')
                // if (nameHolder !== null) {
                //     var planetVote = document.createElement('td');
                //     if (planetsData[planetIndex].name === 'unknown') {
                //         var noPlanetText = document.createTextNode('No planet')
                //         planetVote.appendChild(noPlanetText);
                //     } else {
                //         var nameOfUser = nameHolder.dataset.nameofuser;
                //         var nameOfPlanet = planetsData[planetIndex].name;
                //         var voteButton = document.createElement('button')
                //         voteButton.className = 'btn-default';
                //         voteButton.classList.add('vote-button');
                //         var voteLink = document.createElement('a');
                //         voteLink.setAttribute('href', '/vote/'+nameOfUser+'/'+nameOfPlanet)
                //         var voteLinkText = document.createTextNode('Vote')
                //         voteLink.appendChild(voteLinkText);
                //         voteButton.appendChild(voteLink);
                //         planetVote.appendChild(voteButton);
                //     }
                //     newRow.appendChild(planetVote);
                // }

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

            // activate Residents buttons:
            var allResidentsButton = document.getElementsByClassName('residents-button');
            for (buttonIndex = 0; buttonIndex < allResidentsButton.length; buttonIndex++) {
                allResidentsButton[buttonIndex].addEventListener('click', function (event) {
                    var parent = this.parentElement;
                    clickedPlanet = parent.firstChild.value;
                    for (planIndex = 0; planIndex < planetsData.length; planIndex++) {
                        if (planetsData[planIndex].name === clickedPlanet) {
                            var residentsApis = planetsData[planIndex].residents;
                            app.tableHandler.showResidents(clickedPlanet, residentsApis);
                        }
                    }
                })
            };

            // activate Vote buttons:
            var allVoteButton = document.getElementsByClassName('vote-button');
            for (voteButtonIndex = 0; voteButtonIndex < allVoteButton.length; voteButtonIndex++) {
                allVoteButton[voteButtonIndex].addEventListener('click', function (event) {
                    var parent = this.parentElement;
                    userToPlanet = parent.firstChild.dataset.username;
                    clickedPlanet = parent.firstChild.dataset.planetname;
                    var dataPackage = {'user_name': userToPlanet, 'planet_name': clickedPlanet};
                    // AJAX:
                    $.ajax({
                        type: "POST",
                        url: 'vote',
                        data: dataPackage,
                        success : function(response){
                            answerFromPython = JSON.parse(response).answer;
                            console.log('Message from Python: ' + answerFromPython);

                            // CREATE INFO LINE IN HTML ABOUT SAVING

                            // delete previous info line if it is already on the screen:
                            var deleteMessage = document.getElementsByClassName('alert-success');
                            while (deleteMessage.length > 0) {
                                deleteMessage[0].remove();
                            };

                            // Create div:
                            var savingMessagePlace = document.getElementById('place-of-saving-message');
                            var savingMessageDiv = document.createElement('div');
                            savingMessageDiv.className = 'alert alert-success';
                            savingMessageDiv.id = 'vote-saved';
                            savingMessagePlace.appendChild(savingMessageDiv);
                            
                            // create close button:
                            var voteSavedMessage = document.getElementById('vote-saved');
                            
                            var closeMessageButton = document.createElement('button');
                            closeMessageButton.type = 'button';
                            closeMessageButton.className = 'close';
                            var dismissAttribute = document.createAttribute('data-dismiss');
                            dismissAttribute.value = 'alert';
                            closeMessageButton.setAttributeNode(dismissAttribute);
                            var ariaLabelAttribute = document.createAttribute('aria-label');
                            ariaLabelAttribute.value = 'Close';
                            closeMessageButton.setAttributeNode(ariaLabelAttribute);
                            
                            var spanElementInButton = document.createElement('span');
                            var ariaHiddenAttribute = document.createAttribute('aria-hidden');
                            ariaHiddenAttribute.value = 'true';
                            spanElementInButton.setAttributeNode(ariaHiddenAttribute);
                            spanElementInButton.innerHTML = '&times;';
                            closeMessageButton.appendChild(spanElementInButton);
                            
                            voteSavedMessage.appendChild(closeMessageButton);
                            
                            // add text to the info line:
                            var messageText = document.createElement('p');
                            messageText.textContent = "Vote saved. Impressive. Most impressive.";
                            voteSavedMessage.appendChild(messageText);
                        },
                        error: function(error) {
                            console.log(error);
                        },
                    });

                })
            }
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
    },

    showResidents: function (planet, residentsApisInShow) {
        var modalTitle = document.getElementById('residentsModalLabel');
        modalTitle.textContent = "Residents of " + planet;

        // delete previous residents table content:
        var deleteResidentRows = document.getElementsByClassName('residents-table-row');
        while (deleteResidentRows.length > 0) {
            deleteResidentRows[0].remove();
        }

        // request datas from API and put them into the modal:
        var residentTable = document.getElementById('residents-table-body');
        for (residentApiIndex = 0; residentApiIndex < residentsApisInShow.length; residentApiIndex++) {
            resiApi = residentsApisInShow[residentApiIndex];
            $.getJSON(resiApi, function(residentRequest){
                var newResidentRow = document.createElement('tr');
                newResidentRow.className = 'residents-table-row';

                var residentName = document.createElement('td');
                var residentNameText = document.createTextNode(residentRequest.name);
                residentName.appendChild(residentNameText);

                var residentHeight = document.createElement('td');
                var residentHeightText = document.createTextNode(residentRequest.height);
                residentHeight.appendChild(residentHeightText);
                
                var residentMass = document.createElement('td');
                var residentMassText = document.createTextNode(residentRequest.mass);
                residentMass.appendChild(residentMassText);

                var residentSkin = document.createElement('td');
                var residentSkinText = document.createTextNode(residentRequest.skin_color);
                residentSkin.appendChild(residentSkinText);

                var residentHair = document.createElement('td');
                var residentHairText = document.createTextNode(residentRequest.hair_color);
                residentHair.appendChild(residentHairText);

                var residentEye = document.createElement('td');
                var residentEyeText = document.createTextNode(residentRequest.eye_color);
                residentEye.appendChild(residentEyeText);

                var residentBirth = document.createElement('td');
                var residentBirthText = document.createTextNode(residentRequest.birth_year);
                residentBirth.appendChild(residentBirthText);

                var residentGender = document.createElement('td');
                var residentGenderText = document.createTextNode(residentRequest.gender);
                residentGender.appendChild(residentGenderText);
                
                newResidentRow.appendChild(residentName);
                newResidentRow.appendChild(residentHeight);
                newResidentRow.appendChild(residentMass);
                newResidentRow.appendChild(residentSkin);
                newResidentRow.appendChild(residentHair);
                newResidentRow.appendChild(residentEye);
                newResidentRow.appendChild(residentBirth);
                newResidentRow.appendChild(residentGender);
                
                residentTable.appendChild(newResidentRow); 
            });
        };
    },

    getVoteStatistics: function() {
        var voteStatButton = document.getElementById("vote-statistics-button")
        voteStatButton.addEventListener("click", function(event) {
            // delete previous table content:
            var deleteVoteStatisticsRows = document.getElementsByClassName('vote-statistics-table-row');
            while (deleteVoteStatisticsRows.length > 0) {
                deleteVoteStatisticsRows[0].remove();
            }

            // get datas from Python with AJAX, and put them into the HTML modal's table:
            var votesTable = document.getElementById('votes-table-body');
            $.ajax({
                type: 'POST',
                url: 'vote-statistics',
                success: function(response) {
                    if (response.result.length === 0) {
                        var newVoteStatRow = document.createElement('tr');
                        newVoteStatRow.className = 'vote-statistics-table-row';

                        var noVoteMessage = document.createElement('td');
                        var noVoteMessageText = document.createTextNode('(No votes in database)');
                        noVoteMessage.appendChild(noVoteMessageText);

                        var noVoteNumber = document.createElement('td');
                        var noVoteNumberText = document.createTextNode('---');
                        noVoteNumber.appendChild(noVoteNumberText);

                        newVoteStatRow.appendChild(noVoteMessage);
                        newVoteStatRow.appendChild(noVoteNumber);

                        votesTable.appendChild(newVoteStatRow);
                    } else {
                        for (let index=0; index < response.result.length; index++) {
                            let newVoteStatRow = document.createElement('tr');
                            newVoteStatRow.className = 'vote-statistics-table-row';

                            let votedPlanet = document.createElement('td');
                            let votedPlanetText = document.createTextNode(response.result[index][0]);
                            votedPlanet.appendChild(votedPlanetText);

                            let voteNumber = document.createElement('td');
                            let voteNumberText = document.createTextNode(response.result[index][1].toString());
                            voteNumber.appendChild(voteNumberText);

                            newVoteStatRow.appendChild(votedPlanet);
                            newVoteStatRow.appendChild(voteNumber);

                            votesTable.appendChild(newVoteStatRow);
                        }
                    }
                },
                error: function(error) {
                    console.log(error);
                }
            })
        });
    },

    flyTie: function() {
        var callButton = document.getElementById('call-TIE');
        callButton.addEventListener('click', function(event) {
            // delete previous screen content:
            var deleteFlyingElements = document.getElementById("space");
            while (deleteFlyingElements.firstChild) {
                deleteFlyingElements.removeChild(deleteFlyingElements.firstChild);
            };

            // open screen bar, display background image without TIE Fighter:
            var flyingBar = document.getElementById('space');
            $("#space").slideUp();
            for (numberOfParagraphs = 1; numberOfParagraphs < 6; numberOfParagraphs++) {
                var newParagraph = document.createElement('p');
                newParagraph.className = 'space-para';
                newParagraph.textContent = 'para';
                newParagraph.align = 'right';
                flyingBar.appendChild(newParagraph);
            };
            flyingBar.style.color = 'black';
            flyingBar.style.backgroundImage = "url('static/stars-in-night-sky.jpg')";
            flyingBar.style.backgroundRepeat = 'no-repeat';
            flyingBar.style.backgroundPosition = 'center center';
            flyingBar.style.backgroundSize = '100%';
            $("#space").slideDown('slow');

            // a little pause, then...
            var waitIndex = 1;
            function waitForTie () {
                setTimeout(
                    function () {
                        waitIndex = waitIndex + 1;
                        if (waitIndex < 10) {
                            waitForTie();
                        } else {
                            // ...TIE Fighter is coming:
                            // sound:
                            var tieSound = document.getElementById("tie-sound"); 
                            function playAudio() {
                                tieSound.play(); 
                            };
                            playAudio();
                            // vision:
                            var tieXPosition = 80;
                            flyingBar.style.backgroundImage = "url('static/Tie-Fighter-01-icon.png'), url('static/stars-in-night-sky.jpg')";
                            flyingBar.style.backgroundRepeat = 'no-repeat, no-repeat';
                            flyingBar.style.backgroundPosition = tieXPosition.toString()+'% center, center center';
                            flyingBar.style.backgroundSize = '0%, 100%';
                            var tieSize = 1;
                            function flying () {
                                setTimeout(
                                    function () {
                                        flyingBar.style.backgroundPosition = tieXPosition.toString()+'% center, center center';
                                        flyingBar.style.backgroundSize = tieSize.toString()+'%, 100%';
                                        tieXPosition = tieXPosition - 1;
                                        tieSize = tieSize + 0.2;
                                        if (tieSize < 25) {
                                            flying();
                                        } else {
                                            $("#space").slideUp('slow');
                                        }
                                    },
                                    30
                                )
                            }
                            flying();
                        }
                    },
                    100
                )
            }
            waitForTie();
        })
    },

    loginListener: function() {
        try {
            var newMenuInNavBar = document.getElementById('vote-statistics-button');
            app.tableHandler.getVoteStatistics();
            app.tableHandler.flyTie();
        } catch (error) {
            // console.log('Not logged in. ' + error);
        }
    }
}