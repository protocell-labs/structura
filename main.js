/*

__/\\\________/\\\____________/\\\\\\\\\\\\\\\______________/\\\\\\\\\___________________/\\\\\\\\\\\______________/\\\\\\\\\\\\\\\_        
 _\/\\\_______\/\\\___________\/\\\///////////_____________/\\\///////\\\_______________/\\\/////////\\\___________\/\\\///////////__       
  _\//\\\______/\\\____________\/\\\_______________________\/\\\_____\/\\\______________\//\\\______\///____________\/\\\_____________      
   __\//\\\____/\\\_____________\/\\\\\\\\\\\_______________\/\\\\\\\\\\\/________________\////\\\___________________\/\\\\\\\\\\\_____     
    ___\//\\\__/\\\______________\/\\\///////________________\/\\\//////\\\___________________\////\\\________________\/\\\///////______    
     ____\//\\\/\\\_______________\/\\\_______________________\/\\\____\//\\\_____________________\////\\\_____________\/\\\_____________   
      _____\//\\\\\________________\/\\\_______________________\/\\\_____\//\\\_____________/\\\______\//\\\____________\/\\\_____________  
       ______\//\\\_________________\/\\\\\\\\\\\\\\\___________\/\\\______\//\\\___________\///\\\\\\\\\\\/_____________\/\\\\\\\\\\\\\\\_ 
        _______\///__________________\///////////////____________\///________\///______________\///////////_______________\///////////////__
                                   

                                    V E R S E  |  { p r o t o c e l l : l a b s }  +  o f f i c e c a  |  2 0 2 3
*/


//////GEOMETRY GENERATION//////

var gDatas = [];
var gData;

// WORKAROUND - to remove later
var stage = 6;
var steps = get_steps(stage);

// OVERRIDES
var aspect_ratio = 0.5625; //// 0.5625 - 16:9 aspect ratio, 0.75 - portrait (used in O B S C V R V M)
var explosion_type = 0; // no explosion
var light_source_type = "south";

var global_rot_x = -Math.PI/16; // global rotation of the model around the X axis, -Math.PI/16
var global_rot_y = 0; // global rotation of the model around the Y axis, Math.PI/16

var total_frame_size_x = 13; // 6, 12, 10
var total_frame_size_y = 20; // 9, 18, 23
var frame_cell_w = 25; // 50, 25, 25
var frame_cell_h = 40; // 100, 50, 35
var frame_cell_d = 25; // 50, 25, 25

//                           [vert, hor,  a,    b,    c,    d,    e,    f,    g_u,  h_u,  g_l,  h_l]
var frame_links_visibility = [true, true, true, true, true, true, true, true, true, true, true, true];
var frame_links_thickness  = [1.5,  1.5,  0.5,  0.5,  0.5,  0.5,  0.5,  0.5,  1.0,  1.0,  1.0,  1.0];
var links_length_reduction = [1.00, 0.85, 0.90, 0.90, 0.90, 0.90, 0.90, 0.90, 0.90, 0.90, 0.90, 0.90];
var alternating_cd_ef = true;
var alternating_gu_hu = true;
var alternating_gu_hu_pattern = 1; // options: 1, 2, 3, 4, 5 - visible only if alternating_gu_hu_pattern = true
var alternating_gl_hl = true;
var alternating_gl_hl_pattern = 1; // options: 1, 2, 3, 4, 5 - visible only if alternating_gl_hl_pattern = true

var joint_visibility = true; // joint at vertical links
var joint_length = frame_links_thickness[0]; // joint at vertical links
var joint_thickness_f = frame_links_thickness[0] * 3; // joint at vertical links
var tightener_length_reduction = 0.1; // detail in the middle of cross-links c, d, e, f, g, h
var tightener_thickness_f = 1.5; // detail in the middle of cross-links c, d, e, f, g, h

var noise_shift_x = gene_range(-100, 100);
var noise_shift_y = gene_range(-100, 100);
var noise_shift_z = gene_range(-100, 100);
var noise_scale_x = 0.15; // 0.005
var noise_scale_y = 0.15; // 0.005
var noise_scale_z = 0.15; // 0.005
var noise_factor = 10.0; // 10.0
var noise_component_offset = 1.0; // 1.0, 1.21

