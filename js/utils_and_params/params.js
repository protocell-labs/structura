//////PARAMS//////



//////SETTINGS//////
var loading_start_time = new Date().getTime();
var min_loading_time = 1000; // this is the minimum that the loading screen will be shown, in miliseconds
var debug = true;
var cam_factor = 4; //controls the "zoom" when using orthographic camera, default was 4











function get_steps(stage) {
  var steps = [];
  for (var i = 0; i < stage; i++) {
    steps.push(Math.PI/gene_range(50, 200))
  }
  return steps
}


const cylinder_params = {
  "standard" : [0.5, 0.5, 1, 6, 1],
  "square beam" : [0.5, 0.5, 1, 4, 1], // here the side length is less than 1.0 as the first parameter is radius
  "square 1x1" : [0.7, 0.7, 1, 4, 1] // first parameter is the radius, which gives us a square with a side close to 1.0
};





//////ANIMATION SETTINGS CHOOSING//////
const light_frame_speed_param = {
  Fast: 25, // light increment per 1/100 of a second
  Normal: 50, // light increment per 1/30 of a second
  Slow: 500, // light increment per half-second
  SuperSlow: 1000, // light increment per second
}

const light_step_size_param = {
  Paused: 0,
  DaySync: 0.000072,//2*Math.PI/86400,
  SuperSmall: 0.00025,
  Small: 0.0005,
  Medium: 0.0010,
  Large: 0.0015
}