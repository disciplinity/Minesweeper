var minesAmount;
var name;
var fieldSizeInput;
var fieldArea;
var mineField;
var mineField2DArray;
var plantedBombs;
var gameId;
var movesMade;

var startGame = function() {
	
	gameId = 1;
	clickedTiles = [];
	
	minesAmount = $("#bombsInput").val();// parseInt(document.getElementById("bombsInput").value);
	name = $("#namesInput").val();//document.getElementById("namesInput").value;
	mineField = $("mineField");
	
	fieldSizeInput = $("#fieldSizeInput").val();
	fieldArea = Math.pow(parseInt(fieldSizeInput), 2);
	
	console.log(fieldArea);
	console.log(minesAmount);
	console.log(name);
	console.log("FieldSizeInput: " + fieldSizeInput);
	
	if (correctInput()) {
		$("#validationStatus").html("Game started");
		$("#validationStatus").css("color", "#73ce65"); // Green
		placeButtons();
		plantBombs();
		console.log(mineField2DArray);
	} else {
		$("#validationStatus").html("Invalid input");
		$("#validationStatus").css("color", "#e87f5c"); // Red

	}
}

var correctInput = function() {
	return name != "" && minesAmount != "" && minesAmount > 0 && minesAmount < fieldArea && !name.includes("<");	
}

var placeButtons = function() {
	$("#mineField").html(""); // clear the previous field

	var but;
	mineField2DArray = [];
	for (y = 0; y < fieldSizeInput; y++) {
		mineField1Row = [];
		for (x = 0; x < fieldSizeInput; x++) {
			mineField1Row.push(0); 
			but = "<button id='" + x  + "," + y + "' class='fieldTile' type='button' onclick='clickOnTile(" + "this" + "," + x + "," + y + ")'></button>"
			$("#mineField").append(but);
		}
		mineField2DArray.push(mineField1Row);
		$("#mineField").append("<br>");
	}
}


var plantBombs = function() {
	var counter = 0;
	var bomb_x_coords;
	var bomb_y_coords;
	var bombCoords;
	plantedBombs = [];
	
	for (i = 0; i < minesAmount; i++) {
		do {
			bomb_x_coords = Math.floor(Math.random() * fieldSizeInput);
			bomb_y_coords = Math.floor(Math.random() * fieldSizeInput);
			bombCoords = [bomb_x_coords, bomb_y_coords];
		} while (mineField2DArray[bomb_y_coords][bomb_x_coords] == 1);
		mineField2DArray[bomb_y_coords][bomb_x_coords] = 1;
		plantedBombs.push(bombCoords);
	}
}

var clickOnTile = function(but, x, y) {
	var tileValue;
	var tileColor;
	var el;
	var tileNr;
	var tableRow;
	
	movesMade++;

	// Loss situation
	if (mineField2DArray[y][x] == 1) {	
	
		// Write loss to the file
		$.get('../cgi-bin/writer.py', {
			name: name,
			bombs: minesAmount,
			result: "Loss",
			movesMade: movesMade,
			boardSize: fieldSizeInput + "x" + fieldSizeInput
		});
		
		// Show all mines
		for (i = 0; i < plantedBombs.length; i++) {
			el = plantedBombs[i][0] + "," + plantedBombs[i][1];
			document.getElementById(el).style.background = "red";
		}
		
		makeAllButtonsNotClickable();
		
		tableRow = "<tr><td>" + gameId++ + "</td><td style='color:#dd8d8e'><strong>Lost</strong></td><td>" + minesAmount + "</td><tr>";
		$("#highscores").append(tableRow);
	
	} else {
		// Calculate and show the value of the tile
		tileNr = calculateTileValue(x, y);
		
		if (tileNr == 0) {
			var adjacentTileNr;
			var adjacentTileColor;
			var adjacentTileVal;

			// Reveal all adjacent tiles if we clicked on 0.
			for (i = y - 1; i <= y + 1; i++) {
				for (j = x - 1; j <= x + 1; j++) {
					if (i == -1 || i == fieldSizeInput || j == -1 || j == fieldSizeInput) continue;
					adjacentTileNr = calculateTileValue(j, i);
					adjacentTileColor = getColorFromTileValue(adjacentTileNr);
					adjacentTileVal = "<p class='tileValue' style='color:" + adjacentTileColor + "'>" + adjacentTileNr + "</p>";
					
					// If we haven't clicked on it before
					 if (document.getElementById(j + "," + i).innerHTML == "") {
						 document.getElementById(j + "," + i).innerHTML = adjacentTileVal;
						 clickedTiles.push([j,i]);
					 }
				}
			}
		}
		else {
			tileColor = getColorFromTileValue(tileNr);
			tileValue = "<p class='tileValue' style='color:" + tileColor + "'>" + tileNr + "</p>";
			but.innerHTML = tileValue;
			clickedTiles.push([x, y]);

		}
		but.disabled = true;
		
		// Check if we won
		console.log(clickedTiles.length);
		if (fieldArea - clickedTiles.length <= minesAmount) {
			makeAllButtonsNotClickable();
			tableRow = "<tr><td>" + gameId++ + "</td><td style='color:#76bc88'><strong>Win</strong></td><td>" + minesAmount + "</td><tr>";
			$("#highscores").append(tableRow);
		}

	}
}

var calculateTileValue = function(x, y) {
	var adjacentMineCounter = 0;
	
	for (a = y - 1; a <= y + 1; a++) {
		for (b = x - 1; b <= x + 1; b++) {
			try {
				if (mineField2DArray[a][b] == 1) {
					adjacentMineCounter += 1;
				}
			} catch (err) {
			}				
			
		}
	}
	return adjacentMineCounter;
}

var makeAllButtonsNotClickable = function() {
	for (y = 0; y < fieldSizeInput; y++) {
		for (x = 0; x < fieldSizeInput; x++) {
			document.getElementById(x + "," + y).disabled = true;
		}
	}
}

var getColorFromTileValue = function(val) {
	var color;
	switch(val) {
		
		case 0:
			color = "#969096";
			break;
		case 1:
			color = "#336dcc";
			break;
		case 2:
			color = "#468c5b";
			break;
		case 3:
			color = "red";
			break;
		case 4:
			color = "#312960";
			break;
		case 5:
			color = "#634848";
			break;
		case 6:
			color = "#c1a74f";
			break;
		case 7:
			color = "#ce7a46";
			break;
		case 9:
			color = "#d619cc";
			break;
	}
	
	return color;
}