let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Combined move handler for both mouse and touch events
    const moveHandler = (e) => {
      // Handle mouse or touch coordinates
      const eventX = e.clientX || (e.touches && e.touches[0].clientX);
      const eventY = e.clientY || (e.touches && e.touches[0].clientY);

      if (!this.rotating) {
        this.mouseX = eventX;
        this.mouseY = eventY;
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = eventX - this.mouseTouchX;
      const dirY = eventY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;
      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;

      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    // Combined down handler for both mouse and touch events
    const downHandler = (e) => {
      if (this.holdingPaper) return;

      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;

      const eventX = e.clientX || (e.touches && e.touches[0].clientX);
      const eventY = e.clientY || (e.touches && e.touches[0].clientY);

      this.mouseTouchX = eventX;
      this.mouseTouchY = eventY;
      this.prevMouseX = eventX;
      this.prevMouseY = eventY;

      if (e.button === 2 || (e.touches && e.touches.length > 1)) {
        this.rotating = true;
      }
    };

    // Unified up handler for both mouse and touch events
    const upHandler = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    // Mouse event listeners
    document.addEventListener('mousemove', moveHandler);
    paper.addEventListener('mousedown', downHandler);
    window.addEventListener('mouseup', upHandler);

    // Touch event listeners
    document.addEventListener('touchmove', moveHandler);
    paper.addEventListener('touchstart', downHandler);
    window.addEventListener('touchend', upHandler);
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
