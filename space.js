"use strict";
// Images from i.imgur.com
//https://geckzilla.com/apod/tycho_cyl_glow.png - background2
// Planet sizes: https://www.jpl.nasa.gov/infographics/infographic.view.php?id=10749
//               Pluto: https://solarsystem.nasa.gov/planets/dwarf-planets/pluto/by-the-numbers/
// Planet distances: https://www.enchantedlearning.com/subjects/astronomy/planets/
// Moon: http://hyperphysics.phy-astr.gsu.edu/hbase/Solar/moonscale.html




/**********************
* VARIABLE INITIALIZATION
***********************/
const numPlanets = 12;
// TEXTURES
var sunImage = new Image();
var mercuryImage = new Image();
var venusImage = new Image();
var marsImage = new Image();
var earthImage = new Image();
var moonImage = new Image();
var jupiterImage = new Image();
var saturnImage = new Image();
var uranusImage = new Image();
var neptuneImage = new Image();
var plutoImage = new Image();
var earthImage = new Image();
var spaceImage = new Image();
var shipImage = new Image();
sunImage.src = './planet_textures/sun.png';
mercuryImage.src = './planet_textures/mercury.jpg';
venusImage.src = './planet_textures/venus.jpg';
earthImage.src = './planet_textures/earth.jpg';
moonImage.src = './planet_textures/moon.jpg';
marsImage.src = './planet_textures/mars.jpg';
jupiterImage.src = './planet_textures/jupiter.jpg';
saturnImage.src = './planet_textures/saturn.jpg';
uranusImage.src = './planet_textures/uranus.jpg';
neptuneImage.src = './planet_textures/neptune.jpg';
plutoImage.src = './planet_textures/pluto.jpg';
spaceImage.src = './planet_textures/background2.jpg';
shipImage.src = './planet_textures/metal.jpg';

var textureImages=[ spaceImage, sunImage, mercuryImage,venusImage, earthImage,moonImage,
                marsImage, jupiterImage, saturnImage, uranusImage, neptuneImage, plutoImage, shipImage];


// Distance between planets
const distanceDivider = 5913;
const pd = [0.0, 0.0, 57.9/distanceDivider, 108.2/distanceDivider, 149.6/distanceDivider,
                        0.384/distanceDivider,227.9/distanceDivider, 778.3/distanceDivider, 1427/distanceDivider,
                        2871/distanceDivider, 4497.1/distanceDivider, 5913/distanceDivider]

// Make space sphere larger than the last distance
const spaceSize = pd[pd.length-1] + pd[pd.length-1]/2;

// Make planet sizes relative to the distance between planets
const psDivider = 10000;
const sunSize = spaceSize/psDivider;///10000;
const ps = [spaceSize*1.4, sunSize, sunSize/277, sunSize/133, sunSize/108, sunSize/108,//(sunSize/108)*0.27,
            sunSize/208, sunSize/9.7,sunSize/11.4, sunSize/26.8, sunSize/27.7, sunSize/(108*5.5)]

// Speed for planet translation
const speedTransBase = 0.0000001*180/Math.PI;
const pt = [0, 0, speedTransBase/9, speedTransBase/8, speedTransBase/7, speedTransBase/8,
            speedTransBase/6, speedTransBase/7,speedTransBase/8, speedTransBase/9, speedTransBase/15, speedTransBase/100000]


// Speed for planet rotation
const speedRotationBase = 10;
const speedRotation = [speedRotationBase/520, speedRotationBase/11, speedRotationBase/10, speedRotationBase/9, speedRotationBase/8,
                    speedRotationBase/7, speedRotationBase/6, speedRotationBase/5,speedRotationBase/4, speedRotationBase/3, speedRotationBase/2, speedRotationBase/5]
var pr=[];
// Initialise planet rotation
for (let p=0; p<numPlanets; p++) pr.push(0.0);

// Initialise planet coordinates
var pc = []
for (let i=0; i<pd.length; i++){
  pc.push(vec3(0.0, 0.0, pd[i]));
}


var numVerticesSphere = 0;
// model view stack to store each Object
var stack = [];
// each object in the hierarchy
var figure = [];

// Figure IDs
const spaceId = 0;
const sunId = 1;
const mercuryId = 2;
const venusId = 3;
const earthId = 4;
const moonId = 5;
const marsId = 6;
const jupiterId = 7;
const saturnId = 8;
const uranusId = 9;
const neptuneId = 10;
const plutoId  = 11;
const bodyId = 12;
const leftWingId = 13;
const rightWingId = 14;