var modulate_x = true;
var modulate_y = true;
var modulate_z = true;

var cutoff_vert_links = frame_cell_h * 2.0;
var cutoff_hor_links = frame_cell_w * 2.0;
var cutoff_cdef_links = frame_cell_h * 2.0;
var cutoff_gh_links = frame_cell_h * 2.0;

var nr_of_stripes = 3;
var gap_w = 25; // this value is not always working correctly with stripes
var frame_size_x = Math.floor(total_frame_size_x / nr_of_stripes) + 1;
var frame_size_y = total_frame_size_y;

var total_width = (frame_size_x - 1) * frame_cell_w + (nr_of_stripes - 1) * gap_w;
var x_placement;

console.log("total width ->", total_width);

// placement of stripes
for (var i = 0; i < nr_of_stripes; i++) {

  if (nr_of_stripes == 1) {x_placement = 0;}
  else if (nr_of_stripes == 2) {x_placement = total_width / 2.0 - i * (total_width * 2) / nr_of_stripes;}
  else {x_placement = total_width - i * (total_width * 2) / (nr_of_stripes - 1);} //total_width - i * (total_width * 2) / (nr_of_stripes - 1);
  
  var frame_position = new THREE.Vector3(x_placement, 0, 0);

  gData = space_frame_triprism_gData(frame_position);
  gDatas.push(gData);
  console.log("#", i, "stripe ->", x_placement);
}



//////CONSOLE LOG//////

var obscvrvm_logo =   "%c                                                                                       \n"
                    + "%c     V E R S E  |  { p r o t o c e l l : l a b s }  +  o f f i c e c a  |  2 0 2 3     \n"
                    + "%c                                                                                       \n";

console.log( obscvrvm_logo,
            'color: white; background: #000000; font-weight: bold; font-family: "Courier New", monospace;',
            'color: white; background: #000000; font-weight: bold; font-family: "Courier New", monospace;',
            'color: white; background: #000000; font-weight: bold; font-family: "Courier New", monospace;');

//////END CONSOLE LOG//////

var pre_calc = 0.000;
var viz_update = 0.00000;
var composer_pass = 0.00000;

///VIEWPORT SETUP///

var viewport = document.getElementById("viewport");
var margin_left = 0;
var margin_top = 0;
var viewportHeight;
var viewportWidth;


var light_framerate_change;
var base_light_angle_step;
var light_angle;
var background_toggle = false;

var controller;

var renderer = new THREE.WebGLRenderer({antialias: false, alpha: true, preserveDrawingBuffer: true}); //antialias: true
const composer = new THREE.EffectComposer( renderer );
let snap = false;
let quality = 0;
var capturer = null;
let recording = false;

