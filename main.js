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
var aspect_ratio = 0.75; //// 0.5625 - 16:9 aspect ratio, 0.75 - portrait (used in O B S C V R V M)
var explosion_type = 0; // no explosion
var light_source_type = "south";

var global_rot_x = -Math.PI/16; // global rotation of the model around the X axis, -Math.PI/16
var global_rot_y = 0; // global rotation of the model around the Y axis, Math.PI/16

var total_frame_size_x = 10; // 6, 12, 10
var total_frame_size_y = 15; // 9, 18, 23
var frame_cell_w = 35; // 50, 25, 25
var frame_cell_h = 50; // 100, 50, 35
var frame_cell_d = 25; // 50, 25, 25

//                           [vert, hor,  a,    b,    c,    d,    e,    f,    g_u,  h_u,  g_l,  h_l]
var frame_links_visibility = [true, true, true, true, true, true, true, true, true, true, true, true];
var frame_links_thickness  = [2.5,  2.5,  0.5,  0.5,  0.5,  0.5,  0.5,  0.5,  1.0,  1.0,  1.0,  1.0];
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

  //composer = new THREE.EffectComposer( renderer );
  composer.setSize(window.innerWidth, window.innerHeight)

  // change scene background to solid color
  scene.background = new THREE.Color('#080808'); //0xffffff, 0x000000

  const color = 0xffffff; //0xffffff
  const amb_intensity = 0.1; //0-1, zero works great for shadows with strong contrast

  // ADD LIGHTING
  var light = new THREE.PointLight(0xffffff);
  light.position.set(0, 0, 2000); //1000,1000,1000
 
  light.castShadow = true;
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

  // FXAA antialiasing
  const effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
  effectFXAA.uniforms[ 'resolution' ].value.x = 1 / ( window.innerWidth * window.devicePixelRatio );
  effectFXAA.uniforms[ 'resolution' ].value.y = 1 / ( window.innerHeight * window.devicePixelRatio );
  //this.composer.addPass( effectFXAA );

  //Bloom
  const bloomPass = new THREE.UnrealBloomPass();
  bloomPass.strength = 0.30;
  bloomPass.radius = 0.0;
  bloomPass.threshold = 0.0;
  this.composer.addPass(bloomPass)

  //Colour to Grayscale 
  //const effectGrayScale = new THREE.ShaderPass( THREE.LuminosityHighPassShader);
  //this.composer.addPass(effectGrayScale)

  //Gaussian Blur Filter to improve sobel operator?

  //Sobel operator
  const effectSobel = new THREE.ShaderPass( THREE.SobelOperatorShader);
  effectSobel.uniforms['resolution'].value.x = window.innerWidth * window.devicePixelRatio * 4.0; // increased the resolution of the texture to get finer edge detection
  effectSobel.uniforms['resolution'].value.y = window.innerHeight * window.devicePixelRatio * 4.0; // same as above
  //this.composer.addPass(effectSobel);

  //Sobel operator
  const effectPixelEdge = new THREE.ShaderPass( THREE.PixelEdgeShader);
  effectPixelEdge.uniforms['resolution'].value.x = window.innerWidth * window.devicePixelRatio * 4.0; // increased the resolution of the texture to get finer edge detection
  effectPixelEdge.uniforms['resolution'].value.y = window.innerHeight * window.devicePixelRatio * 4.0; // same as above
  this.composer.addPass(effectPixelEdge);

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

//ROCK BUILDING HELPERS