// Variable to store what planet to follow; -1 will go to the sun (0,0,x)
var followPlanet = 4;
// Camera will move around
var cameraCoord = vec3(0.0,0.0,0.0);
// Ship will also move, but fixed relative to the camera
var shipCoord = vec3(0.0,0.0,0.0);
// Ship size
var shipBodySize = [ps[5]/5, ps[5]/5, ps[5]/5];
var shipWingSize = [shipBodySize[0]*2,shipBodySize[1]/2,shipBodySize[2]/2];

/**********SHIP vertices, normals and indices for rendering**********/
var verticesShip = new Float32Array([ 0.5, 0.5, 0.5,  -0.5, 0.5, 0.5,  -0.5,-0.5, 0.5,   0.5,-0.5, 0.5,   // v0,v1,v2,v3 (front)
                        0.5, 0.5, 0.5,   0.5,-0.5, 0.5,   0.5,-0.5,-0.5,   0.5, 0.0,-0.5,   // v0,v3,v4,v5 (right)
                        0.5, 0.5, 0.5,   0.5, 0.0,-0.5,  -0.5, 0.0,-0.5,  -0.5, 0.5, 0.5,   // v0,v5,v6,v1 (top)
                       -0.5, 0.5, 0.5,  -0.5, 0.0,-0.5,  -0.5,-0.5,-0.5,  -0.5,-0.5, 0.5,   // v1,v6,v7,v2 (left)
                       -0.5,-0.5,-0.5,   0.5,-0.5,-0.5,   0.5,-0.5, 0.5,  -0.5,-0.5, 0.5,   // v7,v4,v3,v2 (bottom)
                        0.5,-0.5,-0.5,  -0.5,-0.5,-0.5,  -0.5, 0.0,-0.5,   0.5, 0.0,-0.5 ]); // v4,v7,v6,v5 (back)

// normal array
var normalsShip  = new Float32Array([ 0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,   // v0,v1,v2,v3 (front)
                        1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,   // v0,v3,v4,v5 (right)
                        0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,   // v0,v5,v6,v1 (top)
                       -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,   // v1,v6,v7,v2 (left)
                        0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0,   // v7,v4,v3,v2 (bottom)
                        0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1 ]); // v4,v7,v6,v5 (back)

var indicesShip = new Uint16Array([0, 1, 2,   2, 3, 0,      // front
                       4, 5, 6,   6, 7, 4,      // right
                       8, 9,10,  10,11, 8,      // top
                      12,13,14,  14,15,12,      // left
                      16,17,18,  18,19,16,      // bottom
                      20,21,22,  22,23,20]);

// Texture coordinates for the ship - they will use the whole image.
var texCoordShip = [];
for (let t=0; t<6;t++){
  texCoordShip.push(0,0,0,1,1,1,1,0);
}
texCoordShip = new Float32Array(texCoordShip);

// Variable to store initialised textures
var figureTextures = [];

// Arrays to store sphere rendering data
var vPositionData = [];
var vNormalData = [];
var vTextCoordData = [];
var indexData = [];

// WebGL core variables
var canvas;
var gl;
var program;

// Create buffer objects.
var vPositionBuffer;
var vNormalBuffer;
var indexBuffer;
var texCoordBuffer;
var vPosition;

// Assign normal to attrib and enable it.
var vNormal;

var vTextCoord;

// View vectors
var eye = vec3(0.0,0.0,0.0);
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

// Variables to store rotation of the camera with the mouse
var sx = 0.0;
var sy = 0.0;
var sz = 0.0;
// Variables to store translation of the camera using the keys
var tx = 0.0;
var ty = 0.0;
var tz = 0.0;

// Mouse coordinates on the canvas init
var mouse_x = 0;
var mouse_y = 0;


var pLeft= -1.0;
var pRight = 1.0;
var pBottom = -1.0;
var pTop = 1.0;
// Make pNear same as the smaller size in the planets to always see the planets full size on screen
var pNear = Math.min.apply(null, ps.slice(2));
// pFar updated if Z in camera changes to avoid clipping.
var pFar = 10000;
var pFovy = 60;
var aspectRatio, perspectiveAspectRatio;
// Speeds for camera movement and planet rotation steps
var step = 1/(psDivider*1000);
var speedX = 0.0;
var speedY = 0.0;
var speedZ = 0.0;

var instanceMatrix;
var projectionMatrix, projectionMatrixLoc;
var modelViewMatrix, modelViewMatrixLoc;
var modelViewMatrixPersp;

var animate = true;
var enableMouse = true;

// Needed to check if textures are power of two
function IsPowerOfTwo(x)
{
    return (x & (x - 1)) == 0;
}
// Turn radians to degrees
function degrees(x){
  return x*180/Math.PI;
}

// Function to init textures
function initTextures(id, image){
  figureTextures[id] = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, figureTextures[id]);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  // Check if the image is a power of 2 in both dimensions.
  if (IsPowerOfTwo(image.width) && IsPowerOfTwo(image.height)) {
     // Yes, it's a power of 2. Generate mips.
      gl.generateMipmap(gl.TEXTURE_2D);
  } else {
     // No, it's not a power of 2. Turn off mips and set wrapping to clamp to edge
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }

}