function View(viewArea) {
  if (window.innerWidth/aspect_ratio>window.innerHeight) { //If target viewport height is larger then inner height

    viewportHeight = window.innerHeight; //Force Height to be inner Height
    viewportWidth = aspect_ratio*window.innerHeight;  //Scale width proportionally

    margin_top = 0;
    margin_left = (window.innerWidth - viewportWidth)/2;
  } else {  //If target viewport width is larger then inner width

    viewportHeight = window.innerWidth/aspect_ratio; //Scale viewport height proportionally
    viewportWidth = window.innerWidth; //Force Width  to be inner Height

    margin_top = (window.innerHeight - viewportHeight)/2;
    margin_left = 0;
  }

  viewport.style.marginTop=margin_top+'px';
  viewport.style.marginLeft=margin_left+'px';
    
  
  ///SCALING
  cam_factor_mod = cam_factor * Math.min(viewportWidth/1000, viewportHeight/1000);

  renderer.setSize( viewportWidth, viewportHeight );
  renderer.shadowMap.enabled = true;
  renderer.domElement.id = 'obscvrvmcanvas';

  viewport.appendChild(renderer.domElement);

  var scene = new THREE.Scene();

  //var camera = new THREE.PerspectiveCamera( 75, viewportWidth / viewportHeight, 0.1, 10000 );
  //camera.position.set(0,0, 100);


  //cam_factor controls the "zoom" when using orthographic camera
  var camera = new THREE.OrthographicCamera( -viewportWidth/cam_factor_mod, viewportWidth/cam_factor_mod, viewportHeight/cam_factor_mod, -viewportHeight/cam_factor_mod, 0, 5000 );
  camera.position.set(0, 0, 2000);
  camera.lookAt(new THREE.Vector3(0, 0, 0));


  
  const normalRenderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
  const shadowRenderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);

  //composer = new THREE.EffectComposer( renderer );
  composer.setSize(window.innerWidth, window.innerHeight)

  // change scene background to solid color
  scene.background = new THREE.Color('#080808'); //0xffffff, 0x000000

  const color = 0xffffff; //0xffffff
  const amb_intensity = 0.1; //0-1, zero works great for shadows with strong contrast

  // ADD LIGHTING
  var light = new THREE.PointLight(0xffffff);
  light.position.set(0, 0, 2000); //1000,1000,1000
 
  light.castShadow = false;
  light.shadow.camera.near = 200;
  light.shadow.camera.far = 2000;
  light.shadow.bias = - 0.000222;

  var shadow = 2048; //Default
  var paramsAssigned = false;
  // URL PARAMS
  // Usage: add this to the url ?shadow=4096
  try {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const shadowString = urlParams.get('shadow');
    
  if (shadowString!=null) {
      shadow = Math.abs(parseInt(shadowString));
      paramsAssigned = true;
    }
  } catch (error) {
    //console.log("shadow variable must be a positive integer")
  }
  if (Number.isInteger(shadow) & paramsAssigned) { //If values are overiden by urlParams  for a minimum overide add: & shadow > 2048
    console.log("Using custom url parmater for shadow map size: " + shadow.toString())
    light.shadow.mapSize.width = shadow;
    light.shadow.mapSize.height = shadow;   
  } else if (Number.isInteger(shadow) & iOS()) {
    //console.log("iOS")
    light.shadow.mapSize.width = Math.min(shadow, 2048); //increase for better quality of shadow, standard is 2048
    light.shadow.mapSize.height = Math.min(shadow, 2048); 
  } else if ((Number.isInteger(shadow) & !iOS())){
    //console.log("!iOS")
    light.shadow.mapSize.width = Math.max(shadow, 4096);
    light.shadow.mapSize.height = Math.max(shadow, 4096);
  } else {
    //console.log("Using default shadow map.")
    light.shadow.mapSize.width = 4096; 
    light.shadow.mapSize.height = 4096; 
  }

  scene.add(light);



  const amblight = new THREE.AmbientLight(color, amb_intensity);
  scene.add(amblight);

  this.winHeight = viewportHeight;
  this.winWidth = viewportWidth;
  this.scale = 1;
  this.scene = scene;
  this.camera = camera;
  this.composer = composer;
  this.light = light;
  this.renderer = renderer;
  this.wire = null;
  this.lines = null;
  this.meshline_data = [];
  this.meshline_mesh = [];

  this.curves = [];

  // Renders the Scene
  const renderPass = new THREE.RenderPass(this.scene, this.camera);
  this.composer.addPass( renderPass );



  //Bloom
  const bloomPass = new THREE.UnrealBloomPass();
  bloomPass.strength = 0.30;
  bloomPass.radius = 0.0;
  bloomPass.threshold = 0.0;
  this.composer.addPass(bloomPass)

  //Colour to Greyscale 
  //const effectGrayScale = new THREE.ShaderPass( THREE.LuminosityHighPassShader);
  //this.composer.addPass(effectGrayScale)

  //Gaussian Blur Filter to impruve sobel operator?

  //Sobel operator
  const effectSobel = new THREE.ShaderPass( THREE.SobelOperatorShader);
  effectSobel.uniforms['resolution'].value.x = window.innerWidth * window.devicePixelRatio;
  effectSobel.uniforms['resolution'].value.y = window.innerHeight * window.devicePixelRatio
  this.composer.addPass(effectSobel)

  // FXAA antialiasing
  const effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
  effectFXAA.uniforms[ 'resolution' ].value.x = 1 / ( window.innerWidth * window.devicePixelRatio );
  effectFXAA.uniforms[ 'resolution' ].value.y = 1 / ( window.innerHeight * window.devicePixelRatio );
  this.composer.addPass( effectFXAA );   

  // Add your shader pass here
  //const shaderPass = new THREE.ShaderPass(shaderMaterial);
  //composer.addPass(shaderPass);

  //In constructor ShaderPass creates internal ShaderMaterial and we should set this material's transparency to true:
  //shaderPass.material.transparent = true

  // Add your shadow pass here
  //const shadowPass = new THREE.ShadowMapPass(this.light);
  //composer.addPass(shadowPass);


}



