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
  'standard' : [0.5, 0.5, 1, 6, 1] 
};