//////LOADER ANIMATION//////

let canvasWidth = 400;
let canvasHeight = 50;
let light_spot_size = 50;
let corner_r = 5;
let light_spot_x_pos;
let light_spot_y_pos = canvasHeight / 2;
let move_amplitude = 50;
let color_trigger = false;

function setup() {
  const cnv = createCanvas(canvasWidth, canvasHeight);
  cnv.parent('p5loader');
  frameRate(30);
}

function draw() {
  blendMode(BLEND);
  background(0,0,0);
  
  blendMode(ADD);
  rectMode(CENTER);
  noStroke();
  
  fill(255*color_trigger, 0, 255*!color_trigger); // red or blue
  light_spot_x_pos = sin(millis()/1000) * move_amplitude + canvasWidth / 2 - move_amplitude;
  circle(light_spot_x_pos, light_spot_y_pos, light_spot_size);
  
  fill(0, 255, 0); // green
  light_spot_x_pos = canvasWidth / 2;
  circle(light_spot_x_pos, light_spot_y_pos, light_spot_size);
  
  light_spot_x_pos = -sin(millis()/1000) * move_amplitude + canvasWidth / 2 + move_amplitude;
  fill(255*!color_trigger, 0, 255*color_trigger); // blue or red
  circle(light_spot_x_pos, light_spot_y_pos, light_spot_size);
  
  // flipping the color of the circles
  // treshold value has to be adjusted higher for lower framerates
  if (light_spot_x_pos - canvasWidth / 2 < 0.1) {
    color_trigger = !color_trigger;
  }
  
}



