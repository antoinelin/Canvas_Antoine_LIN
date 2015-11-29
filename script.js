var canvas            = document.querySelector('.canvas'),
    context           = canvas.getContext('2d'),
    lineProgress      = [],
    percentProgress   = [],
    progressIncrement = 6,
    incremAccelerated,
    acceleration      = 7,
    globalAlphaLogo   = 0,
    globalAlphaRect   = 0,
    globalAlphaLine   = -5,
    globalAlphaTitle  = 0,
    globalAlphaTxt    = 0,
    globalAlphaIncr   = 0.025,
    width             = 800,
    height            = 600,
    text              = 'Antoine',
    text2             = 'LIN',
    text3             = 'Web site under construction',
    marginLeftLogo    = 248.7,
    marginTopLogo     = 207,
    percentUsed       = 44.8,
    position          = setInTable([], [338, 97], [448, 258], [394, 290], [338, 227], [282, 290], [228, 258], [338, 97]);

// ROUNDED RECTANGLE FUNCTION
function roundRect(x, y, w, h, radius, callback)
{
    x += marginLeftLogo;
    y += marginTopLogo;
    var r             = x + w,
        b             = y + h;

    if(globalAlphaLine > 0) { 
        if(globalAlphaLine - globalAlphaIncr <= 0) globalAlphaLine = 0;
        else globalAlphaLine -= globalAlphaIncr;
        context.globalAlpha = globalAlphaLine;
    }
    else if(globalAlphaLine < -1) context.globalAlpha = 1;
    else context.globalAlpha = globalAlphaLine;
    context.stroke();
    context.fillStyle ="#232323";
    context.moveTo(x+radius, y);
    context.lineTo(r-radius, y);
    context.quadraticCurveTo(r, y, r, y+radius);
    context.lineTo(r, y+h-radius);
    context.quadraticCurveTo(r, b, r-radius, b);
    context.lineTo(x+radius, b);
    context.quadraticCurveTo(x, b, x, b-radius);
    context.lineTo(x, y+radius);
    context.quadraticCurveTo(x, y, x+radius, y);
    if(globalAlphaRect < 1) globalAlphaRect += globalAlphaIncr;
    context.globalAlpha = globalAlphaRect;
    context.fill();
    if(globalAlphaRect >= 1 && callback) callback.call(this);
}

// RESPINSIVE LOGO SIZE SET UP
function setInTable(table, args) {
    var arg = arguments;
    for (var i=1; i<arg.length;i++) {
        table[i]= arg[i];
    }
    return table;
}

// LOGO FUNCTION
function createLogo(table, callback) {
    context.moveTo(marginLeftLogo + percent(table[1][0], percentUsed), marginTopLogo + percent(table[1][1], percentUsed));
    for (var i = 2; i<table.length; i++) context.lineTo(marginLeftLogo + percent(table[i][0], percentUsed), marginTopLogo + percent(table[i][1], percentUsed));
    if(globalAlphaLogo < 1) globalAlphaLogo += globalAlphaIncr;
    context.globalAlpha = globalAlphaLogo;
    context.fillStyle   ="white";
    context.fill();
    context.globalAlpha = 1;
    if (globalAlphaLogo >= 1 && callback) callback.call(this);
    context.globalCompositeOperation = 'destination-over';
}

// LINE ANIMATION FUNCTION
function lineAnimate(context, x0, y0, x1, y1, progress, percentProg, number, callback) {
    if(!progress[number]) {
        progress[number] = 1;
        if(x0<x1) var xSign = "pos";
        else var xSign = "neg";
        if(y0<y1) var ySign = "pos";
        else var ySign = "neg";
        percentProg[number] = { x: percent(Math.abs(x0-x1), 1), y: percent(Math.abs(y0-y1), 1), xSign: xSign, ySign: ySign }
    }
    context.moveTo(x0, y0);
    if(progress[number] < 100) {
        if(percentProg[number].xSign == "pos") {
            if(percentProg[number].ySign == "pos") {
                context.lineTo((x0 + (progress[number] * percentProg[number].x)), (y0 + (progress[number] * percentProg[number].y)));
            }
            else {
                context.lineTo((x0 + (progress[number] * percentProg[number].x)), (y0 - (progress[number] * percentProg[number].y)));
            }
        }
        else {
            if(percentProg[number].ySign == "pos") {
                context.lineTo((x0 - (progress[number] * percentProg[number].x)), (y0 + (progress[number] * percentProg[number].y)));
            }
            else {
                context.lineTo((x0 - (progress[number] * percentProg[number].x)), (y0 - (progress[number] * percentProg[number].y)));
            }
        }
        if (progress[number] <= 50) incremAccelerated = progressIncrement + ((progress[number]/100)*acceleration);
        if (progress[number] > 50) incremAccelerated = progressIncrement + (((50 - (progress[number]%50))/100)*acceleration);
        if(progress[number] + incremAccelerated >= 100) progress[number] = 100;
        else progress[number] += incremAccelerated;
    }
    else {
        context.lineTo(x1, y1);
        if (callback) callback.call(this);
    }
}