//opensimplexnoise
function openSimplexNoise(clientSeed) {
	"use strict";
	const SQ5 = 2.23606797749979;
	const SQ4 = 2;
	const SQ3 = 1.7320508075688772;
	const toNums = (s) => s.split(",").map(s => new Uint8Array(s.split("").map(v => Number(v))));
	const decode = (m, r, s) => new Int8Array(s.split("").map(v => parseInt(v, r) + m));
	const toNumsB32 = (s) => s.split(",").map(s => parseInt(s, 32));
	const NORM_2D = 1.0 / 47.0;
	const NORM_3D = 1.0 / 103.0;
	const NORM_4D = 1.0 / 30.0;
	const SQUISH_2D = (SQ3 - 1) / 2;
	const SQUISH_3D = (SQ4 - 1) / 3;
	const SQUISH_4D = (SQ5 - 1) / 4;
	const STRETCH_2D = (1 / SQ3 - 1) / 2;
	const STRETCH_3D = (1 / SQ4 - 1) / 3;
	const STRETCH_4D = (1 / SQ5 - 1) / 4;
	var base2D = toNums("110101000,110101211");
	var base3D = toNums("0000110010101001,2110210120113111,110010101001211021012011");
	var base4D = toNums("0000011000101001001010001,3111031101310113011141111,11000101001001010001211002101021001201102010120011,31110311013101130111211002101021001201102010120011");
	const gradients2D = decode(-5, 11, "a77a073aa3700330");
	const gradients3D = decode(-11, 23, "0ff7mf7fmmfffmfffm07f70f77mm7ff0ff7m0f77m77f0mf7fm7ff0077707770m77f07f70");
	const gradients4D = decode(-3, 7, "6444464444644446044426442464244662444044426442460244204422642246642446244404442604242624240424266224402442044226022420242204222664424642446244400442264224622440624240424262424002422042226222406422462244024420042226222402242062224022420242200222202222022220");
	var lookupPairs2D = () => new Uint8Array([0,1, 1,0, 4,1, 17,0, 20,2, 21,2, 22,5, 23, 5,26, 4,39, 3,42, 4,43, 3]);
	var lookupPairs3D = () => new Uint16Array(toNumsB32("0,2,1,1,2,2,5,1,6,0,7,0,10,2,12,2,41,1,45,1,50,5,51,5,g6,0,g7,0,h2,4,h6,4,k5,3,k7,3,l0,5,l1,5,l2,4,l5,3,l6,4,l7,3,l8,d,l9,d,la,c,ld,e,le,c,lf,e,m8,k,ma,i,p9,l,pd,n,q8,k,q9,l,15e,j,15f,m,16a,i,16e,j,19d,n,19f,m,1a8,f,1a9,h,1aa,f,1ad,h,1ae,g,1af,g,1ag,b,1ah,a,1ai,b,1al,a,1am,9,1an,9,1bg,b,1bi,b,1eh,a,1el,a,1fg,8,1fh,8,1qm,9,1qn,9,1ri,7,1rm,7,1ul,6,1un,6,1vg,8,1vh,8,1vi,7,1vl,6,1vm,7,1vn,6"));
	var lookupPairs4D = () => new Uint32Array(toNumsB32("0,3,1,2,2,3,5,2,6,1,7,1,8,3,9,2,a,3,d,2,g,3,i,3,m,1,n,1,o,3,q,3,11,2,15,2,16,1,17,1,19,2,1d,2,1m,1,1n,1,1o,0,1p,0,1q,0,1r,0,1s,0,1t,0,1u,0,1v,0,80,3,82,3,88,3,8a,3,8g,3,8i,3,8o,3,8q,3,201,2,205,2,209,2,20d,2,211,2,215,2,219,2,21d,2,280,9,281,9,288,9,289,9,g06,1,g07,1,g0m,1,g0n,1,g16,1,g17,1,g1m,1,g1n,1,g82,8,g86,8,g8i,8,g8m,8,i05,6,i07,6,i15,6,i17,6,i80,9,i81,9,i82,8,i85,6,i86,8,i87,6,i88,9,i89,9,i8i,8,i8m,8,i95,6,i97,6,401o,0,401p,0,401q,0,401r,0,401s,0,401t,0,401u,0,401v,0,408o,7,408q,7,409o,7,409q,7,4219,5,421d,5,421p,5,421t,5,4280,9,4281,9,4288,9,4289,9,428o,7,428q,7,4299,5,429d,5,429o,7,429p,5,429q,7,429t,5,4g1m,4,4g1n,4,4g1u,4,4g1v,4,4g82,8,4g86,8,4g8i,8,4g8m,8,4g8o,7,4g8q,7,4g9m,4,4g9n,4,4g9o,7,4g9q,7,4g9u,4,4g9v,4,4i05,6,4i07,6,4i15,6,4i17,6,4i19,5,4i1d,5,4i1m,4,4i1n,4,4i1p,5,4i1t,5,4i1u,4,4i1v,4,4i80,9,4i81,9,4i82,8,4i85,6,4i86,8,4i87,6,4i88,9,4i89,9,4i8i,8,4i8m,8,4i8o,7,4i8q,7,4i95,6,4i97,6,4i99,5,4i9d,5,4i9m,4,4i9n,4,4i9o,7,4i9p,5,4i9q,7,4i9t,5,4i9u,4,4i9v,4,4ia0,15,4ia1,15,4ia2,14,4ia5,12,4ia6,14,4ia7,12,4ia8,15,4ia9,15,4iai,14,4iam,14,4iao,13,4iaq,13,4ib5,12,4ib7,12,4ib9,11,4ibd,11,4ibm,10,4ibn,10,4ibo,13,4ibp,11,4ibq,13,4ibt,11,4ibu,10,4ibv,10,4ii0,1h,4ii2,1g,4ii8,1h,4iii,1g,4iio,1f,4iiq,1f,4ka1,1e,4ka5,1d,4ka9,1e,4kb5,1d,4kb9,1c,4kbd,1c,4ki0,1h,4ki1,1e,4ki8,1h,4ki9,1e,52a6,1b,52a7,1a,52am,1b,52b7,1a,52bm,19,52bn,19,52i2,1g,52i6,1b,52ii,1g,52im,1b,54a5,1d,54a7,1a,54b5,1d,54b7,1a,54i0,v,54i1,s,54i2,v,54i5,s,54i6,p,54i7,p,8ibo,18,8ibp,17,8ibq,18,8ibt,17,8ibu,16,8ibv,16,8iio,1f,8iiq,1f,8ijo,18,8ijq,18,8kb9,1c,8kbd,1c,8kbp,17,8kbt,17,8ki8,u,8ki9,r,8kio,u,8kj9,r,8kjo,m,8kjp,m,92bm,19,92bn,19,92bu,16,92bv,16,92ii,t,92im,o,92iq,t,92jm,o,92jq,l,92ju,l,94b5,q,94b7,n,94bd,q,94bn,n,94bt,k,94bv,k,94i0,v,94i1,s,94i2,v,94i5,s,94i6,p,94i7,p,94i8,u,94i9,r,94ii,t,94im,o,94io,u,94iq,t,94j5,q,94j7,n,94j9,r,94jd,q,94jm,o,94jn,n,94jo,m,94jp,m,94jq,l,94jt,k,94ju,l,94jv,k,94k0,1t,94k1,1s,94k2,1t,94k5,1s,94k6,1r,94k7,1r,94k8,1q,94k9,1p,94ki,1n,94km,1m,94ko,1q,94kq,1n,94l5,1k,94l7,1j,94l9,1p,94ld,1k,94lm,1m,94ln,1j,94lo,1o,94lp,1o,94lq,1l,94lt,1i,94lu,1l,94lv,1i,94s0,1t,94s2,1t,94s8,1q,94si,1n,94so,1q,94sq,1n,96k1,1s,96k5,1s,96k9,1p,96l5,1k,96l9,1p,96ld,1k,96s0,2f,96s1,2f,96s8,2c,96s9,2c,9kk6,1r,9kk7,1r,9kkm,1m,9kl7,1j,9klm,1m,9kln,1j,9ks2,2e,9ks6,2e,9ksi,29,9ksm,29,9mk5,2d,9mk7,2d,9ml5,26,9ml7,26,9ms0,2f,9ms1,2f,9ms2,2e,9ms5,2d,9ms6,2e,9ms7,2d,d4lo,1o,d4lp,1o,d4lq,1l,d4lt,1i,d4lu,1l,d4lv,1i,d4so,2b,d4sq,28,d4to,2b,d4tq,28,d6l9,2a,d6ld,25,d6lp,2a,d6lt,25,d6s8,2c,d6s9,2c,d6so,2b,d6t9,2a,d6to,2b,d6tp,2a,dklm,27,dkln,24,dklu,27,dklv,24,dksi,29,dksm,29,dksq,28,dktm,27,dktq,28,dktu,27,dml5,26,dml7,26,dmld,25,dmln,24,dmlt,25,dmlv,24,dms0,23,dms1,23,dms2,22,dms5,20,dms6,22,dms7,20,dms8,23,dms9,23,dmsi,22,dmsm,22,dmso,21,dmsq,21,dmt5,20,dmt7,20,dmt9,1v,dmtd,1v,dmtm,1u,dmtn,1u,dmto,21,dmtp,1v,dmtq,21,dmtt,1v,dmtu,1u,dmtv,1u,dmu0,j,dmu1,j,dmu2,i,dmu5,g,dmu6,i,dmu7,g,dmu8,j,dmu9,j,dmui,i,dmum,i,dmuo,h,dmuq,h,dmv5,g,dmv7,g,dmv9,f,dmvd,f,dmvm,e,dmvn,e,dmvo,h,dmvp,f,dmvq,h,dmvt,f,dmvu,e,dmvv,e,dn60,j,dn61,j,dn62,i,dn66,i,dn68,j,dn69,j,dn6i,i,dn6m,i,dn6o,h,dn6q,h,dn7o,h,dn7q,h,dou0,j,dou1,j,dou5,g,dou7,g,dou8,j,dou9,j,dov5,g,dov7,g,dov9,f,dovd,f,dovp,f,dovt,f,dp60,j,dp61,j,dp68,j,dp69,j,e6u2,i,e6u5,g,e6u6,i,e6u7,g,e6ui,i,e6um,i,e6v5,g,e6v7,g,e6vm,e,e6vn,e,e6vu,e,e6vv,e,e762,i,e766,i,e76i,i,e76m,i,e8u5,g,e8u7,g,e8v5,g,e8v7,g,e960,d,e961,d,e962,d,e963,d,e964,d,e965,d,e966,d,e967,d,hmuo,h,hmuq,h,hmv9,f,hmvd,f,hmvm,e,hmvn,e,hmvo,h,hmvp,f,hmvq,h,hmvt,f,hmvu,e,hmvv,e,hn6o,h,hn6q,h,hn7o,h,hn7q,h,hov9,f,hovd,f,hovp,f,hovt,f,hp68,c,hp69,c,hp6o,c,hp6p,c,hp78,c,hp79,c,hp7o,c,hp7p,c,i6vm,e,i6vn,e,i6vu,e,i6vv,e,i76i,b,i76m,b,i76q,b,i76u,b,i77i,b,i77m,b,i77q,b,i77u,b,i8v5,a,i8v7,a,i8vd,a,i8vf,a,i8vl,a,i8vn,a,i8vt,a,i8vv,a,i960,d,i961,d,i962,d,i963,d,i964,d,i965,d,i966,d,i967,d,i968,c,i969,c,i96i,b,i96m,b,i96o,c,i96p,c,i96q,b,i96u,b,i975,a,i977,a,i978,c,i979,c,i97d,a,i97f,a,i97i,b,i97l,a,i97m,b,i97n,a,i97o,c,i97p,c,i97q,b,i97t,a,i97u,b,i97v,a"));
	var p2D = decode(-1, 4, "112011021322233123132111");
	var p3D = decode(-1, 5, "112011210110211120110121102132212220132122202131222022243214231243124213241324123222113311221213131221123113311112202311112022311112220342223113342223311342223131322023113322023311320223113320223131322203311322203131");
	var p4D = decode(-1, 6, "11201112101121101102111120111210110121110211112011011211012111021322112220122210132121220212212013122120221212201321122201222102131212202122120213112220122210222532215232152231253212523125221325312252132521232513225123251223232211432114231123212143121421312312214132141231232112431124211323121241312412132311224113241123342221322203311134221232202331113421223202233111342221322203131134221232202313113412223022231311342221322203113134212232022311313412223022231131342212322023111334212232022311133412223022231113322201222101111132202122120111113202212122011111322012221021111132021221202111113201222102211111322201222103311132202122120331113220122210233111322201222103131132022121220313113202122120231311322021221203113132022121220311313201222102231131322012221023111332021221202311133201222102231113422111331113222042121131311322204211213113132220422111331113220242121131311322024211123111332202422111331113202242112131131320224211123111332022421211313113022242112131131302224211123111330222443211423115222244312142131522224413214123152222443112421135222244131241213522224411324112352222443211423113222044312142131322204413214123132220443211423113220244311242113322024413124121332202443121421313202244311242113320224411324112332022441321412313022244131241213302224411324112330222");

	const setOf = (count, cb = (i)=>i) => { var a = [],i = 0; while (i < count) { a.push(cb(i ++)) } return a };
	const doFor = (count, cb) => { var i = 0; while (i < count && cb(i++) !== true); };

	function shuffleSeed(seed,count = 1){
		seed = seed * 1664525 + 1013904223 | 0;
		count -= 1;
		return count > 0 ? shuffleSeed(seed, count) : seed;
	}
	const types = {
		_2D : {
			base : base2D,
			squish : SQUISH_2D,
			dimensions : 2,
			pD : p2D,
			lookup : lookupPairs2D,
		},
		_3D : {
			base : base3D,
			squish : SQUISH_3D,
			dimensions : 3,
			pD : p3D,
			lookup : lookupPairs3D,
		},
		_4D : {
			base : base4D,
			squish : SQUISH_4D,
			dimensions : 4,
			pD : p4D,
			lookup : lookupPairs4D,
		},
	};

	function createContribution(type, baseSet, index) {
		var i = 0;
		const multiplier = baseSet[index ++];
		const c = { next : undefined };
		while(i < type.dimensions){
			const axis = ("xyzw")[i];
			c[axis + "sb"] = baseSet[index + i];
			c["d" + axis] = - baseSet[index + i++] - multiplier * type.squish;
		}
		return c;
	}

	function createLookupPairs(lookupArray, contributions){
		var i;
		const a = lookupArray();
		const res = new Map();
		for (i = 0; i < a.length; i += 2) { res.set(a[i], contributions[a[i + 1]]) }
		return res;
	}

	function createContributionArray(type) {
		const conts = [];
		const d = type.dimensions;
		const baseStep = d * d;
		var k, i = 0;
		while (i < type.pD.length) {
			const baseSet = type.base[type.pD[i]];
			let previous, current;
			k = 0;
			do {
				current = createContribution(type, baseSet, k);
				if (!previous) { conts[i / baseStep] = current }
				else { previous.next = current }
				previous = current;
				k += d + 1;
			} while(k < baseSet.length);

			current.next = createContribution(type, type.pD, i + 1);
			if (d >= 3) { current.next.next = createContribution(type, type.pD, i + d + 2) }
			if (d === 4) { current.next.next.next = createContribution(type, type.pD, i + 11) }
			i += baseStep;
		}
		const result = [conts, createLookupPairs(type.lookup, conts)];
		type.base = undefined;
		type.lookup = undefined;
		return result;
	}

	const [contributions2D, lookup2D] = createContributionArray(types._2D);
	const [contributions3D, lookup3D] = createContributionArray(types._3D);
	const [contributions4D, lookup4D] = createContributionArray(types._4D);
	const perm = new Uint8Array(256);
	const perm2D = new Uint8Array(256);
	const perm3D = new Uint8Array(256);
	const perm4D = new Uint8Array(256);
	const source = new Uint8Array(setOf(256, i => i));
	var seed = shuffleSeed(clientSeed, 3);
	doFor(256, i => {
		i = 255 - i;
		seed = shuffleSeed(seed);
		var r = (seed + 31) % (i + 1);
		r += r < 0 ? i + 1 : 0;
		perm[i] = source[r];
		perm2D[i] = perm[i] & 0x0E;
		perm3D[i] = (perm[i] % 24) * 3;
		perm4D[i] = perm[i] & 0xFC;
		source[r] = source[i];
	});
	base2D = base3D = base4D = undefined;
	lookupPairs2D = lookupPairs3D = lookupPairs4D = undefined;
	p2D = p3D = p4D = undefined;

	const API = {
		noise2D(x, y) {
			const pD = perm2D;
			const p = perm;
			const g = gradients2D;
			const stretchOffset = (x + y) * STRETCH_2D;
			const xs = x + stretchOffset, ys = y + stretchOffset;
			const xsb = Math.floor(xs), ysb = Math.floor(ys);
			const squishOffset	= (xsb + ysb) * SQUISH_2D;
			const dx0 = x - (xsb + squishOffset), dy0 = y - (ysb + squishOffset);
			var c = (() => {
				const xins = xs - xsb, yins = ys - ysb;
				const inSum = xins + yins;
				return lookup2D.get(
					(xins - yins + 1) |
					(inSum << 1) |
					((inSum + yins) << 2) |
					((inSum + xins) << 4)
				);
			})();
			var i, value = 0;
			while (c !== undefined) {
				const dx = dx0 + c.dx;
				const dy = dy0 + c.dy;
				let attn = 2 - dx * dx - dy * dy;
				if (attn > 0) {
					i = pD[(p[(xsb + c.xsb) & 0xFF] + (ysb + c.ysb)) & 0xFF];
					attn *= attn;
					value += attn * attn * (g[i++] * dx + g[i] * dy);
				}
				c = c.next;
			}
			return value * NORM_2D;
		},
		noise3D(x, y, z) {
			const pD = perm3D;
			const p = perm;
			const g = gradients3D;
			const stretchOffset = (x + y + z) * STRETCH_3D;
			const xs = x + stretchOffset, ys = y + stretchOffset, zs = z + stretchOffset;
			const xsb = Math.floor(xs), ysb = Math.floor(ys), zsb = Math.floor(zs);
			const squishOffset	= (xsb + ysb + zsb) * SQUISH_3D;
			const dx0 = x - (xsb + squishOffset), dy0 = y - (ysb + squishOffset), dz0 = z - (zsb + squishOffset);
			var c = (() => {
				const xins = xs - xsb, yins = ys - ysb, zins = zs - zsb;
				const inSum = xins + yins + zins;
				return lookup3D.get(
					(yins - zins + 1) |
					((xins - yins + 1) << 1) |
					((xins - zins + 1) << 2) |
					(inSum << 3) |
					((inSum + zins) << 5) |
					((inSum + yins) << 7) |
					((inSum + xins) << 9)
				);
			})();
			var i, value = 0;
			while (c !== undefined) {
				const dx = dx0 + c.dx, dy = dy0 + c.dy, dz = dz0 + c.dz;
				let attn = 2 - dx * dx - dy * dy - dz * dz;
				if (attn > 0) {
					i = pD[(((p[(xsb + c.xsb) & 0xFF] + (ysb + c.ysb)) & 0xFF) + (zsb + c.zsb)) & 0xFF];
					attn *= attn;
					value += attn * attn * (g[i++] * dx + g[i++] * dy + g[i] * dz);
				}
				c = c.next;
			}
			return value * NORM_3D;
		},
		noise4D(x, y, z, w) {
			const pD = perm4D;
			const p = perm;
			const g = gradients4D;
			const stretchOffset = (x + y + z + w) * STRETCH_4D;
			const xs = x + stretchOffset, ys = y + stretchOffset, zs = z + stretchOffset, ws = w + stretchOffset;
			const xsb = Math.floor(xs), ysb = Math.floor(ys), zsb = Math.floor(zs), wsb = Math.floor(ws);
			const squishOffset	= (xsb + ysb + zsb + wsb) * SQUISH_4D;
			const dx0 = x - (xsb + squishOffset), dy0 = y - (ysb + squishOffset), dz0 = z - (zsb + squishOffset), dw0 = w - (wsb + squishOffset);
			var c = (() => {
				const xins = xs - xsb, yins = ys - ysb, zins = zs - zsb, wins = ws - wsb;
				const inSum = xins + yins + zins + wins;
				return lookup4D.get(
					(zins - wins + 1)  |
					((yins - zins + 1) << 1) |
					((yins - wins + 1) << 2) |
					((xins - yins + 1) << 3) |
					((xins - zins + 1) << 4) |
					((xins - wins + 1) << 5) |
					(inSum << 6) |
					((inSum + wins) << 8) |
					((inSum + zins) << 11) |
					((inSum + yins) << 14) |
					((inSum + xins) << 17)
				);
			})();
			var i, value = 0;
			while (c !== undefined) {
				const dx = dx0 + c.dx, dy = dy0 + c.dy, dz = dz0 + c.dz, dw = dw0 + c.dw;
				let attn = 2 - dx * dx - dy * dy - dz * dz - dw * dw;
				if (attn > 0) {
					i = pD[(((((p[(xsb + c.xsb) & 0xFF] + (ysb + c.ysb)) & 0xFF) + (zsb + c.zsb)) & 0xFF) + (wsb + c.wsb)) & 0xFF];
					attn *= attn;
					value += attn * attn * (g[i++] * dx + g[i++] * dy  + g[i++] * dz + g[i] * dw);
				}
				c = c.next;
			}
			return value * NORM_4D;
		},
	}
	return API;
}

