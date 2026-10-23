document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("bgCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const isSubpage = window.location.pathname.includes("/pages/");
  const imagePrefix = isSubpage ? "../images/" : "./images/";

  const fishImage = new Image();
  const bubbleImage = new Image();

  let fishLoaded = false;
  let bubbleLoaded = false;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  class SwimmingFish {
    constructor() {
      this.init(true);
    }

    init(isFirstLoad = false) {
      this.width = 300; 
      this.height = 150;
      this.scale = 0.4 + Math.random() * 0.4; 
      this.scaledWidth = this.width * this.scale;
      this.scaledHeight = this.height * this.scale;

      this.x = isFirstLoad 
        ? Math.random() * (canvas.width + this.scaledWidth) 
        : canvas.width + this.scaledWidth;
      this.y = Math.random() * (canvas.height - this.scaledHeight);

      this.speed = 0.5 + Math.random() * 1.2;          
      this.waveSpeed = 0.01 + Math.random() * 0.02;     
      this.waveRange = 15 + Math.random() * 25;         
      this.angle = Math.random() * Math.PI;             
      this.opacity = 0.5 + Math.random() * 0.3;
    }

    update() {
      this.x -= this.speed;          
      this.angle += this.waveSpeed;  
      this.currentY = this.y + Math.sin(this.angle) * this.waveRange;
      this.rotation = Math.cos(this.angle) * 0.08; 

      if (this.x < -this.scaledWidth) {
        this.init(false);
      }
    }

    draw() {
      ctx.save(); 
      ctx.translate(this.x + this.scaledWidth / 2, this.currentY + this.scaledHeight / 2);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;
      ctx.drawImage(
        fishImage, 
        -this.scaledWidth / 2, 
        -this.scaledHeight / 2, 
        this.scaledWidth, 
        this.scaledHeight
      );
      ctx.restore(); 
    }
  }

  class Bubble {
    constructor() {
      this.init(true);
    }

    init(isFirstLoad = false) {
      this.baseWidth = 120;
      this.baseHeight = 150;
      this.scale = 0.35 + Math.random() * 0.4;
      this.scaledWidth = this.baseWidth * this.scale;
      this.scaledHeight = this.baseHeight * this.scale;

      this.x = Math.random() * canvas.width;
      this.y = isFirstLoad 
        ? Math.random() * canvas.height 
        : canvas.height + this.scaledHeight + Math.random() * 50;

      this.speed = 0.8 + Math.random() * 1.5;
      this.wobbleSpeed = 0.02 + Math.random() * 0.03;
      this.wobbleRange = 10 + Math.random() * 15;
      this.angle = Math.random() * Math.PI * 2;
      this.opacity = 0.45 + Math.random() * 0.35;
    }

    update() {
      this.y -= this.speed;
      this.angle += this.wobbleSpeed;
      this.currentX = this.x + Math.sin(this.angle) * this.wobbleRange;

      if (this.y < -this.scaledHeight) {
        this.init(false);
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.drawImage(
        bubbleImage,
        this.currentX,
        this.y,
        this.scaledWidth,
        this.scaledHeight
      );
      ctx.restore();
    }
  }

  const fishSchool = Array.from({ length: 5 }, () => new SwimmingFish());
  const bubbleCluster = Array.from({ length: 8 }, () => new Bubble());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bubbleCluster.forEach(b => {
      b.update();
      b.draw();
    });

    fishSchool.forEach(f => {
      f.update();
      f.draw();
    });

    requestAnimationFrame(animate);
  }

  function checkReady() {
    if (fishLoaded && bubbleLoaded) {
      animate();
    }
  }

  fishImage.onload = () => { fishLoaded = true; checkReady(); };
  bubbleImage.onload = () => { bubbleLoaded = true; checkReady(); };

  fishImage.src = `${imagePrefix}hoon.png`;
  bubbleImage.src = `${imagePrefix}bubbles.png`;

  
  if (fishImage.complete) fishLoaded = true;
  if (bubbleImage.complete) bubbleLoaded = true;
  checkReady();
});