View.prototype.addSpaceFrame = function () {

  var c_type = "standard";

  for (var n = 0; n < gDatas.length; n++) {
    var gData = gDatas[n];
    var dummy = new THREE.Object3D()
    var geometry = new THREE.CylinderGeometry( cylinder_params[c_type][0], cylinder_params[c_type][1], cylinder_params[c_type][2], cylinder_params[c_type][3], cylinder_params[c_type][4], false ); // capped cylinder
    var material = new THREE.MeshPhongMaterial( {color: 0xffffff} ); //THREE.MeshBasicMaterial( {color: 0xff0000} ); THREE.MeshNormalMaterial();
    
    // LINKS
    var imesh = new THREE.InstancedMesh( geometry, material, gData.links.length )
    var axis = new THREE.Vector3(0, 1, 0);
    imesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage ); // will be updated every frame

    for (var i = 0; i < gData.links.length; i++) {
      if (gData.links[i]['visible'] == false) {continue;} // early termination - skip this link if it is not visible
      var source_index = gData.links[i]['source'];
      var target_index = gData.links[i]['target'];
      var vector = new THREE.Vector3(gData.nodes[target_index].x-gData.nodes[source_index].x, gData.nodes[target_index].y-gData.nodes[source_index].y, gData.nodes[target_index].z-gData.nodes[source_index].z);
      dummy.scale.set(gData.links[i]['thickness'], gData.links[i]['value'], gData.links[i]['thickness']); // (1, gData.links[i]['value'], 1)
      dummy.quaternion.setFromUnitVectors(axis, vector.clone().normalize());
      dummy.position.set((gData.nodes[source_index].x+gData.nodes[target_index].x)/2, (gData.nodes[source_index].y+gData.nodes[target_index].y)/2, (gData.nodes[source_index].z+gData.nodes[target_index].z)/2)
      dummy.updateMatrix();
      imesh.setMatrixAt(i, dummy.matrix);
    }

    // global rotation of the instanced mesh
    imesh.rotateX(global_rot_x);
    imesh.rotateY(global_rot_y);

    imesh.instanceMatrix.needsUpdate = true
    imesh.castShadow = true;
    imesh.receiveShadow = true;
    this.scene.add(imesh);


    // JOINTS
    var imesh = new THREE.InstancedMesh( geometry, material, gData.joints.length )
    var axis = new THREE.Vector3(0, 1, 0);
    imesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage ); // will be updated every frame

    for (var i = 0; i < gData.joints.length; i++) {
      if (gData.joints[i]['visible'] == false) {continue;} // early termination - skip this joint if it is not visible
      var source_index = gData.joints[i]['source'];
      var target_index = gData.joints[i]['target'];
      var vector = new THREE.Vector3(gData.nodes[target_index].x-gData.nodes[source_index].x, gData.nodes[target_index].y-gData.nodes[source_index].y, gData.nodes[target_index].z-gData.nodes[source_index].z);
      dummy.scale.set(gData.joints[i]['thickness'], gData.joints[i]['value'], gData.joints[i]['thickness']); // (1, gData.joints[i]['value'], 1)
      dummy.quaternion.setFromUnitVectors(axis, vector.clone().normalize());
      dummy.position.set(gData.nodes[source_index].x, gData.nodes[source_index].y, gData.nodes[source_index].z)
      dummy.updateMatrix();
      imesh.setMatrixAt(i, dummy.matrix);
    }

    // global rotation of the instanced mesh
    imesh.rotateX(global_rot_x);
    imesh.rotateY(global_rot_y);

    imesh.instanceMatrix.needsUpdate = true
    imesh.castShadow = true;
    imesh.receiveShadow = true;
    this.scene.add(imesh);


  }
}



