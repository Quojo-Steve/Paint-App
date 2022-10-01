const canvas = document.querySelector("canvas"),
    toolBtns = document.querySelectorAll(".tool"),
    fillColor = document.querySelector("#fill-color"),
    clearCanvas = document.querySelector(".clear-canvas"),
    saveImg = document.querySelector(".save-img"),
    sizeSlider = document.querySelector("#size-slider"),
    colorBtns = document.querySelectorAll(".colors .option"),
    colorPicker = document.querySelector("#color-picker")
    ctx = canvas.getContext('2d');

// global variables with default values
let prevMouseX, prevMouseY, snapshot,
    isDrawing = false,
    selectedtool = "brush",
    selectedColor = "#000",
    brushWidth = 5;

const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
}

window.addEventListener("load", () => {
    //setting canvas width & height
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawRectangle = (e) => {
    //if fillcolor isn't checked then don't fill it
    if (!fillColor.checked) {
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);  
}

const drawCircle = (e) => {
    ctx.beginPath(); //creaing new path to draw circle
    //getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);// creating the circle according to the mouse pointer
    fillColor.checked ? ctx.fill() : ctx.stroke();
}
const drawLine = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
}

const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY); //moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); //creating bottom line of triangle
    ctx.closePath(); // closing path of a triangle so the third draw automatically
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; //passing current mouse position as prevmousex value
    prevMouseY = e.offsetY; //passing current mouse position as prevmouseY value
    ctx.beginPath(); //creating new path after uve stopped holding the mouse down for a new one to begin after next click
    ctx.lineWidth = brushWidth; //passing brush size as line width
    ctx.strokeStyle = selectedColor; //passing selected color as stroke style
    ctx.fillStyle = selectedColor; //passing selected color as stroke style
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height); //copying canvas data & passing as snapshot value.. this avoids dragging the image
}

const drawing = (e) => {
    if (!isDrawing) return; //if isdrawing is false return from here
    ctx.putImageData(snapshot, 0, 0); // adding copied canvas data on this canvas 

    if (selectedtool === "brush" || selectedtool === "eraser") {
        ctx.strokeStyle = selectedtool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); //creating line according to the mouse pointer
        ctx.stroke(); //drawing or filing line with color
    } else if (selectedtool === "rectangle") {
        drawRectangle(e);
    } else if (selectedtool === "circle") {
        drawCircle(e);
    } else if (selectedtool === "triangle") {
        drawTriangle(e);
    }
    
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { //adding click event to all tool options
        //removing active class and adding it to the clicked tool
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedtool = btn.id;
        console.log(selectedtool);
    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);//clearing whole canvas
    setCanvasBackground();
});

saveImg.addEventListener("click", () => {
    const link = document.createElement("a"); //creating <a> tag
    link.download = `${Date.now()}.jpg` //passing current date as link download value
    link.href = canvas.toDataURL();
    link.click();
})

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false); //once u leave the mouse the line stops drawing
