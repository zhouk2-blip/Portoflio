let angle = 0;
let currentProject = null;
let particles = [];

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('p5-container');
    noStroke();
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle(random(width), random(-1000, 0)));
    }
    // Create a container for the interactive fiction iframe
    ifContainer = createDiv('');
    ifContainer.parent('p5-container');
    ifContainer.position(0, 0);
    ifContainer.style('width', '1000px');
    ifContainer.style('height', '1000px');
    ifContainer.style('display', 'none');
    
    // Create controls for the interactive fiction
    ifControls = createDiv('');
    ifControls.parent('p5-container');
    ifControls.position(0, 0);
    ifControls.style('width', '1000px');
    ifControls.style('padding', '20px');
    ifControls.style('display', 'none');
    ifControls.style('text-align', 'center');
    ifControls.style('z-index', '1000');
    
    drawBackground();
}

function draw() {
    if (!currentProject) {
        drawBackground();
        ifContainer.style('display', 'none');
        ifControls.style('display', 'none');
    } else {
        drawProjectViz(currentProject);
    }
    
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].show();
        if (particles[i].isOffScreen()) {
            particles.splice(i, 1);
            particles.push(new Particle(random(width), random(-1000, 0)));
        }
    }
}

function drawBackground() {
    background(20, 30, 50);
    
    // Create a shifting gradient of blue shades
    for (let y = 0; y < height; y += 20) {
        const blue1 = map(sin(angle + y * 0.01), -1, 1, 50, 150);
        const blue2 = map(cos(angle + y * 0.01), -1, 1, 100, 200);
        
        fill(20, blue1, blue2, 50);
        rect(0, y, width, 20);
    }
    
    angle += 0.002;
}

function drawProjectViz(project) {
    switch(project.id) {
        case 1:
            drawProject1(project);
            break;
        case 2:
            drawProject2();
            break;
        case 3:
            drawProject3();
            break;
    }
}

function drawProject1(project) {
    // Show the controls
    ifControls.style('display', 'block');
    
    // Update controls content
    if (ifControls.elt.children.length === 0) {
        ifControls.html(`
            <button onclick="setIframeSrc('${project.indexPath}')" class="if-btn">About the Story</button>
            <button onclick="setIframeSrc('${project.playPath}')" class="if-btn">Play Now</button>
        `);
    }
    
    // Create or update iframe
    if (!ifContainer.elt.querySelector('iframe')) {
        let iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '15px';
        ifContainer.elt.appendChild(iframe);
        
        // Default to index page
        iframe.src = project.indexPath;
    }
    
    ifContainer.style('display', 'block');
    canvas.style('display', 'none');
}

// Add global function for iframe source switching
window.setIframeSrc = function(src) {
    const iframe = ifContainer.elt.querySelector('iframe');
    if (iframe) {
        iframe.src = src;
    }
};

function drawProject2() {
    canvas.style('display', 'block');
    ifContainer.style('display', 'none');
    background(20, 30, 50);
    // Larger wave pattern for 1000x1000 canvas
    for(let x = 0; x < width; x += 40) {
        for(let y = 0; y < height; y += 40) {
            let wave = sin(x * 0.05 + angle) * cos(y * 0.05 + angle) * 100;
            fill(150, 200, 255, wave + 155);
            ellipse(x, y, 20 + wave/2, 20 + wave/2);
        }
    }
    angle += 0.02;
}

function drawProject3() {
    canvas.style('display', 'block');
    ifContainer.style('display', 'none');
    background(20, 30, 50);
    // Larger wave pattern for 1000x1000 canvas
    for(let x = 0; x < width; x += 40) {
        for(let y = 0; y < height; y += 40) {
            let wave = sin(x * 0.05 + angle) * cos(y * 0.05 + angle) * 100;
            fill(150, 200, 255, wave + 155);
            ellipse(x, y, 20 + wave/2, 20 + wave/2);
        }
    }
    angle += 0.02;
}

function setCurrentProject(project) {
    currentProject = project;
    angle = 0;
    if (!project) {
        canvas.style('display', 'block');
        ifContainer.style('display', 'none');
        ifControls.style('display', 'none');
    }
}

class Particle {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, random(1, 3));
        this.word = random(Object.values(data).flat());
    }

    update() {
        this.pos.add(this.vel);
    }

    show() {
        fill(0);
        textSize(16);
        text(this.word, this.pos.x, this.pos.y);
    }

    isOffScreen() {
        return (this.pos.y > height);
    }
}

$.getJSON('story.json', function(data) {
    var grammar = tracery.createGrammar(data);
    var story = grammar.flatten('#origin#');
    $('#projects-container').append('<p>' + story + '</p>');
});