View.prototype.render = function () {

    this.composer.render();
    //this.renderer.clear();  //

    requestAnimationFrame(this.render.bind(this));

    //this.renderer.clear();  //
    if (debug){
      var start_timer = new Date().getTime();
    }

    if (debug){
      var end_timer = new Date().getTime();
      composer_pass = end_timer - start_timer
    }
    if(snap) {
      //console.log(controller)
      capture(controller);
      snap = false;
    }
    if(recording) {
      capturer.capture( renderer.domElement );
    }
    //this.renderer.render(this.scene, this.camera); // When no layers are used

};

function Controller(viewArea) {
  var view = new View(viewArea);
  view.cam_distance = 700 //1000 for ortho
  this.view = view; //referenced outside

  var ticker = 0;
  var sigmoid_ticker = 0;
  var ticker_set = [];

  for (var i = 0; i < stage; i++) {
    ticker_set.push(0);
  }

  const parallex_amplitude = view.cam_distance;
  const parallex_delay = 5000;
  const parallex_framerate = 200; //33ms for 30fps and 15fps for 60fps
  const parallex_step = 0.5*Math.PI/parallex_framerate; //0.5*Math.PI/parallex_framerate
  const stopping_angle = Math.PI/2 //Change to desired sector angle IMPORTANT: Must fit in 2Pi with no remainder to get alignment every period

  //Sigmoid Function for motion
  const sigmoid_amplitude = 0.05 //0.113; //Best range to work from -Pi ti Pi

  const mid_sector = stopping_angle/2;
  var current_stage = 0
  var current_dir = 1

  const up = new THREE.Vector3(0,1,0)

  // LIGHT TRAVEL PARAMETERS
  var light_framerate = 50; // 50 - obscvrvm
  light_framerate_change = 50; // 50 - needs to be the same
  var base_light_angle = Math.PI/3; // starting angle, angle 0 is straight behind the camera
  base_light_angle_step = 0.0000; // zero makes the light not travel, before 0.0005 - obscvrvm
  //var light_angle;
  var light_angle_step;

  if (light_source_type == 'west') {
    light_angle = -base_light_angle;
    light_angle_step = base_light_angle_step;
  } else if (light_source_type == 'east') {
    light_angle = base_light_angle;
    light_angle_step = -base_light_angle_step;
  } else if (light_source_type == 'north') {
    light_angle = base_light_angle;
    light_angle_step = -base_light_angle_step;
  } else if (light_source_type == 'south') {
    light_angle = -base_light_angle;
    light_angle_step = base_light_angle_step;
  }


  // LIGHT TRAVEL LOGIC
  var arc_division = 1.0;
  const lp = view.light.position;
  function update_light_position () {
    light_angle += light_angle_step*arc_division;

    if ((light_source_type == 'west') || (light_source_type == 'east')) {
      // rotation in XY plane
      view.light.position.set(Math.sin(light_angle)*parallex_amplitude, lp.y, Math.cos(light_angle)*parallex_amplitude); //1000,1000,1000
    } else if ((light_source_type == 'north') || (light_source_type == 'south')) {
    // rotation in YZ plane
    view.light.position.set(lp.x, Math.sin(light_angle)*parallex_amplitude, Math.cos(light_angle)*parallex_amplitude);
    }
    // rotation in XZ plane
    //view.light.position.set(Math.sin(light_angle)*parallex_amplitude, Math.cos(light_angle)*parallex_amplitude, lp.z);
  }
 
  var lightIntervalInstance = setInterval(function () {update_light_position()}, light_framerate);


  setTimeout(function ()  {
    setInterval(function () {
      start_timer = new Date().getTime()

      if (base_light_angle_step != Math.abs(light_angle_step)) { //if step changed update step
        //console.log(base_light_angle_step, Math.abs(light_angle_step));
        if (getKeyByValue(light_step_size_param, base_light_angle_step) == "DaySync") { //light_step_size_param.DaySync
          arc_division = base_light_angle_step*1000/light_framerate;
          //console.log("Arc Division Factor: " + arc_division.toString())
          if (light_angle_step == 0) {
            light_angle_step = base_light_angle_step;
          } else {
            light_angle_step = Math.sign(light_angle_step)*base_light_angle_step;
          }
          
          //console.log("After", Math.sign(light_angle_step) ,base_light_angle_step)
        } else {
          arc_division = 1.0;
          if (light_angle_step == 0) {
            light_angle_step = base_light_angle_step;
          } else {
            light_angle_step = Math.sign(light_angle_step)*base_light_angle_step;//use new amplitude with same sign, avoids another if statement
          }
        }
      }

      if (light_framerate != light_framerate_change) {
        clearInterval(lightIntervalInstance); //remove previous interval
        if (getKeyByValue(light_step_size_param, Math.abs(light_angle_step)) == "DaySync") { //light_step_size_param.DaySync
          arc_division = Math.abs(light_angle_step)*1000/light_framerate;
          console.log("Arc Division Factor: " + arc_division.toString())
        
        } else { arc_division = 1.0; }//Update light step as well if framerate is changed and
        light_framerate = light_framerate_change;
        lightIntervalInstance = setInterval(function () {update_light_position()}, light_framerate); //create new interval with updated framerate
      }

    
      if (debug) {
        var end_timer = new Date().getTime();
        pre_calc = (end_timer - start_timer);
      }

      if (debug) {
        end_timer = new Date().getTime();
        viz_update =  (end_timer - start_timer - pre_calc);
      }

      ticker += parallex_step; //parallex_step;

      for (var i = 0; i < stage; i++) {
        ticker_set[i] += steps[i];
      }

    }, parallex_framerate);
  }, parallex_delay)


  // ADDING GEOMETRY TO THE SCENE
  view.addSpaceFrame();



  view.render();


  // remove loading screen once the app is loaded to this point and min_loading_time has elapsed
  var loading_end_time = new Date().getTime();
  var loading_time = loading_end_time - loading_start_time;
  if (loading_time > min_loading_time) {
    for (i = 0; i < 21; i++) {
      let k = i; // we need to do this because: https://codehandbook.org/understanding-settimeout-inside-for-loop-in-javascript/
      setTimeout(function () {document.querySelector("#loading").style.opacity = 1.00 - k * 0.05;}, 100 * k);
    }
    setTimeout(function () {document.querySelector("#loading").style.display = "none";}, 2000);
  } else {
    for (i = 0; i < 21; i++) {
      let k = i; // we need to do this because: https://codehandbook.org/understanding-settimeout-inside-for-loop-in-javascript/
      setTimeout(function () {document.querySelector("#loading").style.opacity = 1.00 - k * 0.05;}, min_loading_time - loading_time + 100 * k);
    }
    setTimeout(function () {document.querySelector("#loading").style.display = "none";}, min_loading_time - loading_time + 2000);
  }
  setTimeout(function () {fxpreview();}, min_loading_time+3000)

  function onWindowResize() {
    //console.log("resize")
    viewportAdjust(document.getElementById('viewport'), false);
    fitCameraToViewport(view, viewportWidth, viewportHeight);
    }
  
    window.addEventListener( 'resize', onWindowResize );
}

