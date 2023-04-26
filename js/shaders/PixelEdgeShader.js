/*
import {
	Vector2
} from './three.module.js';
*/
// custom shader template for threejs

// written by Galo Canizares aka itsgalo @GaloAndStuff

( function () {
const PixelEdgeShader = {

	uniforms: {

		'tDiffuse': { value: null },
		'resolution': { value: new THREE.Vector2() }

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform sampler2D tDiffuse;
		uniform vec2 resolution;
		varying vec2 vUv;

		void main() {
      			//set texel to single pixel
			vec2 texel = vec2( 1.0 / resolution.x, 1.0 / resolution.y );

			//get the image
			vec4 color = texture2D(tDiffuse, vUv);

			vec4 texRight = texture2D(tDiffuse, vUv+vec2(texel.x, 0.0));
			vec4 texBottom = texture2D(tDiffuse, vUv+vec2(0.0, texel.y));
			float dx = length(color-texRight) / texel.x;
			float dy = length(color-texBottom) / texel.y;
		  
			float threshold = sqrt(pow(dx,2.0) + pow(dy,2.0)) * 0.004; 
		  
			if(threshold > 0.2) {
				gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
			} else {
			  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
			}

		}`

};

THREE.PixelEdgeShader = PixelEdgeShader;

} )();
//export { PixelEdgeShader };