// function to create a new node.
// Transform =  transformation matrix of the node
// Render = render function for each object.
// Sibling = a sibling node.
// child = a child node
function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}

// Trasverse a hierarchical object - either the environment or the ship.
// When transversing, the original model view is saved, modified for the new part and then restored.
// If the node has a child it recursevily calls trasverse
function traverse(Id) {
   if(Id == null) return;
   stack.push(modelViewMatrixPersp);
   modelViewMatrixPersp = mult(modelViewMatrixPersp, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
   modelViewMatrixPersp = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}

// Initialise the ship: body and 2 wings
// Translation of the ship depends on whether a planet is being followed
// If a planet is followed, used that planet coordinates with an offset to see the ship on a colorFragmentShader
// Substract the camera translation to keep the ship in the same place
// If not following a planet, use the ship coordinates directly
// Body is the parent. Winds are childs
// The body and wing rotates when the camera is moving.
// It then adds each part to the figures array.
function initShip(Id) {
    var m = mat4();
    let incX;
    let incZ;
    switch(Id) {
      // Space.
      case bodyId:
        if (followPlanet>-1){
          m = translate(pc[followPlanet][0] - 0.0000005-tx, pc[followPlanet][1]- 0.0000005-ty, -shipCoord[2]-0.0000015-tz);
        } else {
          m = translate(shipCoord[0]- 0.0000005-tx, shipCoord[1]- 0.0000005-ty, -shipCoord[2]-0.0000015-tz);
        }
        incX = -degrees(speedZ*(psDivider*70));
        incZ = degrees(speedX*(psDivider*90));
        if (incX>45){
          incX=45;
        } else if (incX<-45){
          incX=-45;
        }
        if (incZ>45){
          incZ=45;
        } else if (incZ<-45){
          incZ=-45;
        }
        m = mult(m,rotate(incZ, 0, 0, 1 ));
        m = mult(m,rotate(incX, 1, 0, 0 ));
        figure[bodyId] = createNode( m, body, null, leftWingId );
        break;
      case leftWingId:
        m = translate(-shipBodySize[0]/2,0.0,0.0);
        incX = degrees(speedZ*(psDivider*70));
        incZ = degrees(speedX*(psDivider*90));
        if (incX>45){
          incX=45;
        } else if (incX<-45){
          incX=-45;
        }
        if (incZ>45){
          incZ=45;
        } else if (incZ<-45){
          incZ=-45;
        }
        m = mult(m,rotate(-incZ, 0, 0, 1 ));
        m = mult(m,rotate(-incX, 1, 0, 0 ));
        figure[leftWingId] = createNode( m, leftWing, rightWingId, null );
        break;
      case rightWingId:
        m = translate(shipBodySize[0]/2,0.0,0.0);
        incX = degrees(speedZ*(psDivider*70));
        incZ = degrees(speedX*(psDivider*90));
        if (incX>45){
          incX=45;
        } else if (incX<-45){
          incX=-45;
        }
        if (incZ>45){
          incZ=45;
        } else if (incZ<-45){
          incZ=-45;
        }
        m = mult(m,rotate(-incZ, 0, 0, 1 ));
        m = mult(m,rotate(-incX, 1, 0, 0 ));
        figure[rightWingId] = createNode( m, rightWing, null, null );
        break;

    }
  }

  // Transformation functions for the ship: translation and size
  // Load the textures and draw elements
  function body() {
      instanceMatrix = mult(modelViewMatrixPersp, translate(0,0,0));
      instanceMatrix = mult(instanceMatrix, scale4(shipBodySize[0], shipBodySize[1], shipBodySize[2]));
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
      gl.uniform1i(gl.getUniformLocation( program, "textures"), 12);
      gl.drawElements(gl.TRIANGLES, 36  , gl.UNSIGNED_SHORT, 0);

  }
  function leftWing() {
      instanceMatrix = mult(modelViewMatrixPersp, translate(-shipWingSize[0]/2, 0.0, 0.0) );

      instanceMatrix = mult(instanceMatrix, scale4( shipWingSize[0], shipWingSize[1], shipWingSize[2]));
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
      gl.uniform1i(gl.getUniformLocation( program, "textures"), 12);
      gl.drawElements(gl.TRIANGLES, 36  , gl.UNSIGNED_SHORT, 0);

  }
  function rightWing() {
      instanceMatrix = mult(modelViewMatrixPersp, translate(shipWingSize[0]/2, 0.0, 0.0) );

      instanceMatrix = mult(instanceMatrix, scale4( shipWingSize[0], shipWingSize[1], shipWingSize[2]));
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
      gl.uniform1i(gl.getUniformLocation( program, "textures"), 12);
      gl.drawElements(gl.TRIANGLES, 36  , gl.UNSIGNED_SHORT, 0);

  }

// Function to initialise each node:
// Id is the id of the node as specified above in the Variables
// It generates the transformation matrix for each part (translate/rotate)
// Adds the figure to the array of figures.
// Each object is translated with respect to the parent node.
// Each planet rotates on its own axis.
// Translation is done with the pc array (coordinates), which changes following a circle on XZ
function initPlanets(Id) {

    var m = mat4();
    switch(Id) {
      // Space.
      case spaceId:
        m = translate(0.0, 0.0, 0.0);
        figure[spaceId] = createNode( m, space, null, sunId );
        instanceMatrix = mult(instanceMatrix,rotate(-pr[spaceId], 0, 1, 0 ));
        // console.log("space");
        break;
      // Sun.
      case sunId:
        m = translate(0.0, 0.0, 0.0);
        m = mult(m,rotate(pr[sunId], 0, 1, 0 ));
        figure[sunId] = createNode( m, sun, mercuryId, null );
        // console.log("sun");
        break;

      // Mercury.
      case mercuryId:
        // m = translate(0.0, 0.0, pd[Id]);
        m = translate(pc[Id][0], pc[Id][1], pc[Id][2]);

        m = mult(m,rotate(pr[mercuryId], 0, 1, 0 ))
        figure[mercuryId] = createNode( m, mercury, venusId, null );
        // console.log("mercury");
        break;
      // Venus.
      case venusId:
        m = translate(pc[Id][0], pc[Id][1], pc[Id][2]);

        m = mult(m,rotate(pr[venusId], 0, 1, 0 ))
        figure[venusId] = createNode( m, venus, earthId, null );
        // console.log("venus");
        break;
      // Earth.
      case earthId:
        m = translate(pc[Id][0], pc[Id][1], pc[Id][2]);

        m = mult(m,rotate(pr[earthId], 0, 1, 0 ));
        figure[earthId] = createNode( m, earth, marsId, moonId );
        // console.log("earth");
        break;
      // Moon
      case moonId:

        m = translate(pc[Id][0], pc[Id][1], pc[Id][2]);
        m = mult(m,rotate(-pr[moonId], 0, 1, 0 ));
        figure[moonId] = createNode( m, moon, null, null);
        // console.log("moon");
        break;

      case marsId:
        m = translate(pc[Id][0], pc[Id][1], pc[Id][2]);
        m = mult(m, rotate(0, 0, 1, 0));
        figure[marsId] = createNode( m, mars, jupiterId, null);
        // console.log("mars");
        break;

      case jupiterId:
        m = translate(pc[Id][0], pc[Id][1], pc[Id][2]);
        m = mult(m,rotate(pr[marsId], 0, 1, 0 ));
        figure[jupiterId] = createNode( m, jupiter, saturnId, null);
        // console.log("jupiter");
        break;

      case saturnId:
        m = translate(pc[Id][0], pc[Id][1], pc[Id][2]);
        m = mult(m,rotate(pr[saturnId], 0, 1, 0 ));
        figure[saturnId] = createNode( m, saturn, uranusId, null);
        // console.log("saturn");
        break;

      case uranusId:
        m = translate(pc[Id][0], pc[Id][1], pc[Id][2]);
        m = mult(m,rotate(pr[uranusId], 0, 1, 0 ));
        figure[uranusId] = createNode( m, uranus, neptuneId, null);
        // console.log("uranus");
        break;

      case neptuneId:
        m = translate(pc[Id][0], pc[Id][1], pc[Id][2]);
        m = mult(m,rotate(pr[neptuneId], 0, 1, 0 ));
        figure[neptuneId] = createNode( m, neptune, plutoId, null);
        // console.log("neptune");
        break;

      case plutoId:
        m = translate(pc[Id][0], pc[Id][1], pc[Id][2]);
        m = mult(m,rotate(pr[plutoId], 0, 1, 0 ));
        figure[plutoId] = createNode( m, pluto, null, null);
        // console.log("plutoId");
        break;

    }

}

// Transformation functions for the planets and space: translation and size
// Load the textures and draw elements
function space() {
    instanceMatrix = mult(modelViewMatrixPersp, translate(0, 0, 0) );
    instanceMatrix = mult(instanceMatrix, scale4( ps[0],ps[0],ps[0]));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform1i(gl.getUniformLocation( program, "textures"), 0);
    gl.drawElements(gl.TRIANGLES, numVerticesSphere, gl.UNSIGNED_SHORT, 0);

}

function sun() {
    instanceMatrix = mult(modelViewMatrixPersp, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( ps[1],ps[1],ps[1]));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform1i(gl.getUniformLocation( program, "textures"), 1);
    gl.drawElements(gl.TRIANGLES, numVerticesSphere, gl.UNSIGNED_SHORT, 0);

}


function mercury() {
    instanceMatrix = mult(modelViewMatrixPersp, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( ps[2],ps[2],ps[2]));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform1i(gl.getUniformLocation( program, "textures"), 2);
    gl.drawElements(gl.TRIANGLES, numVerticesSphere, gl.UNSIGNED_SHORT, 0);

}
function venus() {
    instanceMatrix = mult(modelViewMatrixPersp, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(ps[3],ps[3],ps[3]));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform1i(gl.getUniformLocation( program, "textures"), 3);
    gl.drawElements(gl.TRIANGLES, numVerticesSphere, gl.UNSIGNED_SHORT, 0);

}
function earth() {
    instanceMatrix = mult(modelViewMatrixPersp, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( ps[4],ps[4],ps[4]));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform1i(gl.getUniformLocation( program, "textures"), 4);
    gl.drawElements(gl.TRIANGLES, numVerticesSphere, gl.UNSIGNED_SHORT, 0);

}
function moon() {
    instanceMatrix = mult(modelViewMatrixPersp, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( ps[5],ps[5],ps[5]));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform1i(gl.getUniformLocation( program, "textures"), 5);
    gl.drawElements(gl.TRIANGLES, numVerticesSphere, gl.UNSIGNED_SHORT, 0);

}
function mars() {
    instanceMatrix = mult(modelViewMatrixPersp, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( ps[6],ps[6],ps[6]));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform1i(gl.getUniformLocation( program, "textures"), 6);
    gl.drawElements(gl.TRIANGLES, numVerticesSphere, gl.UNSIGNED_SHORT, 0);

}

function jupiter() {
    instanceMatrix = mult(modelViewMatrixPersp, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix,rotate(pr[jupiterId], 0, 1, 0 ))
    instanceMatrix = mult(instanceMatrix, scale4( ps[7],ps[7],ps[7]));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform1i(gl.getUniformLocation( program, "textures"), 7);
    gl.drawElements(gl.TRIANGLES, numVerticesSphere, gl.UNSIGNED_SHORT, 0);

}

function saturn() {
    instanceMatrix = mult(modelViewMatrixPersp, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( ps[8],ps[8],ps[8]));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform1i(gl.getUniformLocation( program, "textures"), 8);
    gl.drawElements(gl.TRIANGLES, numVerticesSphere, gl.UNSIGNED_SHORT, 0);

}

function uranus() {
    instanceMatrix = mult(modelViewMatrixPersp, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( ps[9],ps[9],ps[9]));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform1i(gl.getUniformLocation( program, "textures"), 9);
    gl.drawElements(gl.TRIANGLES, numVerticesSphere, gl.UNSIGNED_SHORT, 0);

}

function neptune() {
    instanceMatrix = mult(modelViewMatrixPersp, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( ps[10],ps[10],ps[10]));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform1i(gl.getUniformLocation( program, "textures"), 10);
    gl.drawElements(gl.TRIANGLES, numVerticesSphere, gl.UNSIGNED_SHORT, 0);

}

function pluto() {
    instanceMatrix = mult(modelViewMatrixPersp, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( ps[11],ps[11],ps[11]));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform1i(gl.getUniformLocation( program, "textures"), 11);
    gl.drawElements(gl.TRIANGLES, numVerticesSphere, gl.UNSIGNED_SHORT, 0);

}
// This function populates the information for the sphere that will be used
// to create the space and each planet.
function createSphere() {

  let latitudeBands = 50;
  let longitudeBands = 50;
  let radius = 0.5;

  // Calculate sphere vertex positions, normals, and texture coordinates.
  for (let latNumber = 0; latNumber <= latitudeBands; ++latNumber) {
    let theta = latNumber * Math.PI / latitudeBands;
    let sinTheta = Math.sin(theta);
    let cosTheta = Math.cos(theta);

    for (let longNumber = 0; longNumber <= longitudeBands; ++longNumber) {
      let phi = longNumber * 2 * Math.PI / longitudeBands;
      let sinPhi = Math.sin(phi);
      let cosPhi = Math.cos(phi);

      let x = cosPhi * sinTheta;
      let y = cosTheta;
      let z = sinPhi * sinTheta;

      let u = 1 - (longNumber / longitudeBands);
      let v = 1 - (latNumber / latitudeBands);

      vPositionData.push(radius * x);
      vPositionData.push(radius * y);
      vPositionData.push(radius * z);

      vNormalData.push(x);
      vNormalData.push(y);
      vNormalData.push(z);

      vTextCoordData.push(u);
      vTextCoordData.push(v);

    }
  }

  // Calculate sphere indices.
  for (let latNumber = 0; latNumber < latitudeBands; ++latNumber) {
    for (let longNumber = 0; longNumber < longitudeBands; ++longNumber) {
      let first = (latNumber * (longitudeBands + 1)) + longNumber;
      let second = first + longitudeBands + 1;

      indexData.push(first);
      indexData.push(second);
      indexData.push(first + 1);

      indexData.push(second);
      indexData.push(second + 1);
      indexData.push(first + 1);
    }
  }

  vPositionData = new Float32Array(vPositionData);
  vNormalData = new Float32Array(vNormalData);
  vTextCoordData = new Float32Array(vTextCoordData);
  indexData = new Uint16Array(indexData);



  return indexData.length;
}



// Function to resize everything if the window is resized.
// - Resize the canvas to fit the window
// - Scale the model view matrix using the canvas aspect ratio.
// - Update the view port to use the whole canvas.
function resize(canvas) {
  // Lookup the size the browser is displaying the canvas.
  var displayWidth  = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size.
  if (canvas.width  != displayWidth ||
      canvas.height != displayHeight) {

    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
    aspectRatio = (displayHeight/displayWidth);
    perspectiveAspectRatio = displayWidth/displayHeight;

    gl.viewport(0, 0, canvas.width, canvas.height);

  }
}

// Function to generate the scaling matrix
function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

function round(num){
  return Math.floor(num * 100000000)/1000;
}

function rotX(angle){
  angle = angle*(180 / Math.PI);
  return mat3(1.0,  0.0,  0.0,
              0.0,  Math.cos(angle),  Math.sin(angle),
              0.0, -Math.sin(angle),  Math.cos(angle));
}
function rotY(angle){
  angle = angle*(180 / Math.PI);
  return mat3(Math.cos(angle), 0.0, -Math.sin(angle),
              0.0, 1.0,  0.0,
              Math.sin(angle), 0.0,  Math.cos(angle));
}
function rotZ(angle){
  angle = angle*(180 / Math.PI);
  return mat3(Math.cos(angle), Math.sin(angle), 0.0,
            -Math.sin(angle),  Math.cos(angle), 0.0,
            0.0,  0.0, 1.0);
}

function rotationXZ(theta, vec){
  let x = vec[0];
  let y = vec[1];
  let z = vec[2];
  let X = x*Math.cos(theta) + z*Math.sin(theta);
  let Y = y;
  let Z = z*Math.cos(theta) - x*Math.sin(theta);
  return vec3(X,Y,Z);
}
// Function to set the position of the camara when following a planet
function updateCameraAt(){
  modelViewMatrixPersp[0][3] = cameraCoord[0];
  modelViewMatrixPersp[1][3] = cameraCoord[1];
  modelViewMatrixPersp[2][3] = cameraCoord[2];
}

// Bind and enable ship buffers to draw the ship
function bindShipBuffers(){
  // Write the vertex positions to their buffer object.
  gl.bindBuffer(gl.ARRAY_BUFFER, vPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesShip, gl.STATIC_DRAW);

  // Assign position coords to attrib and enable it.
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // Write the normals to their buffer object.
  gl.bindBuffer(gl.ARRAY_BUFFER, vNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, normalsShip, gl.STATIC_DRAW);

  // Assign normal to attrib and enable it.
  gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vNormal);

  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, texCoordShip, gl.STATIC_DRAW);

  gl.vertexAttribPointer(vTextCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vTextCoord);

  // Pass index buffer data to element array buffer.
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesShip, gl.STATIC_DRAW);
}
// Bind and enable planet buffers to draw planets and space
function bindPlanetBuffers(){
  // Write the vertex positions to their buffer object.
  gl.bindBuffer(gl.ARRAY_BUFFER, vPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vPositionData, gl.STATIC_DRAW);

  // Assign position coords to attrib and enable it.
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // Write the normals to their buffer object.
  gl.bindBuffer(gl.ARRAY_BUFFER, vNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vNormalData, gl.STATIC_DRAW);

  // Assign normal to attrib and enable it.
  gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vNormal);

  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vTextCoordData, gl.STATIC_DRAW);

  gl.vertexAttribPointer(vTextCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vTextCoord);

  // Pass index buffer data to element array buffer.
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);
}