function obscvrvm () {
  controller = new Controller('viewport');
}


function viewportAdjust(vp, inner=true) {
  ///ADJUST SIZE AND MARGIN
  if (inner) {
    if (window.innerWidth/aspect_ratio>window.innerHeight) { //If target viewport height is larger then inner height

      viewportHeight = window.innerHeight; //Force Height to be inner Height
      viewportWidth = aspect_ratio*window.innerHeight;  //Scale width proportionally
  
      margin_top = 0;
      margin_left = (window.innerWidth - viewportWidth)/2;
    } else {  //If target viewport width is larger then inner width
  
      viewportHeight = window.innerWidth/aspect_ratio; //Scale viewport height proportionally
      viewportWidth = window.innerWidth; //Force Width  to be inner Height
  
      margin_top = (window.innerHeight - viewportHeight)/2;
      margin_left = 0;


    }

    ///SCALING
    cam_factor_mod = cam_factor * Math.min((viewportWidth/1000)*quality, (viewportHeight/1000)*quality);
    
  } else {
    if (window.innerWidth/aspect_ratio>window.innerHeight) { //If target viewport height is larger then inner height
      
      //document.documentElement.scrollWidth/scrollHeight
      viewportHeight = window.innerHeight; //Force Height to be inner Height
      viewportWidth = aspect_ratio*window.innerHeight;  //Scale width proportionally
  
      margin_top = 0;
      margin_left = (window.innerWidth - viewportWidth)/2;
    } else {  //If target viewport width is larger then inner width
  
      viewportHeight = window.innerWidth/aspect_ratio; //Scale viewport height proportionally
      viewportWidth = window.innerWidth; //Force Width  to be inner Height
  
      margin_top = (window.innerHeight - viewportHeight)/2;
      margin_left = 0;

    }

    ///SCALING
    cam_factor_mod = cam_factor * Math.min(viewportWidth/1000, viewportHeight/1000);
  }
  vp.style.marginTop=margin_top+'px';
  vp.style.marginLeft=margin_left+'px';

}

