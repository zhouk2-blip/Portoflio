// Project data
const projects = [
    {
        id: 1,
        title: "Life after death - Interactive Fiction",
        preview: "Click to explore an immersive interactive fiction experience",
        description: "An engaging interactive fiction piece that explores the themes of life and death. Experience the story through an interactive canvas.",
        fullDescription: `
            <h2>Interactive Fiction Experience</h2>
            <p>Dive into a compelling narrative where your choices matter. This interactive fiction piece combines storytelling with interactive elements.</p>
            <h2>Features</h2>
            <ul>
                <li>Immersive storytelling experience</li>
                <li>Interactive choices that affect the narrative</li>
                <li>Multiple entry points - read about the story or jump right in</li>
            </ul>
        `,
        buttons: [
            { label: "About the Story", action: "showIndex" },
            { label: "Play Now", action: "showPlay" }
        ],
        media: [
            { type: 'image', url: 'interactive fiction/Cover.jpg', caption: 'Story Cover' }
        ],
        indexPath: "interactive fiction/index.html",
        playPath: "interactive fiction/play.html",
        githubLink: "#"
    },
    {
        id: 2,
        title: "Escape Room - P5.js Game",
        preview: "Click to play an immersive escape room game",
        description: "An interactive escape room game built with P5.js. Test your problem-solving skills in this engaging experience.",
        fullDescription: `
            <h2>P5.js Escape Room Game</h2>
            <p>Challenge yourself with this interactive escape room experience. Navigate through the room, find clues, and solve puzzles to escape!</p>
            <h2>Features</h2>
            <ul>
                <li>Interactive gameplay using P5.js</li>
                <li>Engaging puzzles and challenges</li>
                <li>Immersive room exploration</li>
            </ul>
            <div class="source-link">
                <p>Want to see how it works? Check out the <a href="https://editor.p5js.org/zhouk2/sketches/sKwA40Ydz" target="_blank" class="source-btn">source code on P5.js Editor</a></p>
            </div>
        `,
        buttons: [
            { label: "Play Game", action: "playGame" }
        ],
        media: [
            { type: 'image', url: 'Game/gamecover.jpg', caption: 'Game Cover' }
        ],
        playPath: "Game/index.html",
        githubLink: "#"
    },
    {
        id: 3,
        title: "A Cento of Stories",
        preview: "An experimental literary piece that gradually reveals a story",
        description: "A poetic story experience that unfolds gradually before your eyes, combining classic literary fragments into a new narrative.",
        fullDescription: `
            <h2>A Cento of Stories</h2>
            <p>Experience a unique literary piece that combines fragments from various classic texts into a new narrative. Watch as the story unfolds line by line, creating a mesmerizing reading experience.</p>
            
            <h2>Features</h2>
            <ul>
                <li>Gradual text revelation</li>
                <li>Carefully curated literary fragments</li>
                <li>Atmospheric presentation</li>
                <li>Immersive reading experience</li>
            </ul>
        `,
        buttons: [
            { label: "Start Reading", action: "startCento" }
        ]
    }
];

let activeCard = null;
let isGameActive = false;
let isML5Active = false;

function createProjectCards() {
    const container = document.getElementById('projects-container');

    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'card';

        let buttonsHTML = '';
        if (project.buttons) {
            buttonsHTML = `
                <div class="project-buttons">
                    ${project.buttons.map(btn => `
                        <button class="btn" data-action="${btn.action}" data-project-id="${project.id}">${btn.label}</button>
                    `).join('')}
                </div>
            `;
        } else if (project.liveLink) {
            buttonsHTML = `
                <div class="links">
                    <a href="${project.liveLink}" class="btn" target="_blank">View Live</a>
                    <a href="${project.githubLink}" class="btn" target="_blank">GitHub</a>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="card-content">
                <h2>${project.title}</h2>
                <p class="preview">${project.preview}</p>
                <div class="details">
                    <p>${project.description}</p>
                    ${project.fullDescription || ''}
                    ${buttonsHTML}
                </div>
            </div>
        `;

        // Add click event for card expansion and canvas update
        card.addEventListener('click', (e) => {
            if (e.target.matches('button[data-action]')) {
                handleProjectAction(e.target.dataset.action, project);
                return;
            }

            if (activeCard === card) {
                card.classList.remove('active');
                activeCard = null;
                setCurrentProject(null);
            } else {
                if (activeCard) {
                    activeCard.classList.remove('active');
                }
                card.classList.add('active');
                activeCard = card;
                setCurrentProject(project);
            }
        });

        container.appendChild(card);
    });
}

