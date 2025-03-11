const sketch = (p) => {
    // Move all existing variables to be properties of p
    p.currentScene = "cover";
    p.game1Passed = false;
    p.game2Passed = false;
    p.game3Passed = false;
    p.officeImage = null;
    p.escapeImage = null;
    p.gameCoverImage = null;
    p.keyObtained = false;
    p.showKeyMenu = false;
    p.displayMessage = "";
    p.hoveringMessage = "";
    p.snake = null;
    p.rez = 40;
    p.food = null;
    p.score = 0;
    p.startTime = 0;  // Start time in milliseconds

    // Maze Game 2 variables for a 10x10 maze
    p.game2Initialized = false;
    p.game2StartTime = 0;
    p.finishZone = {}; // finish cell boundaries
    // Maze generation variables:
    p.cols = 10, p.rows = 10;
    p.cellSize = 80;
    p.grid = [];
    p.currentCell;
    p.stack = [];
    p.mazeSegments = []; // List of wall segments for collision detection
    // Helper to compute the index in the grid array
    function index(i, j) {
        if (i < 0 || j < 0 || i >= p.cols || j >= p.rows) {
            return -1;
        }
        return i + j * p.cols;
    }

    // Cell constructor: each cell knows its grid position and its four walls.
    class Cell {
        constructor(i, j) {
            this.i = i;
            this.j = j;
            // Walls: [top, right, bottom, left]
            this.walls = [true, true, true, true];
            this.visited = false;

            // Check unvisited neighbors for maze generation
            this.checkNeighbors = function() {
                let neighbors = [];
                let top = grid[index(i, j - 1)];
                let right = grid[index(i + 1, j)];
                let bottom = grid[index(i, j + 1)];
                let left = grid[index(i - 1, j)];

                if (top && !top.visited) { neighbors.push(top); }
                if (right && !right.visited) { neighbors.push(right); }
                if (bottom && !bottom.visited) { neighbors.push(bottom); }
                if (left && !left.visited) { neighbors.push(left); }

                if (neighbors.length > 0) {
                    let r = floor(random(neighbors.length));
                    return neighbors[r];
                } else {
                    return undefined;
                }
            };

            // Draw the cell's walls on the canvas
            this.show = function() {
                let x = 100 + this.i * p.cellSize;
                let y = 100 + this.j * p.cellSize;
                stroke(0);
                if (this.walls[0]) { line(x, y, x + p.cellSize, y); }       // Top
                if (this.walls[1]) { line(x + p.cellSize, y, x + p.cellSize, y + p.cellSize); } // Right
                if (this.walls[2]) { line(x + p.cellSize, y + p.cellSize, x, y + p.cellSize); } // Bottom
                if (this.walls[3]) { line(x, y + p.cellSize, x, y); }       // Left
            };
        }
    }
    function foodLocation() {
        let x = floor(random(p.w));
        let y = floor(random(p.h));
        p.food = createVector(x, y);
    }

    // Basic Snake class implementation.
    class Snake {
        constructor() {
            this.body = [];
            // Start in the middle of the grid.
            this.body[0] = createVector(floor(p.w / 2), floor(p.h / 2));
            this.xdir = 0;
            this.ydir = 0;
        }

        setDir(x, y) {
            this.xdir = x;
            this.ydir = y;
        }
        update() {
            let head = this.body[this.body.length - 1].copy();
            this.body.shift();

            // Update position with current direction and apply wrap-around using modulus
            head.x = (head.x + this.xdir + p.w) % p.w;
            head.y = (head.y + this.ydir + p.h) % p.h;

            this.body.push(head);
        }

        show() {
            for (let part of this.body) {
                fill(0);
                noStroke();
                rect(part.x, part.y, 1, 1);
            }
        }
        eat(pos) {
            let head = this.body[this.body.length - 1];
            if (head.x === pos.x && head.y === pos.y) {
                this.grow();
                return true;
            }
            return false;
        }
        grow() {
            let head = this.body[this.body.length - 1].copy();
            this.body.push(head);
        }

        endGame() {
            let head = this.body[this.body.length - 1];
            // Check if the snake collides with itself.
            for (let i = 0; i < this.body.length - 1; i++) {
                let part = this.body[i];
                if (head.x === part.x && head.y === part.y) {
                    return true;
                }
            }
            return false;
        }
    }

    function keysPressed() {
        var keys = [];
        $(document).keydown(function(e) {
            if (keys.indexOf(e.which) === -1) keys.push(e.which);
        }).keydown(function(e) {
            if (e.ctrlKey || e.metaKey) {
                keys.push(e.which);
            }
            // Translate keys to actions. Arrow keys to directions. In addition, mouse controls (m) to actions.
            var mainKeys = p.keyMapper.mouse,
                mainMouse = 0,
                act = mainKeys.cache[mainMouse];
            var realWidth = (act.direction == "UP" ? "width" : "height")
            var next = mainMouse + act.direction 
                if (p.MOUSE === realWidth) if (next < 0) next = p.MOUSE - (realWidth || 1) // Allocating width and height;
            // Current x and y attributes to multiply on spacing to translate to mouse coordinates
            var width = p.MOUSE,  // Y () and Y ()
                height = parseInt((p.MOUSE * act.width) * act.height),
                widthOffset = p.FORCE_M || 0, // Setting new diverse model
                coords = [p.keysxy, p.coordsRecog, act.tTopM()], keyNavigator = true; for (var j = 0; j < widthOffset; j++) coords[j] += p.times + act.width + j; for (j = 0; j < widthOffset; j++) keyNavigator = j + coords[j] > 0 && j; j + coords[j] < width; return coords[coords[j]]; 
        });
        
    }
    function displayCoordinates() {
        fill(0);
        textSize(16);
        text(`X: ${mouseX}, Y: ${mouseY}`, 30, height - 10);
    }
    function drawMessageBar(message) {
        let barHeight = 40;
        let barY = height - barHeight;
        fill(50, 50, 50, 200);  // Dark semi-transparent background
        rect(0, barY, width, barHeight);
        fill(255);
        textSize(16);
        textAlign(CENTER, CENTER);
        text(message, width / 2, barY + barHeight / 2);
    }
    function drawGame1() {
        // Calculate elapsed time and remaining time.
        let elapsed = (millis() - startTime) / 1000;
        let timeLeft = max(60 - elapsed, 0);

        // Apply grid scaling.
        scale(rez);
        background(220);

        // If the snake eats the food, increase score and reposition food.
        if (snake.eat(food)) {
            score++;
            foodLocation();
        }

        snake.show();

        // Draw the food.
        noStroke();
        fill(255, 0, 0);
        rect(food.x, food.y, 1, 1);

        // Return to unscaled drawing to display score and timer.
        resetMatrix();
        fill(0);
        textSize(24);
        textAlign(LEFT, TOP);
        text(`Score: ${score}`, 20, 20);
        text(`Time: ${nf(timeLeft, 1, 1)}s`, 20, 50);

        // Check win condition: if score reaches 10 within 60 seconds, return to office.
        if (score >= 10) {
            if (!game1Passed) {
                game1Passed = true;
            }
            currentScene = "office";
            game1Initialized = false;
            resizeCanvas(1000, 1000);
            for (let zone of zones) {
                if (zone.name === "snake") {
                    zone.message = "it no longer attracts you";
                    zone.nextScene = ""; // In other words, bloc the transition
                }
            }
            return;
        }
        // Check fail condition: if time runs out before reaching a score of 10.
        if (timeLeft <= 0) {
            currentScene = "endGame";
            return;
        }
        // Also check for snake collision.
        if (snake.endGame()) {
            currentScene = "endGame";
        }
    }
    function drawGame2() {
        background(220);

        // Calculate elapsed time and remaining time.
        let elapsed = (millis() - game2StartTime) / 1000;
        let timeLeft = max(120 - elapsed, 0);

        // Draw the maze by drawing each cell's walls.
        for (let cell of grid) {
            cell.show();
        }

        // Draw finish zone what a semi-transparent green overlay.
        noStroke();
        fill(0, 255, 0, 150);
        rect(finishZone.x, finishZone.y, finishZone.w, finishZone.h);

        // Draw the player as a small blue circle at the mouse position.
        fill(0, 0, 255);
        noStroke();
        let playerRadius = 10;
        ellipse(mouseX, mouseY, playerRadius * 2, playerRadius * 2);

        // Display the remaining time.
        resetMatrix();
        fill(0);
        textSize(24);
        textAlign(LEFT, TOP);
        text(`Time Left: ${nf(timeLeft, 1, 1)}s`, 20, 20);

        // Check Collision: if the player's circle gets too close to any maze wall segment.
        for (let seg of mazeSegments) {
            let d = pointLineDistance(mouseX, mouseY, seg.x1, seg.y1, seg.x2, seg.y2);
            if (d < playerRadius) {
                currentScene = "endGame";
                game2Initialized = false;
                return;
            }
        }

        // Check if the player reached the finish zone.
        if (mouseX > finishZone.x && mouseX < finishZone.x + finishZone.w &&
            mouseY > finishZone.y && mouseY < finishZone.y + finishZone.h) {
            if (!game2Passed) {
                game2Passed = true;
            }
            currentScene = "office";
            game2Initialized = false;
            for (let zone of zones) {
                if (zone.name === "maze") {
                    zone.message = "it no longer attracts you";
                    zone.nextScene = ""; // Same text but I try to concatenate them!
                }
            }
            return;
        }

        // End the game if time runs out.
        if (timeLeft <= 0) {
            currentScene = "endGame";
            game2Initialized = false;
            return;
        }
    }
    function drawGame3() {
        background(220);

        // Calculate elapsed time and remaining time (2 minutes = 120 seconds)
        let elapsed = (millis() - game3StartTime) / 1000;
        let timeLeft = max(300 - elapsed, 0);

        // Set grid drawing offsets (to center the Tetris grid in the 1000x1000 canvas)
        let gridX = 350;  // horizontal offset
        let gridY = 100;  // vertical offset

        // Draw the Tetris grid
        stroke(0);
        for (let j = 0; j < gridRows; j++) {
            for (let i = 0; i < gridCols; i++) {
                fill(tetrisGrid[j][i] ? 100 : 255);
                rect(gridX + i * blockSize, gridY + j * blockSize, blockSize, blockSize);
            }
        }

        // Draw the current fall piece
        for (let j = 0; j < currentPiece.shape.length; j++) {
            for (let i = 0; i < currentPiece.shape[j].length; i++) {
                if (currentPiece.shape[j][i]) {
                    fill(0, 0, 255);
                    rect(gridX + (currentPiece.x + i) * blockSize, gridY + (currentPiece.y + j) * blockSize, blockSize, blockSize);
                }
            }
        }
        // Automatic drop: move the piece down every dropInterval milliseconds
        if (millis() - lastDropTime > dropInterval) {
            currentPiece.y++;
            if (collides(currentPiece, tetrisGrid)) {
                // Piece cannot move further, revert move and merge it
                currentPiece.y--;
                merge(currentPiece, tetrisGrid);
                let cleared = clearLines(tetrisGrid);
                linesCleared += cleared;

                // Check win condition: if cleared lines reach 10, return to the office scene.
                if (linesCleared >= 3) {
                    if (!game3Passed) {
                        game3Passed = true;
                    }
                    currentScene = "office";
                    game3Initialized = false;
                    for (let zone of zones) {
                        if (zone.name === "maze") {
                            zone.message = "it no longer attracts you";
                            zone.nextScene = ""; // Because it's already dealt with all conflicts!
                        }
                    }
                    return;
                }

                // Generate a new pieces
                currentPiece = nextPiece;
                nextPiece = createPiece(random(shapes));

                // If the new piece collides immediately, the grid is full: game over.
                if (collides(currentPiece, tetrisGrid)) {
                    currentScene = "endGame";
                    game3Initialized = false;
                    return;
                }
            }
            lastDropTime = millis();
        }
        // Display timer and score ( lines cleared )
        resetMatrix();
        fill(0);
        textSize(24);
        textAlign(LEFT, TOP);
        text(`Time Left: ${nf(timeLeft,1,1)}s`, 20, 20);
        text(`Lines Cleared: ${linesCleared}`, 20, 50);

        // End game if time runs out.
        if (timeLeft <= 0) {
            currentScene = "endGame";
            game3Initialized = false;
            return;
        }
    }

    function drawEscapeScene() {
        background(220);
        // Draw the extraction scene image to fill the canvas.
        image(escapeImage, 0, 0, width, height);
        // Optionally, display a congratulatory message.
        fill(255);
        textSize(36);
        textAlign(CENTER, CENTER);
        text("You Escaped!", width / 2, height - 50);
    }

    function restartGame() {
        currentScene = "office";
        resizeCanvas(1000,1000)

        // Reset Game Status
        game1Passed = false;
        game2Passed = false;
        game3Passed = false;
        keyObtained = false;

        // Reset Game Initialization Flags
        game1Initialized = false;
        game2Initialized = false;
        game3Initialized = false;

        // Reset any scene-specific timers or game progress
        startTime = 0;
        game2StartTime = 0;
        game3StartTime = 0;
        linesCleared = 0;

        // Reset the Office Interactive Zones
        for (let zone of zones) {
            if (zone.name === "computer1" || zone.name === "computer2" || zone.name === "computer3") {
                zone.message = "You have a strange feeling when you look at the screen";
                zone.nextScene = zone.name === "computer1" ? "game1" : zone.name === "computer2" ? "game2" : "game3";
            }
            if (zone.name === "door") {
                zone.message = "The door is locked, try to escape.";
                zone.nextScene = "";
            }
        }

        // Reset Tetris Grid
        tetrisGrid = createGrid(gridCols, gridRows);

        // Reset Snake Game
        snake = new Snake();
    }


    p.mousePressed = function bindMouse(p) {
        if (currentScene === "offer") {
            currentScene = "office";  // Start the game
            return;
        }
        if (showKeyMenu) {
            // Check if the "Yes" button is clicked.
            // ( Assume the Yes button is drawn as a rectangle at these coordinates.)
            if (mouseX >= width / 2 - 100 && mouseX <= width / 2 - 20 &&
                mouseY >= height / 2 && mouseY <= height / 2 + 40) {
                keyObtained = true;
                for (let zone of zones) {
                    if (zone.name === "door") {
                        zone.message = "the door is unlocked, try to escape";
                        zone.nextScene = "escape";
                    }
                }
            }
            // Hide the menu whether or not "Yes" was clicked.
            showKeyMenu = false;
            return;
        }
        if (currentScene === "endGame") {
            if (mouseX >= width / 2 - 75 && mouseX <= width / 2 + 75 &&
                mouseY >= height / 2 && mouseY <= height / 2 + 50) {
                restartGame();
            }
            return;
        }
        if (currentScene === "office") {
            // Let mutli-mouse be just factored as one in the interaction
            for (let obj of zones) {
                if (mouseX >= 247 && mouseX <= 377 &&
                    mouseY >= 180 && mouseY <= 370) {
                    showKeyMenu = true;
                }
                if (mouseX > obj.x && mouseX < obj.x + obj.w &&
                    mouseY > obj.y && mouseY < obj.y + obj.h) {
                    if (obj.nextScene !== "") {
                        currentScene = obj.nextScene;
                        displayMessage = "";
                        if (currentScene === "escape") {
                            drawEscapeScene();
                        }
                        return;
                    }
                }
            }
        }
    };


    p.keyPressed = function () {
        // Check if It's the Snake Game which applies controlling on this function
        if (p.currentScene === "game1") {
            stage && p5.keyPressed(p5);
        }
        // Control is optional through optionally specifying controlling events 
        // since there is no mouse based framework
    }
    function pointLineDistance(px, py, x1, y1, x2, y2) {
        let A = px - x1;
        let B = py - y1;
        let C = x2 - x1;
        let D = y2 - y1;

        let dot = A * C + B * D;
        let len_sq = C * C + D * D;
        let param = (len_sq !== 0) ? dot / len_sq : -1;
        let xx, yy;
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        let dx = px - xx;
        let dy = py - yy;
        return sqrt(dx * dx + dy * dy);
    };


    p.setup = function() {
        const container = document.getElementById('p5-container');
        p.createCanvas(1000, 1000);
        p.canvas.parent(container);
    }

    p.draw = function() {
        if (p.currentScene === "cover") {
            p.drawCoverScene();
        } else if (p.currentScene === "office") {
            p.drawOfficeScene();
        } else if (p.currentScene === "game1") {
            if (!p.game1Initialized) {
                p.setupGame1();
                p.game1Initialized = true;
            }
            p.drawGame1();
        } else if (p.currentScene === "game2") {
            if (!p.game2Initialized) {
                p.setupGame2();
                p.game2Initialized = true;
            }
            p.drawGame2();
        } else if (p.currentScene === "game3") {
            if (!p.game3Initialized) {
                p.setupGame3();
                p.game3Initialized = true;
            }
            p.drawGame3();
        } else if (p.currentScene === "escape") {
            p.drawEscapeScene();
        } else if (p.currentScene === "endGame") {
            p.drawEndGameScene();
        }
    };


};

// Initialize the sketch when called from the portfolio
window.startP5 = function() {
    if (window.p5Instance) {
        window.p5Instance.remove();
    }
    window.p5Instance = new p5(sketch);
}