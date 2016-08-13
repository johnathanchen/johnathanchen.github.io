var amount = 2; //MOVE
var mode = 0;// 0 = box, 1 = spiral, 2 = both

var canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// canvas.style.width=(window.innerWidth.toString() + "px");
// canvas.style.height=(window.innerHeight.toString() + "px");

var ctx = canvas.getContext('2d');
//ctx.scale(10,2);

ctx.canvas.width  = window.innerWidth * 2;
ctx.canvas.height = window.innerHeight * 2;


//translate(0.5,0.5);

var isLandscape = true;

var width = canvas.width;
var height = canvas.height;


var fibs = [];


var upPressed = false;
var downPressed = false;

function draw(){
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    width = canvas.width;
    height = canvas.height;
    ctx.beginPath();
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.closePath();
    orienter(); //decides if in landscape or portrait mode
    createFibs();
    sizeFibs(); //scales to window size
    posFibs();
    drawFib();
    requestAnimationFrame(draw);

}

function keyThrottler(){
if (upPressed){
        amount++;
    }else if (downPressed){
        if (amount > 2){
        amount--;
        fibs = [];}
    }
}

function orienter(){ //decides if in landscape or portrait mode
    if (width < height){
        isLandscape = false;

        var switcher = height;
        height = width;
        width = switcher;
    }
    else{
        isLandscape = true;
    }

}

function sizeFibs(){//scales to window size
    var largestVol = 0;
    var containerWidth = fibs[fibs.length - 1].vol + fibs[fibs.length-2].vol;
    var containerHeight = fibs[fibs.length - 1].vol;
    var bound;


    largestVol = containerHeight;

    var counter = 0;

    var decrCoeff = 0.9999;
    var incrCoeff = 2 - decrCoeff;

    var coeff = decrCoeff;

    if (largestVol > height){
        while (largestVol > height){
            largestVol *= coeff;
            counter++;
        }
    }
    else{
        while (largestVol < height){
            coeff = incrCoeff;
            largestVol *= coeff;
            counter++;
        }
        counter--;
        largestVol/=coeff;
    }

    largestVol += fibs[fibs.length-2].vol*Math.pow(coeff,counter);
    while (largestVol > width ){
        largestVol *= decrCoeff;
        if (coeff==decrCoeff){
        counter++;
        }
        else{
        counter--;
        }
    }


     for (var i = fibs.length - 1; i >= 0; i--){
         fibs[i].vol *= Math.pow(coeff,counter);
     }
}

function posFibs(){

    var lastX=(width - (fibs[fibs.length-1].vol + fibs[fibs.length - 2].vol))/2;
    var lastY=fibs[fibs.length-1].vol + (height - fibs[fibs.length-1].vol)/2;
    var lastSize = 0;
    for (var i=1; i<=fibs.length; i++){
        var index=fibs.length-i;
        var ele = fibs[index];
        if (i%4==1){
            ele.posX=lastX;
            ele.posY=lastY-ele.vol;
            ele.cirX=ele.posX + ele.vol;
            ele.cirY=ele.posY + ele.vol;
            ele.stTheta=Math.PI;
            ele.edTheta=3*Math.PI/2;
        }
        else if (i%4==2){
            ele.posX=lastX+lastSize;
            ele.posY=lastY;
            ele.cirX=ele.posX;
            ele.cirY=ele.posY+ele.vol;

            if(isLandscape){
                ele.stTheta=3*Math.PI/2; 
                ele.edTheta=0;
            }
            else{
                ele.stTheta=Math.PI/2;
                ele.edTheta=Math.PI;
            }
        }
        else if (i%4==3){
            ele.posX=lastX+lastSize-ele.vol;
            ele.posY=lastY+lastSize;
            ele.cirX=ele.posX;
            ele.cirY=ele.posY;
            ele.stTheta=0;
            ele.edTheta=Math.PI/2;
        }
        else{
            ele.posX=lastX-ele.vol;
            ele.posY=lastY+lastSize-ele.vol;
            ele.cirX=ele.posX+ele.vol;
            ele.cirY=ele.posY;
            // ele.stTheta=Math.PI/2;
            // ele.edTheta=Math.PI;

            ele.stTheta=3*Math.PI/2;
            ele.edTheta=0;

            if(isLandscape){
                ele.stTheta=Math.PI/2;
                ele.edTheta=Math.PI;
            }
            else{
                ele.stTheta=3*Math.PI/2;
                ele.edTheta=0;
            }   

        }
        lastY=ele.posY;
        lastX=ele.posX;
        lastSize=ele.vol;
    }
}

