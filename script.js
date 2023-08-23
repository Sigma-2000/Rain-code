const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 100,canvas.width/2, canvas.height/2,400);
gradient.addColorStop(0, 'green');
gradient.addColorStop(0.4, 'cyan');
gradient.addColorStop(0.6, 'purple');
gradient.addColorStop(1, 'green');

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
let numHalos = 2; // Number of halo rings
const maxRadius = 50; // Maximum radius of the largest halo
const haloSpacing = 20; // Spacing between halos

class Symbol {
    constructor(x, y, fontSize, canvasHeight){
        this.characters = 
        "カサタナハマヤラワガザダバパイキシチニヒミリヰギジヂビピウクスツヌフムユルグズヅブプエケセテネヘメレヱゲゼデベペオコソトノホモヨロヲンゴゾボポ012345678910ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.text = "";
        this.canvasHeight = canvasHeight;
    }

    draw(context){
        this.text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
        //context.fillStyle = "green"; increase for economic 
        context.fillText(this.text, this.x*this.fontSize, this.y * this.fontSize);
        if (this.y * this.fontSize > this.canvasHeight && Math.random() > 0.98){
            this.y = 0;
        }else{
            this.y += 1;
        }
    }
}

class Effect{
    constructor(canvasWidth, canvasHeight){
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.fontSize = 25;
        this.columns = this.canvasWidth/this.fontSize;
        this.symbols = [];
        this.#initialize();
        console.log(this.symbols);

    }
    #initialize(){
        for (let i=0; i < this.columns; i++){
            this.symbols[i]= new Symbol(i, 0, this.fontSize, this.canvasHeight);
        }
    }
    resize(width, height){
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.columns = this.canvasWidth/this.fontSize;
        this.symbols = [];
        this.#initialize();
    }
}

const effect = new Effect(canvas.width, canvas.height); 
let lastTime = 0;
const fps = 13;
const nextFrame = 1000/fps;
let timer = 0;

function animate(timestamp){
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    if (timer > nextFrame){
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.textAlign = "center";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = /*"green";*/ gradient;
        ctx.font = effect.fontSize + "px monospace";
        effect.symbols.forEach(symbol => symbol.draw(ctx));
        timer = 0;
    }else{
        timer += deltaTime;
    }
    requestAnimationFrame(animate);
}
animate(0); 


function drawHalo(x, y, radius, opacity) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.closePath();
  ctx.globalAlpha = 1; // Reset globalAlpha to default
}


function updateHalos(mouseX, mouseY) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < numHalos; i++) {
      const currentRadius = maxRadius + i * haloSpacing;
      const currentOpacity = 1 - i * 0.1;
      drawHalo(mouseX, mouseY, currentRadius, currentOpacity);
    }
  }

function moreHalos(event){
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
   // Get the mouse coordinates from the event
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    
    // Update numHalos to the desired value
    numHalos += 1; // Increase the number of halos
    
    // Call updateHalos with the updated numHalos value
    updateHalos(mouseX, mouseY);
    }
  
canvas.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    updateHalos(mouseX, mouseY);
  })

canvas.addEventListener('click', moreHalos);


window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    effect.resize(canvas.width, canvas.height);
});