// SET VALUES IN PERCENT
function percent(number, NbPercent) {
    return ((number*NbPercent)/100);
}

// "MOVE THE LOGO" FUNCTION 
function moveLogo(callback){
    if(marginLeftLogo > 110) marginLeftLogo -= 10;
    else if(callback) callback.call(this);
}

// TEXT CREATION FUNCTION
function createText(){
    context.font         = '95px Roboto'; 
    context.fillStyle    = 'rgba(60, 60, 60, 1)'
    context.textAlign    = 'left';     
    context.textBaseline = 'top';  
    if(globalAlphaTitle < 1) globalAlphaTitle += globalAlphaIncr;
    context.globalAlpha  = globalAlphaTitle;
    context.fillText(text,351,206);   
    context.fillStyle    = 'rgba(60, 60, 60, 1)'
    context.fillText(text2,345,276);      
    context.font         = '30px Roboto';
    context.textAlign    = 'center';
    if(globalAlphaTxt < 1 && globalAlphaTitle >= 1) globalAlphaTxt += globalAlphaIncr;
    context.globalAlpha  = globalAlphaTxt;
    context.fillText(text3,420,500);
}

// DRAW IMAGE FUNCTION
function draw() {
    window.requestAnimationFrame(draw);
    context.beginPath();
    context.clearRect(0, 0, width, height);
    lineAnimate(context, 475, 0, 475, 800, lineProgress, percentProgress, 0, function(){ 
        lineAnimate(context, 325, 0, 325, 800, lineProgress, percentProgress, 1, function(){ 
            lineAnimate(context, 0, 370, 800, 370, lineProgress, percentProgress, 2, function(){ 
                lineAnimate(context, 0, 220, 800, 220, lineProgress, percentProgress, 3, function(){
                    lineAnimate(context, 0, 549, 549, 0, lineProgress, percentProgress, 4, function(){ 
                        lineAnimate(context, 0, 840, 840, 0, lineProgress, percentProgress, 5, function(){ 
                            lineAnimate(context, 0, 40, 710, 750, lineProgress, percentProgress, 6, function(){ 
                                lineAnimate(context, 250, 0, 750, 500, lineProgress, percentProgress, 7, function(){ 
                                    lineAnimate(context, 230, 0, 680, 660, lineProgress, percentProgress, 8, function(){ 
                                        lineAnimate(context, 25, 800, 584, -20, lineProgress, percentProgress, 9, function(){ 
                                            lineAnimate(context, 138, 0, 710, 673, lineProgress, percentProgress, 10, function(){ 
                                                lineAnimate(context, 660, 0, 0, 780, lineProgress, percentProgress, 11, function(){ 
                                                    lineAnimate(context, 855, 80, 0, 590, lineProgress, percentProgress, 12, function(){ 
                                                        lineAnimate(context, 0, 110, 1310, 900, lineProgress, percentProgress, 13, function(){
                                                            createLogo(position, function(){
                                                                roundRect((325-248.7), (220-207), 150, 150, 7, function() {
                                                                    if(globalAlphaLine < -1) globalAlphaLine = 1;
                                                                    else if(globalAlphaLine == 0) moveLogo(function() {
                                                                        createText(); 
                                                                    });
                                                                }); 
                                                            });
                                                        });  
                                                    }); 
                                                }); 
                                            });
                                        }); 
                                    }); 
                                });
                            });  
                        });  
                    });  
                });
            }); 
        });
    });
    if(globalAlphaLine > 0) { 
        if(globalAlphaLine - globalAlphaIncr <= 0) globalAlphaLine = 0;
        else globalAlphaLine -= globalAlphaIncr;
        context.globalAlpha = globalAlphaLine;
    }
    else if(globalAlphaLine < -1) context.globalAlpha = 1;
    else context.globalAlpha = globalAlphaLine;
    context.strokeStyle = "#232323";
    context.stroke();
}
draw();