function createFibs(){
    var prev = 0;
    var curr = 1;
    var temp = 0;

    fibs[0] = {vol: curr, val: curr};
    for (var i = 1 ; i < amount; i++){ //creates fib sequence
        temp = curr + prev;
        prev = curr;
        curr = temp;
        fibs[i] = {vol: curr, val: curr};
    }
}

function drawFib(){
    var fontSize;

    // var redPicker = 12;
    // var greenPicker = 39;
    // var bluePicker = 40;

    var redPicker = 13;
    var greenPicker = 21; 
    var bluePicker = 34;


    for (i=0; i<fibs.length; i++){
        // currItem = fibs[i];

        ctx.beginPath();
        ctx.strokeStyle='white';
        ctx.textAlign = "center";
        fontSize = fibs[i].vol * 0.07;
        ctx.font = fontSize.toString() + "px Monaco";
        if (i > 0){
                if (i%3===0){
                    redPicker *=fibs[i].val/fibs[i-1].val;
                    redPicker = redPicker % 256;
                    console.log(redPicker);
                }else if (i%3==1){
                    greenPicker *=fibs[i].val/fibs[i-1].val;
                    greenPicker = greenPicker % 256;
                    console.log(greenPicker);
                }else{
                    bluePicker *=fibs[i].val/fibs[i-1].val;
                    bluePicker = bluePicker % 256;
                    console.log(bluePicker);
                }
            }
            ctx.fillStyle = "rgb("+(Math.round(redPicker)).toString()+","+(Math.round(greenPicker)).toString()+","+ (Math.round(bluePicker)).toString() + ")";

        if (isLandscape){
            if (mode != 1){// boxes || both
                ctx.rect(fibs[i].posX, fibs[i].posY, fibs[i].vol, fibs[i].vol);
                ctx.fill();
                ctx.closePath();
                if (mode == 2){
                    ctx.beginPath();
                    ctx.fillStyle = "white";
                    ctx.fillText(fibs[i].val.toString(), fibs[i].vol/2 + fibs[i].posX, fibs[i].vol/2 + fibs[i].posY); 
                    ctx.fill();
                    ctx.closePath();
                    
                }
                ctx.closePath();
            }
            if(mode != 0){
                ctx.beginPath();
                if (mode == 1)
                    ctx.strokeStyle = "rgb("+(Math.round(redPicker)).toString()+","+(Math.round(greenPicker)).toString()+","+ (Math.round(bluePicker)).toString() + ")";
                else
                    ctx.strokeStyle="white";
                ctx.lineWidth = 3;
                ctx.arc(fibs[i].cirX, fibs[i].cirY , fibs[i].vol, fibs[i].stTheta,fibs[i].edTheta,false);
                ctx.stroke();
                ctx.closePath();
            }

        }
        else{

            if (mode != 1){// boxes || both
                ctx.rect(fibs[i].posY, fibs[i].posX, fibs[i].vol, fibs[i].vol);
                ctx.fill();
                ctx.closePath();
                if (mode == 2){
                    ctx.beginPath();
                    ctx.fillStyle = "white";
                    ctx.fillText(fibs[i].val.toString(), fibs[i].vol/2 + fibs[i].posY, fibs[i].vol/2 + fibs[i].posX); 
                    ctx.fill();
                    ctx.closePath();
                    
                }
                ctx.closePath();
            }
            if(mode != 0){
                ctx.beginPath();
                if (mode == 1)
                    ctx.strokeStyle = "rgb("+(Math.round(redPicker)).toString()+","+(Math.round(greenPicker)).toString()+","+ (Math.round(bluePicker)).toString() + ")";
                else
                    ctx.strokeStyle="white";
                ctx.lineWidth = 3;
                ctx.arc(fibs[i].cirY, fibs[i].cirX, fibs[i].vol, fibs[i].stTheta,fibs[i].edTheta,false);
                ctx.stroke();
                ctx.closePath();
            }

    
        }
        ctx.lineWidth=3;
        //ctx.stroke(); //diamonds!
        ctx.closePath();


    }
    ctx.beginPath();
    ctx.textAlign = "left";
    ctx.font = "20px Monaco";
    ctx.fillStyle = "white";
    ctx.fillText(amount.toString(),5,25); 
    ctx.fill();
    ctx.closePath();
}

window.onkeydown = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;

   if (key == 38) {
       upPressed = true;
   }else if (key == 40) {
       downPressed = true;
   }else if (key == 32){
        mode = (mode + 1) %3;
        console.log(mode);
   }
}

window.onkeyup = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;

   if (key == 38) {
       upPressed = false;
   }else if (key == 40) {
       downPressed = false;
   }
}

setInterval(keyThrottler,100);


draw();