//ROCK PARAMS
let booleanEdge = Math.random() * (20 - 1) + 1; //1-20
let booleanTotal = Math.random() * (15 - 5) + 5;//10-20

let noise = openSimplexNoise(Date.now());
let noiseFreq = Math.random() * (0.08 - 0.01) + 0.01;; //0.01-0.09
let noiseIter = Math.random() * (8 - 3) + 3;

//SDF
let vec3Length = (x, y, z) => (x*x+y*y+z*z)**0.5; //length of 3d vector
let clamp = (x, minVal, maxVal) => Math.min(Math.max(x, minVal), maxVal); //copy of glsl clamp

function lerp(start, end, amt){
  return (1-amt)*start+amt*end
}

function map(n, start1, stop1, start2, stop2) {
	const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;

	if (start2 < stop2) {
		return Math.max(Math.min(newval, stop2), start2);

	} else {
		return Math.max(Math.min(newval, start2), stop2);
	}
}

function fbm(x, y, z) {
  let maxAmp = 0;
  let amp = 1;
  let freq = noiseFreq;
  let bnoise = 0;
  let iterations = noiseIter;
  
  //add successively smaller, higher-frequency terms
  for (let i = 0; i < iterations; i++) {
    bnoise += (noise.noise3D(x * freq, y * freq, z * freq)+1) * amp;
    maxAmp += amp;
    amp *= 0.5;
    freq *= 2;
  }
  //take average of iterations
  bnoise /= maxAmp;
  //normalize
  bnoise = bnoise * (1-0) / 2 + (1+0) / 2;
  return bnoise;
}

