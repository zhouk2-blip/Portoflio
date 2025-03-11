class Letter {
    constructor(x, y, scl, p) {
        this.x = x;
        this.y = y;
        this.scl = scl;
        this.p = p;
        this.letter = 'out';
        this.color = '#FF5733';
        this.targetScl = scl;
        this.lerpSpeed = 0.1;
    }
    
    display() {
        // Smoothly interpolate scale
        this.scl = this.p.lerp(this.scl, this.targetScl, this.lerpSpeed);
        
        this.p.push();
        this.p.translate(this.x, this.y);
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        
        // Scale text size based on canvas size
        const baseSize = Math.min(this.p.width, this.p.height) * 0.03;
        this.p.textSize(baseSize * this.scl);
        
        this.p.fill(this.color);
        this.p.text(this.letter, 0, 0);
        this.p.pop();
    }

    updateLetter(letter, color) {
        this.letter = letter;
        this.color = color;
    }

    setScale(newScale) {
        this.targetScl = newScale;
    }
}