// Add event listener for ESC key to exit
document.addEventListener('DOMContentLoaded', createProjectCards);

function handleProjectAction(action, project) {
    switch (action) {
        case 'showIndex':
            window.location.href = project.indexPath;
            break;
        case 'showPlay':
        case 'playGame':
            window.location.href = project.playPath;
            break;
        case 'startCento':
            startCentoStory();
            break;
    }
}

function startCentoStory() {
    const container = document.getElementById('p5-container');
    container.style.display = 'block';
    container.innerHTML = `
        <div class="cento-container">
            <button class="close-btn">&times;</button>
            <h1>A Cento of Stories</h1>
            <div class="scroll-indicator">Scroll to read more</div>
            <div class="loading">Loading story...</div>
            <div class="poem"></div>
        </div>
    `;
    
    // Add click handler for close button
    container.querySelector('.close-btn').addEventListener('click', () => {
        container.style.display = 'none';
        container.innerHTML = '';
    });
    
    // Handle scroll indicator
    const centoContainer = container.querySelector('.cento-container');
    const scrollIndicator = container.querySelector('.scroll-indicator');
    
    centoContainer.addEventListener('scroll', () => {
        if (centoContainer.scrollTop > 50) {
            scrollIndicator.classList.add('fade-out');
        } else {
            scrollIndicator.classList.remove('fade-out');
        }
    });
    
    // Load and start the Cento story
    fetch('centostory/index.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const poemLines = Array.from(doc.querySelectorAll('.poem p'));
            
            const poemContainer = container.querySelector('.poem');
            const loadingElement = container.querySelector('.loading');
            loadingElement.remove();
            
            let delay = 1000;
            
            poemLines.forEach((line, index) => {
                const p = document.createElement('p');
                p.innerHTML = line.innerHTML;
                p.classList.add('hidden');
                poemContainer.appendChild(p);
                
                setTimeout(() => {
                    p.classList.remove('hidden');
                    // Smooth scroll to newly revealed line
                    if (index > 2) { // Start scrolling after a few lines
                        p.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, delay * (index + 1));
            });
        })
        .catch(error => {
            console.error('Error loading story:', error);
            container.innerHTML = '<p style="color: white;">Error loading the story. Please try again.</p>';
        });
}

// Add ESC key handler to exit story
$(document).on('keydown', function(e) {
    if (e.key === 'Escape') {
        const container = document.getElementById('p5-container');
        if (container) {
            container.style.display = 'none';
            container.innerHTML = '';
        }
    }
});
$(document).ready(function() {
    $.getJSON('story.json', function(data) {
        var grammar = tracery.createGrammar(data);
        var story = grammar.flatten('#origin#');
        $('#projects-container').append('<p>' + story + '</p>');

        let particles = [];

        function setup() {
            let canvas = createCanvas(windowWidth, windowHeight);
            canvas.parent('p5-container');
            for (let i = 0; i < 100; i++) {
                particles.push(new Particle(random(width), random(-1000, 0)));
            }
        }

        function draw() {
            background(255, 255, 255, 0);
            for (let i = particles.length - 1; i >= 0; i--) {
                particles[i].update();
                particles[i].show();
                if (particles[i].isOffScreen()) {
                    particles.splice(i, 1);
                    particles.push(new Particle(random(width), random(-1000, 0)));
                }
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

        new p5();
    });
});