function fitCameraToViewport(view_instance, w,h, adjust=true) {
  view_instance.renderer.setSize( w, h);
  view_instance.composer.setSize( w, h);
  //view_instance.camera.aspect = w / h;
  if (adjust) {
    view_instance.camera.left = -w / cam_factor_mod;
    view_instance.camera.right = w / cam_factor_mod;
    view_instance.camera.top = h / cam_factor_mod;
    view_instance.camera.bottom = -h / cam_factor_mod;
  }

  view_instance.camera.updateProjectionMatrix();
}


function capturer_custom_save() {
  setTimeout(() => {
    capturer.save(function( blob ) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `VERSE_${parseInt(Math.random()*10000000)}.gif`;
      a.click();
      URL.revokeObjectURL(url);
      });
      setTimeout(() => {
        capturer = null; //Set capturer back to null after download
      }, 250);
    }, 0);
}

function check_drawing_buffer(q) {
  const max_side = 5500; // looks like the max buffer for Chrome on desktop is 5760, so we take a bit lower to be safe
  //console.log(window.devicePixelRatio)
  var taget_size = q*Math.max(viewportWidth, viewportHeight);
  if (taget_size > max_side) {
    var reduced_quality = q*max_side/taget_size;
    console.log("Browser drawing buffer exceed. Reverting to the following quality multiplier: " + reduced_quality.toFixed(2).toString());
    return reduced_quality;
  } else {
    return q
  }
}

