// Set up Canvas and Context
const canvas = document.querySelector('#zone-signature');
const ctx = canvas.getContext('2d');
ctx.strokeLine = "#222222";
ctx.lineWidth = 2;

// Set up Mouse events for drawing in canvas
let drawStarted = false;
let drawing = false;
let mousePosition = { x: 0, y: 0 };
let lastPosition = mousePosition;

// Get Mouse position in canvas
function getMousePosition(canvasDom, mouseEvent) {
    let rect = canvasDom.getBoundingClientRect();
    return {
        x: mouseEvent.clientX - rect.left,
        y: mouseEvent.clientY - rect.top
    };
}

// Get Touch Position in canvas
function getTouchPosition(canvasDom, touchEvent) {
    let rect = canvasDom.getBoundingClientRect();
    return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top
    };
}






// Mouse events
canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    drawStarted = true;
    lastPosition = getMousePosition(canvas, e);
}, false)

canvas.addEventListener("mouseup", function (e) {
    drawing = false;
}, false);

canvas.addEventListener('mouseout', () => {
    drawing = false;
})

canvas.addEventListener("mousemove", function (e) {
    mousePosition = getMousePosition(canvas, e);
}, false);




// Get a regular interval for drawing to the screen
window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame || 
       window.webkitRequestAnimationFrame ||
       window.mozRequestAnimationFrame ||
       window.oRequestAnimationFrame ||
       window.msRequestAnimaitonFrame ||
       function (callback) {
    window.setTimeout(callback, 1000/60);
       };
})();


// Draw to the canvas
function renderCanvas() {
    if (drawing) {
      ctx.moveTo(lastPosition.x, lastPosition.y);
      ctx.lineTo(mousePosition.x, mousePosition.y);
      ctx.stroke();
      lastPosition = mousePosition;
    }
}

// Allow for animation
(function drawLoop () {
requestAnimFrame(drawLoop);
renderCanvas();
})();

// Touch events for mobile devices etc...
canvas.addEventListener('touchstart', (e) => {
    mousePosition = getTouchPosition(canvas, e);
    let touch = e.touches[0];
    let mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}, false)

canvas.addEventListener("touchend", function (e) {
    var mouseEvent = new MouseEvent("mouseup", {});
    canvas.dispatchEvent(mouseEvent);
}, false);

canvas.addEventListener('touchmove', (e) => {
    drawStarted = true;
    let touch = e.touches[0];
    let mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}, false)


// Prevent scrolling when touching the canvas
document.body.addEventListener('touchstart', (e) => {
    if (e.target == canvas) {
        e.preventDefault();
    }
})
document.body.addEventListener('touchend', (e) => {
    if (e.target == canvas) {
        e.preventDefault();
    }
})
document.body.addEventListener('touchmove', (e) => {
    if (e.target == canvas) {
        e.preventDefault();
    }
})







// Bouton Effacer
document.querySelector('#btn-effacer').addEventListener('click', clearCanvas);
function clearCanvas() {
    drawStarted = false;
    canvas.width = canvas.width;
}

// Bouton Valider

    document.querySelector('#btn-valider').addEventListener('click', (e) => {
        if(drawStarted) {
            e.preventDefault();
            document.querySelector('span.alert').innerHTML = "";

            let signature = {
                image: canvas.toDataURL("image.png").replace("image.png", "image/octet-stream.jpg"),
            }
        
            fetch("./signature.php", {
                method: "POST",
                body: JSON.stringify(signature)
            }).then((response) => {
                // On efface le canvas
                clearCanvas();
            })
        }
        else {
            document.querySelector('span.alert').innerHTML = "Merci de déposer votre signature !";
        }
    })
