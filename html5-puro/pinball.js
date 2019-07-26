// Canvas configuracion
var canvas = document.getElementById('micanvas');
var ctx = canvas.getContext('2d');

// Pantalla de final del juego por derrota
var perdedor = document.querySelector(".fin-del-juego");
var intervalo;

// Condicion de victoria
var puntaje = 0;

// Pelota configuracion
var x = Math.floor(Math.random() * Math.floor(canvas.width));
var y = canvas.height-(150 - Math.floor(Math.random() * Math.floor(60)));
var dx = 1.5;
var dy = 1.5;
var bolaRadio = 10;

//Raqueta configuracion
var raquetaAlto = 10;
var raquetaAncho = 75;
var raquetaX = (canvas.width-raquetaAncho)/2;
var presionDerecha = false;
var presionIzquierda = false;

//Barrera de bloques configuracion
var bloqueFilaCont = 3;
var bloqueColumnaCont = 5;
var bloqueAncho = 75;
var bloqueAlto = 20;
var bloquePadding = 10;
var bloqueOffsetTop = 30;
var bloqueOffsetLeft = 30;
var bloques = [];

//----------//---------------//---------------//---------------

// Programacion de los bloques
for(var c=0; c < bloqueColumnaCont; c++){
  bloques[c] = [];
  for(var r=0; r < bloqueFilaCont; r++){
    bloques[c][r] = {x: 0, y: 0, estado: 1};
  }
}

function dibujarBloques(){
  for(var c=0; c < bloqueColumnaCont; c++){  
    for(var r=0; r < bloqueFilaCont; r++){

      if(bloques[c][r].estado == 1){
        var bloqueX = (c*(bloqueAncho+bloquePadding))+bloqueOffsetLeft;
        var bloqueY = (r*(bloqueAlto+bloquePadding))+bloqueOffsetTop;

        bloques[c][r].x = bloqueX;
        bloques[c][r].y = bloqueY;
        
        ctx.beginPath();
        ctx.rect(bloqueX,bloqueY,bloqueAncho,bloqueAlto);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Añade la funcion a las teclas deseadas
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
perdedor.addEventListener("click",function(){
  document.location.reload();
})
//Presion de teclas
function keyDownHandler(e) {
     if(e.keyCode == 39) {
         presionDerecha = true;
     }
     else if(e.keyCode == 37) {
         presionIzquierda = true;
     }
 }
 
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        presionDerecha = false;
    }
    else if(e.keyCode == 37) {
        presionIzquierda = false;
    }
}

// Movimiento con el mousemove

function mouseMoveHandler(e){
  var relativoX = e.clientX - canvas.offsetLeft;
  if(relativoX > 0 && relativoX < canvas.width){
    raquetaX = relativoX - raquetaAncho/2;
  };
};

// Programacion de la colicion entre bloque y Bola
function detectarColicion(){
  for(var c=0; c < bloqueColumnaCont; c++){  
    for(var r=0; r < bloqueFilaCont; r++){
      var b = bloques[c][r];
      if(b.estado == 1){
        if(x > b.x && x < b.x+bloqueAncho && y > b.y && y < b.y + bloqueAlto){
          dy = -dy;
          b.estado = 0;
          puntaje++;
          if(puntaje == bloqueFilaCont*bloqueColumnaCont){
            notificacion("Felicitaciones Ganaste");
          }
        }
      }
    }
  }
}

//Programacion Raqueta.
function dibujarRaqueta(){
  ctx.beginPath();
  ctx.rect(raquetaX, canvas.height-raquetaAlto, raquetaAncho, raquetaAlto);
  ctx.fillStyle = "#ff88cc";
  ctx.fill();
  ctx.closePath();
}


//--------------------//-------------------//-------------------
//Programacion Bola.
function moverBola(){
  ctx.beginPath();
  ctx.arc(x, y, bolaRadio, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();   
}

// Programacion de la Condicion de victoria.

function pintarPuntaje(){
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD"
  ctx.fillText("puntaje: "+puntaje, 8, 20);
}


//------------//-------------//------------//------------------
// logica del juego.
function dibujar(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  dibujarBloques();
  moverBola();
  dibujarRaqueta();
  detectarColicion();
  pintarPuntaje();

  if(y + dy < bolaRadio){
    dy = -dy;
  }else if(y + dy > canvas.height-bolaRadio){
    if(x > raquetaX && x < raquetaX + raquetaAncho){
      dy = -dy;
    }else{
      notificacion("Perdiste Fin Del Juego");
    }
  }
  if(x + dx > canvas.width-bolaRadio || x + dx < bolaRadio){
    dx = -dx;
  }
  if(presionDerecha && raquetaX < canvas.width-raquetaAncho){
      raquetaX += 7;
  }
  else if(presionIzquierda && raquetaX > 0) {
      raquetaX -= 7;
  }
    x += dx;
    y += dy;
  }
function notificacion(texto){
  perdedor.style.display = "flex";
  perdedor.innerHTML = texto;
  clearInterval(intervalo);
  return;
}

intervalo = setInterval(dibujar,10);