// Update model view to move the camera with the keys
// Camera movement on each axis is done by setting the last column of the homogeneous tranformation mvpMatrix
// Mouse rotation is done by rotating the result model view matrix
function updateModelView(){
  modelViewMatrixPersp = lookAt(eye, at, up);
  updateCameraAt();
  modelViewMatrixPersp[0][3] = modelViewMatrixPersp[0][3] + tx;
  modelViewMatrixPersp[1][3] = modelViewMatrixPersp[1][3] + ty;
  modelViewMatrixPersp[2][3] = modelViewMatrixPersp[2][3] + tz;
  modelViewMatrixPersp = mult(rotate(sz, 0, 0, 1 ),modelViewMatrixPersp);
  modelViewMatrixPersp = mult(rotate(sy, 0, 1, 0 ),modelViewMatrixPersp);
  modelViewMatrixPersp = mult(rotate(sx, 1, 0, 0 ),modelViewMatrixPersp);



  projectionMatrix = perspective(pFovy, (pRight-pLeft)/(pTop-pBottom)*perspectiveAspectRatio, pNear, pFar);

  gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
  // }
}

window.onload = function init() {

  canvas = document.getElementById('gl-canvas');
  // Aspect ratio needed for canvas resize
  aspectRatio = canvas.clientHeight/canvas.clientWidth;
  perspectiveAspectRatio = canvas.clientWidth/canvas.clientHeight;
  gl = WebGLUtils.setupWebGL( canvas );
  // Initialise shaders
  program = InitShaders( gl, "vertex-shader", "fragment-shader");



  // Set up clear color and enable depth testing.
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.viewport( 0, 0, canvas.width, canvas.height );

  gl.useProgram(program);



  // Init vertex buffers (position, color, and index data).
  numVerticesSphere = createSphere();

  // Create buffer objects.
  vPositionBuffer = gl.createBuffer();
  vNormalBuffer = gl.createBuffer();
  indexBuffer = gl.createBuffer();
  texCoordBuffer = gl.createBuffer();



  // Assign position coords to attrib and enable it.
  vPosition = gl.getAttribLocation(program, 'vPosition');

  // Assign normal to attrib and enable it.
  vNormal = gl.getAttribLocation(program, 'vNormal');

  vTextCoord = gl.getAttribLocation(program, "vTexCoord");

  // bindPlanetBuffers();



  for (let p=0; p < textureImages.length; ++p){
      initTextures(p, textureImages[p]);
  }
  // initTextures(numPlanets, shipImage);

  //activate and set the texture
  for (var ii = 0; ii < textureImages.length; ++ii) {
    gl.activeTexture(gl.TEXTURE0 + ii);
    gl.bindTexture(gl.TEXTURE_2D, figureTextures[ii]);
  }

  instanceMatrix = mat4();
  // Initialise model view with camera position.
  modelViewMatrixPersp = lookAt(eye, at, up);

  projectionMatrix = perspective(pFovy, (pRight-pLeft)/(pTop-pBottom), pNear, pFar);
  projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix")

  gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrixPersp));

  // Pass the light position into the shader.
  let LightPosition = gl.getUniformLocation(program, 'LightPosition');
  gl.uniform4fv(LightPosition, [0.0, 0.0, -ps[1]/2, 1.0]);

  // Pass the material diffuse color into the shader.
  let Kd = gl.getUniformLocation(program, 'Kd');
  // gl.uniform3fv(Kd, [0.9, 0.5, 0.3]);
  gl.uniform3fv(Kd, [1.0, 1.0, 1.0]);

  // Pass the light diffuse color into the shader.
  let Ld = gl.getUniformLocation(program, 'Ld');
  gl.uniform3fv(Ld, [1.0, 1.0, 1.0]);


  // EVENTS for key and mouse controls
  document.onkeydown = checkKey;

  function checkKey(e) {

      e = e || window.event;

      if (e.keyCode == '87') {
          // up arrow W
          // ty = ty + 0.001;
          speedY = speedY - step/10;
          document.getElementById("transValueY").value = round(speedY);
      }
      else if (e.keyCode == '83') {
          // down arrow S
          // ty = ty - 0.001;
          speedY = speedY + step/10;
          document.getElementById("transValueY").value = round(speedY);
      }
      else if (e.keyCode == '68') {
         // left arrow A
         // tx = tx - 0.001;
         speedX = speedX - step/10;
         document.getElementById("transValueX").value = round(speedX);
      }
      else if (e.keyCode == '65') {
         // right arrow D
         // tx = tx + 0.001;
         speedX = speedX + step/10;
         document.getElementById("transValueX").value = round(speedX);
      }
      else if (e.keyCode == '69') {
         // Speed up R
         // tz = tz + 0.001;
         speedZ = speedZ + step;
         document.getElementById("transValueZ").value = round(speedZ);
      }
      else if (e.keyCode == '81') {
         // Slow down Q
         // tz = tz - 0.001;
         speedZ = speedZ - step;
         document.getElementById("transValueZ").value = round(speedZ);
      }
      else if (e.keyCode == '77') {
         // Enable/disable mouse rotation
         enableMouse = !enableMouse;
         if (enableMouse){
             document.getElementById("enableMouse").innerHTML = "Disable Mouse [M]";
         } else{
             document.getElementById("enableMouse").innerHTML = "Enable Mouse [M]";
         }
      }
      else if (e.keyCode == '82') {
         // Enable/disable animation
         animate = !animate;
         if (animate){
             document.getElementById("StartAnim").innerHTML = "Stop Animation [R]";
         } else{
             document.getElementById("StartAnim").innerHTML = "Start Animation [R]";
         }
      }
      else if (e.keyCode == '32') {
         // Stop with space bar
         speedX = 0;
         speedY = 0;
         speedZ = 0;
         document.getElementById("transValueX").value = speedX;
         document.getElementById("transValueY").value = speedY;
         document.getElementById("transValueZ").value = speedZ;
      }

  }


  document.getElementById("enableMouse").onclick = function(){
    //onclick event to enable/disable mouse
    enableMouse = !enableMouse;
    updateModelView();
  };

  // Function for the onmousemove canvas event to get the mouse position
  // with the centre in the middle of the canvas.
  canvas.onmousemove = function(event) {
    let rect = canvas.getBoundingClientRect();

    mouse_x = event.clientX-rect.left-(canvas.clientWidth/2);
    mouse_y = -1*(event.clientY -rect.top - (canvas.clientHeight/2));
    if (enableMouse){
      document.getElementById("cameraValueX").value=mouse_x;
      document.getElementById("cameraValueY").value=mouse_y;
    }

  }

  // Function to start and stop the animation
  document.getElementById("StartAnim").onclick = function(){
    animate = !animate;
    if (animate){
        this.innerHTML = "Stop Animation [R]";
    } else{
        this.innerHTML = "Start Animation [R]";
    }
  };

  // Function to enable/disable the mouse with click event
  document.getElementById("enableMouse").onclick = function(){
    enableMouse = !enableMouse;
    if (enableMouse){
        this.innerHTML = "Disable Mouse [M]";
    } else{
        this.innerHTML = "Enable Mouse [M]";
    }
  };

  // droplist to select what planet to follow
  document.getElementById("followPlanet").onchange = function(){
    followPlanet = this.value;
    tx=0;
    ty=0;
    tz=0;

  };

  render();

}