// define a handler
function doc_keyUp(e) {
  // Example double key use: e.ctrlKey && e.key === 'ArrowDown'
  // this would test for whichever key is 40 (down arrow) and the ctrl key at the same time
  if (e.keyCode === 49 || e.keyCode === 97) { // 1 or NumPad 1   
    snap = true;
    quality = 1;
  } else if (e.keyCode === 50 || e.keyCode === 98) {// 2 or NumPad 2
    snap = true;
    quality = check_drawing_buffer(2);
  } else if (e.keyCode === 51 || e.keyCode === 99) {// 3 or NumPad 3
    snap = true;
    quality = check_drawing_buffer(3);
  } else if (e.keyCode === 52 || e.keyCode === 100) { // 4 or NumPad 4
    snap = true;
    quality = check_drawing_buffer(4);
  } else if (e.keyCode === 53 || e.keyCode === 101) { // 5 or NumPad 5
    snap = true;
    quality = check_drawing_buffer(5);
  } else if (e.keyCode === 71 ) {  //"g" = Gif
    recording = !recording;
    if(recording){
      //new capturer instance
      capturer = new CCapture( {
        verbose: false,
        display: false,
        //quality: 99,
        //name: variant_name,
        //framerate:,
        //autoSaveTime:, //does not work for gif
        //timeLimit: 10000,
        format: 'gif',
        workersPath: 'js/capture/src/'
      } );
      capturer.start();
      setTimeout(() => {
        if (capturer != null) {
          capturer.stop();
          capturer_custom_save();
        }
      },5000)
    }
    else if (capturer != null) { //If capturer in ongoing and button press the "g" button again
      capturer.stop();
      capturer_custom_save();

    }
  } else if (e.keyCode === 70 ) {  //"f" = increment light travel framerate
    light_framerate_change = findNextValueByValue(light_framerate_change, light_frame_speed_param)
    console.log("light framerate changed to: " + getKeyByValue(light_frame_speed_param, light_framerate_change))
  } else if (e.keyCode === 84 ) {  //"t" = increase travel speed
    base_light_angle_step = findNextValueByValue(base_light_angle_step, light_step_size_param)
    console.log("light angle step changed to: " + getKeyByValue(light_step_size_param, base_light_angle_step))
  } else if (e.keyCode === 65 ) {  //"a" = jump light angle by 30 degrees
    light_angle += Math.PI/6; //advance light angle by 30deg
    console.log("Skipped 30degrees")
  } else if (e.keyCode === 66 ) {  //"b" = flip background from black to white
    background_toggle = !background_toggle;
    if (background_toggle) {
      document.body.style.backgroundColor = "black";
      console.log("Background: black")
    } else {
      document.body.style.backgroundColor = "white";
      console.log("Background: white")
    }
    
  } 
  else if (e.keyCode === 73 && !e.ctrlKey) {  //i and not ctrl
    document.getElementById("keybinding").style.display = "block";
    document.querySelector("#keybinding").style.opacity = 1
    //Load modal with decription for all the keys for few 
    //seconds and make it fade to invisible after a few seconds. 
    //Each additional non active key press restarts the fade out animation
    if (typeof fade !== 'undefined') {
      clearInterval(fade)
      };
    var fade;
    setTimeout(function() {
      fade = setInterval(function () {
        document.querySelector("#keybinding").style.opacity -= 0.025;
        if (document.querySelector("#keybinding").style.opacity <= 0 ) {
          document.querySelector("#keybinding").style.display = "none";
          clearInterval(fade)
        }
      }, 100);
    },3000);
  }
}

const handler = (e) => {
    obscvrvm();
};

const capture = (contx) => {
  ///DOCSIZE
  document.documentElement.scrollWidth = viewportWidth*quality;
  document.documentElement.scrollHeight = viewportHeight*quality;
  ///SCALING
  cam_factor_mod = cam_factor * Math.min(viewportWidth*quality/1000, viewportHeight*quality/1000);
  ///SetMargin to 0
  document.getElementById('viewport').style.marginTop=0 +'px';
  document.getElementById('viewport').style.marginLeft=0 +'px';
  fitCameraToViewport(contx.view, viewportWidth*quality, viewportHeight*quality, true); //Projection Matrix Updated here

  composer.render();

  try {
    const urlBase64 = renderer.domElement.toDataURL('img/png'); 
    const a = document.createElement("a");
    a.href = urlBase64;
    a.download = `VERSE_${parseInt(Math.random()*10000000)}.png`;
    a.click();
    URL.revokeObjectURL(urlBase64);
  }  
  catch(e) {
    console.log("Browser does not support taking screenshot of 3d context");
    return;
  }
  // Set to standard quality
  quality = 1;

  viewportAdjust(document.getElementById('viewport'))
  cam_factor_mod = cam_factor * Math.min(viewportWidth*quality/1000, viewportHeight*quality/1000);
  
  fitCameraToViewport(contx.view, viewportWidth, viewportHeight); //Projection Matrix Updated
  
  composer.render();
};

// register the capture key handler 
document.addEventListener('keyup', doc_keyUp, false);

document.addEventListener('DOMContentLoaded', () => {
  handler();
});