function sdf_sphere([x, y, z], r) {
  return vec3Length(x, y, z)-r;
}

function sdf_smoothSubtraction( d1, d2, k ) {
    let h = clamp(0.5 - 0.5 * (d2 + d1) / k, 0.0, 1.0);
    return lerp(d2, -d1, h) + k * h * (1.0 - h); 
}

function sdf([x,y,z], randomLocs) {
  let union = sdf_sphere([x,y,z], fbm(x, y, z)*50);

  for (let i = 0; i < booleanTotal; i++) {
    let b = sdf_sphere([x+randomLocs[i],y+randomLocs[i+1],z+randomLocs[i+2]], 25);
    union = sdf_smoothSubtraction(b, union, booleanEdge);
  }
  
  return Math.min(union, 1.0);
}


View.prototype.addRock = function () {

  //custom material shader for voxels

  const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.1 );
  directionalLight.position.set( -0.5, 1, -0.5 ).normalize();

  let testVertexShader = `
  varying vec2 vUv;
  varying vec3 vPos;
  varying vec3 vNormal;

  void main(){
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    vUv = uv;
    vPos = vec4(projectionMatrix * instanceMatrix * vec4(position, 1.0)).rgb;
    vNormal = normal;
  }`
  let testFragmentShader = `
  uniform vec3 lightDirection;
  varying vec2 vUv;
  varying vec3 vPos;
  varying vec3 vNormal;

  float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
    return 1.-smoothstep(_radius-(_radius*0.01),
                          _radius+(_radius*0.01),
                          dot(dist,dist)*4.0);
  }

  void main() {
      vec3 norm = normalize(vNormal);
      float nDotL = clamp(dot(lightDirection, norm), 0.0, 0.2);
      float strength = step(nDotL, max(abs(vUv.x - 0.5),abs(vUv.y - 0.5)));
      gl_FragColor = vec4(vPos+vec3(circle(vUv, strength*0.05)), 1.0);
  }`

  const outlineMat = new THREE.ShaderMaterial({
    uniforms: {
          lightDirection: { value: directionalLight.position.normalize() }
        },
      vertexShader: testVertexShader,
      fragmentShader: testFragmentShader,
      side: THREE.DoubleSide
    });
  
  const voxelSize = 5;
  const voxel = new THREE.BoxGeometry( voxelSize, voxelSize, voxelSize );
  const voxMat = new THREE.Matrix4();
  const rock = new THREE.InstancedMesh( voxel, outlineMat, 1000000 );

  //array of random values for boolean locations
  let rands = [];
  for (let i = 0; i < 150; i++) {
    rands.push(map(Math.random(), 0, 1, -50, 50)*1);
  }

  //draw voxels
  for ( let i = 0; i < 100; i ++ ) {
    for (let j = 0; j < 100; j++ ) {
      for(let k = 0; k < 100; k++ ) {
        let idx = (j * 100 + i) * 100 + k;

        let p = [i-50, j-50, k-50];
        let d = sdf(p, rands);
        if (d < -0.01) {
          let voxPos = new THREE.Vector3(p[0]*voxelSize, p[1]*voxelSize, p[2]*voxelSize);
          voxMat.setPosition(voxPos.x, voxPos.y, voxPos.z);
          rock.setMatrixAt(idx, voxMat);
        }
      }
    }
  }
  rock.rotateY(Math.PI/4);
  rock.rotateX(Math.PI/4);
  this.scene.add(rock);
}



View.prototype.render = function () {

    this.composer.render();
    //this.renderer.clear();  //

    requestAnimationFrame(this.render.bind(this));
    this.scene.rotateY(0.005);
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
  view.addRock();


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