var render = function() {
  //Update the rotation based on the mouse position
  if (enableMouse){
      // Mouse movemement in XY
      if (mouse_x > 10.0){
        sy=sy+mouse_x/200;
      }else if(mouse_x < 10.0) {
        sy=sy+mouse_x/200;
      } else {
        sy = 0;
      }
      if (mouse_y > 10.0){
        sx=sx-mouse_y/200;
      }else if(mouse_y < 10.0) {
        sx=sx-mouse_y/200;
      } else {
        sx = 0;
      }
    }
  // Set camera coordinates close to the planet to follow
  if (followPlanet > -1){
    cameraCoord[0] = -pc[followPlanet][0];
    cameraCoord[1] = 0;
    cameraCoord[2] = -pc[followPlanet][2]-ps[followPlanet]*2.5;
    if (followPlanet == moonId){
      cameraCoord[0] = cameraCoord[0] -pc[earthId][0];
      cameraCoord[1] = 0;
      cameraCoord[2] = cameraCoord[2]-pc[earthId][2];

    }
    shipCoord[0] = -pc[followPlanet][0];
    shipCoord[1] = 0;
    shipCoord[2] = -pc[followPlanet][2]-ps[followPlanet]*2.5;
  } else {
    // If not following a planet, go to the 0 position, with a 3rd of the sun size
    // away from the sun
    cameraCoord = [0,0,-ps[1]*3];
    shipCoord = cameraCoord;
  }


  // Rotation and translation for each planet
  if (animate){
    for (let p=0; p<pr.length; p++){
      pr[p] = pr[p] + speedRotation[p];
      let coor = rotationXZ(pt[p], pc[p]);
      pc[p] = coor;
    }

    tx = tx + speedX;
    ty = ty + speedY;
    tz = tz + speedZ;


  }





  // The resize function is called on every cycle.
  // Initialise this was done automatically in the windows.resize event.
  // However this caused problems when opening the javascript console, since that is not a windows resize event.
  // Inside resize() before making any changes it checks if the dimensions have actually changed.

  resize(gl.canvas);

  gl.clear( gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);
  // Set the new camera position and orientation
  updateModelView();


  // Initialise the planets
  for(let i=0; i<numPlanets; i++) {
    initPlanets(i);
  }
  // Bind to the planet buffers before drawing
  bindPlanetBuffers();
  // Traverse through the hierarchy
  traverse(spaceId);

  // Initialise ship figures
  for (let i=12;i<15;i++){
      initShip(i);
  }
  // bind ship figures before drawing
  bindShipBuffers();
  // Draw ship
  traverse(bodyId);

  // Create the frame
  requestAnimFrame(render);
}
