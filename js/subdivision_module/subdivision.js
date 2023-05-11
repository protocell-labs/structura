
const reducer = (accumulator, curr) => accumulator + curr;

class Vector {
  constructor(...components) {
    this.components = components
  }

  add({ components }) {
    return new Vector(
      ...components.map((component, index) => this.components[index] + component)
    )
  }

  subtract({ components }) {
    return new Vector(
      ...components.map((component, index) => this.components[index] - component)
    )
  }

  //multiply
  scaleBy(number) {
    return new Vector(
      ...this.components.map(component => component * number)
    )
  }

  //magnitude
  length() {
  return Math.hypot(...this.components)
  }

  dotProduct({ components }) {
  return components.reduce((acc, component, index) => acc + component * this.components[index], 0)
  }

  crossProduct({ components }) {
    return new Vector(
      this.components[1] * components[2] - this.components[2] * components[1],
      this.components[2] * components[0] - this.components[0] * components[2],
      this.components[0] * components[1] - this.components[1] * components[0]
    )
  }

  //normalized
  normalize() {
  return this.scaleBy(1 / this.length())
  }
}


class Node extends Vector {
  constructor(...components){
    super(...components);
    //this.components = components
    this.id = -1
  }

  toString(){
    return `Node at ${this.components[0]}, ${this.components[1]}, ${this.components[2]}.`
  }
}

class Face {
  constructor(nodes = []) {
    this.nodes = nodes
  }

  add_node(n) {
		this.nodes.push(n)
	}

  get_centroid() {
    let num = this.nodes.length;
    //console.log(this.nodes, typeof(this.nodes))
    const x_values = this.nodes.map(n => n.components[0]);
    let avx = x_values.reduce(reducer) / num;
    const y_values = this.nodes.map(n => n.components[1]);
    let avy = y_values.reduce(reducer) / num;
    const z_values = this.nodes.map(n => n.components[2]);
    let avz = z_values.reduce(reducer) / num;
    return new Node(avx,avy,avz);
  }

  get_normal_of_length(l) {
    let fn = this.get_normal();
    let unit_normal = fn.normalize();
    return unit_normal.scaleBy(l)
  }

  get_normal() {
    let e1 = this.nodes[1].subtract(this.nodes[0]);
    let e2 = this.nodes[this.nodes.length - 1].subtract(this.nodes[0]);
    return e1.crossProduct(e2)
  }

  get_funky_point() {
    let cn = this.get_centroid()
    let betw = cn.subtract(this.nodes[0])
    let betw2 = betw.multiply(0.8)
    return this.nodes[0].addition(betw2)
  }

}

class Mesh {
  constructor() {
    this.nodes = [];
    this.faces = [];
  }

  add_face(f) {
    this.faces.push(f);
  }

  add_faces(facelist){
    this.faces.push(...facelist);
  }

  collect_nodes() {
    for (var f in this.faces) {
      for (var n in f.nodes) {
        if (n.id < 0) {
          this.nodes.push(n);
          n.id = this.nodes.length;
        }
      }
    }
  }
}

/*
class RulePyramid {
  replace(mesh, m) {
    const new_mesh = new Mesh();
    for (var f in mesh.faces) {
      let center_node = f.get_centroid();
      let scaled_normal = f.get_normal_of_length();
      let np = center_node.addition(scaled_normal);
      const new_node = new Node(np.components[0], np.components[1], np.components[2])
      for (var i = 0; i < f.nodes.length; i++) {
        let n1 = f.nodes[i];
        let n2 = f.nodes[(i+1) % f.nodes.length]
        const new_face = new Face([n1, n2, new_node])
        new_mesh.add_face(new_face)
      }
    }
    return new_mesh
  }
}
*/

class RulePyramid_v2 {
  constructor() {
  }
  replace(mesh, m, mod) {
    var new_mesh = new Mesh();
    //console.log(mesh.faces.length)
    //var ccc = 0
    for (var n = 0; n < mesh.faces.length; n++) {
      var f = mesh.faces[n];
        if (n % mod == 0) {
          var current_stage = f.nodes[0].components[3]
          var center_node = f.get_centroid();
          var scaled_normal = f.get_normal_of_length(m);
          var np = center_node.add(scaled_normal);
          //console.log(current_stage+1)
          var new_node = new Node(np.components[0], np.components[1], np.components[2],current_stage+1);
          for (var i = 0; i < f.nodes.length; i++) {
            var n1 = f.nodes[i];
            var n2 = f.nodes[(i+1) % f.nodes.length]
            var new_face = new Face([n1, n2, new_node])
            new_mesh.add_face(new_face)
            //ccc ++;
          }
        } else {
          new_mesh.add_face(f);
          //console.log("OLD FACE")
        }

    }
    //console.log("NEW FACES: " + ccc)
    return new_mesh
  }
}

/*
class RuleTapered {
  replace(mesh, df=0.5, h=0, cap=true) {
    const new_mesh = new Mesh();
    for (var f in mesh.faces) {
      let center_node = f.get_centroid();
      let scaled_normal = f.get_normal_of_length(h);

      //calculate new node positions
      const new_nodes = [];
      for (var i = 0; i < f.nodes.length; i++) {
        var n1 = f.nodes[i];
        var betw = center_node.subtract(n1);
        betw = betw.scaleBy(df);
        var nn = n1.add(betw);
        nn = nn.add(scaled_normal);
        new_nodes.push(new Node(np.components[0], np.components[1], np.components[2]))
      }

      //create quads along edge
      for (var i = 0; i < f.nodes.length; i++) {
        var n1 = f.nodes[i];
        var n2 = f.nodes[(i+1) % f.nodes.length];
        var n3 = new_nodes[(i+1) % f.nodes.length];
        var n4 = new_nodes[i];
        const new_face = new Face([n1, n2, n3, n4])
        new_mesh.add_face(new_face)
      }

      if (cap) {
        var cap_face = new Face(new_nodes);
        new_mesh.add_face(cap_face);
      }
    }
    return new_mesh
  }
} */

class RuleTapered_v2 {
  constructor() {
  }
  replace(mesh, df=0.5, h=0, cap=true, mod=1) {
    var new_mesh = new Mesh();
    for (var n = 0; n < mesh.faces.length; n++) {
      var f = mesh.faces[n];
        //let n = mesh.faces.indexOf(f);
        if (n % mod == 0) {
          let center_node = f.get_centroid();
          let scaled_normal = f.get_normal_of_length(h);

          //calculate new node positions
          var new_nodes = [];
          for (var i = 0; i < f.nodes.length; i++) {
            var n1 = f.nodes[i];
            //console.log(n1.components[3])
            var current_stage = n1.components[3]
            var betw = center_node.subtract(n1);
            betw = betw.scaleBy(df);
            var nn = n1.add(betw);
            nn = nn.add(scaled_normal);
            new_nodes.push(new Node(nn.components[0], nn.components[1], nn.components[2], current_stage+1));
          }

          //create quads along edge
          for (var i = 0; i < f.nodes.length; i++) {
            var n1 = f.nodes[i];
            var n2 = f.nodes[(i+1) % f.nodes.length];
            var n3 = new_nodes[(i+1) % f.nodes.length];
            var n4 = new_nodes[i];
            var new_face = new Face([n1, n2, n3, n4]);
            new_mesh.add_face(new_face);
          }

          if (cap) {
            var cap_face = new Face(new_nodes);
            new_mesh.add_face(cap_face);
          }
        } else {
          new_mesh.add_face(f);
        }
    }
    return new_mesh
  }
}

class Plane {
  constructor (cx=0, cy=0, cz=0, a=1, b=1, ds=false) {
    this.loc = new Vector(cx, cy, cz);
    this.a = a;
    this.b = b;
    this.ds = ds;
  }

  get_mesh() {
    const m = new Mesh();

    var ha = this.a/2.0;
    var hb = this.b/2.0;

    const nodes = [];
    nodes.push(new Node(-ha, -hb, 0, 0));
    nodes.push(new Node(ha, -hb, 0, 0));
    nodes.push(new Node(ha, hb, 0, 0));
    nodes.push(new Node(-ha, hb, 0, 0));

    for (var i = 0; i < nodes.length; i++) {
      var vadd = nodes[i].add(this.loc);
      nodes[i] = new Node(vadd.components[0], vadd.components[1], vadd.components[2], 0);
    }

    m.add_face(new Face([nodes[0], nodes[1], nodes[2], nodes[3]]));

    if (this.ds == true) {
      m.add_face(new Face([nodes[3], nodes[2], nodes[1], nodes[0]]));
    }

    return m
  }
}

class Triangle {
  constructor (cx=0, cy=0, cz=0, rad=1, ds=false, rot=0) {
    this.loc = new Vector(cx, cy, cz);
    this.cx = cx;
    this.cy = cy;
    this.rad = rad;
    this.ds = ds;
    this.rot = rot;
  }

  get_mesh() {
    const m = new Mesh();

    var cx = this.cx;
    var cy = this.cy;
    var r = this.rad;
    var rot = this.rot; // controls the rotation of the whole shape

    // to convert degrees to radians we use -> degrees * (Math.PI / 180)

    const nodes = [];
    nodes.push(new Node(cx + r*Math.cos((rot + 0) * (Math.PI / 180)), cy + r*Math.sin((rot + 0) * (Math.PI / 180)), 0, 0));
    nodes.push(new Node(cx + r*Math.cos((rot + 120) * (Math.PI / 180)), cy + r*Math.sin((rot + 120) * (Math.PI / 180)), 0, 0));
    nodes.push(new Node(cx + r*Math.cos((rot + 240) * (Math.PI / 180)), cy + r*Math.sin((rot + 240) * (Math.PI / 180)), 0, 0));

    for (var i = 0; i < nodes.length; i++) {
      var vadd = nodes[i].add(this.loc);
      nodes[i] = new Node(vadd.components[0], vadd.components[1], vadd.components[2], 0);
    }

    m.add_face(new Face([nodes[0], nodes[1], nodes[2]]));

    if (this.ds == true) {
      m.add_face(new Face([nodes[2], nodes[1], nodes[0]]));
    }

    return m
  }
}

class Pentagon {
  constructor (cx=0, cy=0, cz=0, rad=1, ds=false, rot=0) {
    this.loc = new Vector(cx, cy, cz);
    this.cx = cx;
    this.cy = cy;
    this.rad = rad;
    this.ds = ds;
    this.rot = rot;
  }

  get_mesh() {
    const m = new Mesh();

    var cx = this.cx;
    var cy = this.cy;
    var r = this.rad;
    var rot = this.rot; // controls the rotation of the whole shape

    // to convert degrees to radians we use -> degrees * (Math.PI / 180)

    const nodes = [];
    nodes.push(new Node(cx, cy, 0, 0));
    nodes.push(new Node(cx + r*Math.cos((rot + 0) * (Math.PI / 180)), cy + r*Math.sin((rot + 0) * (Math.PI / 180)), 0, 0));
    nodes.push(new Node(cx + r*Math.cos((rot + 72) * (Math.PI / 180)), cy + r*Math.sin((rot + 72) * (Math.PI / 180)), 0, 0));
    nodes.push(new Node(cx + r*Math.cos((rot + 144) * (Math.PI / 180)), cy + r*Math.sin((rot + 144) * (Math.PI / 180)), 0, 0));
    nodes.push(new Node(cx + r*Math.cos((rot + 216) * (Math.PI / 180)), cy + r*Math.sin((rot + 216) * (Math.PI / 180)), 0, 0));
    nodes.push(new Node(cx + r*Math.cos((rot + 288) * (Math.PI / 180)), cy + r*Math.sin((rot + 288) * (Math.PI / 180)), 0, 0));

    for (var i = 0; i < nodes.length; i++) {
      var vadd = nodes[i].add(this.loc);
      nodes[i] = new Node(vadd.components[0], vadd.components[1], vadd.components[2], 0);
    }

    m.add_face(new Face([nodes[0], nodes[1], nodes[2]]));
    m.add_face(new Face([nodes[0], nodes[2], nodes[3]]));
    m.add_face(new Face([nodes[0], nodes[3], nodes[4]]));
    m.add_face(new Face([nodes[0], nodes[4], nodes[5]]));
    m.add_face(new Face([nodes[0], nodes[5], nodes[1]]));

    if (this.ds == true) {
      m.add_face(new Face([nodes[2], nodes[1], nodes[0]]));
      m.add_face(new Face([nodes[3], nodes[2], nodes[0]]));
      m.add_face(new Face([nodes[4], nodes[3], nodes[0]]));
      m.add_face(new Face([nodes[5], nodes[4], nodes[0]]));
      m.add_face(new Face([nodes[1], nodes[5], nodes[0]]));
    }

    return m
  }
}

class Tetrahedron {
  constructor (cx=0, cy=0, cz=0, rad=1, ds=false) {
    this.loc = new Vector(cx, cy, cz);
    this.rad = rad;
    this.ds = ds;
  }

  get_mesh() {
    const m = new Mesh();

    var rad = this.rad/2.0;

    const nodes = [];
    nodes.push(new Node(rad, rad, rad, 0));
    nodes.push(new Node(-rad, -rad, rad, 0));
    nodes.push(new Node(-rad, rad, -rad, 0));
    nodes.push(new Node(rad, -rad, -rad, 0));

    for (var i = 0; i < nodes.length; i++) {
      var vadd = nodes[i].add(this.loc);
      nodes[i] = new Node(vadd.components[0], vadd.components[1], vadd.components[2], 0);
    }

    m.add_face(new Face([nodes[2], nodes[1], nodes[0]]));
    m.add_face(new Face([nodes[0], nodes[3], nodes[2]]));
    m.add_face(new Face([nodes[1], nodes[3], nodes[0]]));
    m.add_face(new Face([nodes[2], nodes[3], nodes[1]]));

    if (this.ds == true) {
      m.add_face(new Face([nodes[0], nodes[1], nodes[2]]));
      m.add_face(new Face([nodes[2], nodes[3], nodes[0]]));
      m.add_face(new Face([nodes[0], nodes[3], nodes[1]]));
      m.add_face(new Face([nodes[1], nodes[3], nodes[2]]));
    }

    return m
  }
}

class Octahedron {
  constructor (cx=0, cy=0, cz=0, a=1, b=1, c=1, ds=false) {
    this.loc = new Vector(cx, cy, cz);
    this.a = a;
    this.b = b;
    this.c = c;
    this.ds = ds;
  }

  get_mesh() {
    const m = new Mesh();

    var ha = this.a/2.0;
    var hb = this.b/2.0;
    var h = this.c/Math.SQRT2;

    const nodes = [];
    nodes.push(new Node(-ha, 0, -hb, 0));
    nodes.push(new Node(-ha, 0, hb, 0));
    nodes.push(new Node(ha, 0, hb, 0));
    nodes.push(new Node(ha, 0, -hb, 0));
    nodes.push(new Node(0, h, 0, 0));
    nodes.push(new Node(0, -h, 0, 0));

    for (var i = 0; i < nodes.length; i++) {
      var vadd = nodes[i].add(this.loc);
      nodes[i] = new Node(vadd.components[0], vadd.components[1], vadd.components[2], 0);
    }

    m.add_face(new Face([nodes[0], nodes[1], nodes[5]]));
    m.add_face(new Face([nodes[3], nodes[0], nodes[5]]));
    m.add_face(new Face([nodes[2], nodes[3], nodes[5]]));
    m.add_face(new Face([nodes[1], nodes[2], nodes[5]]));
    m.add_face(new Face([nodes[1], nodes[0], nodes[4]]));
    m.add_face(new Face([nodes[0], nodes[3], nodes[4]]));
    m.add_face(new Face([nodes[3], nodes[2], nodes[4]]));
    m.add_face(new Face([nodes[2], nodes[1], nodes[4]]));

    if (this.ds == true) {
      m.add_face(new Face([nodes[5], nodes[1], nodes[0]]));
      m.add_face(new Face([nodes[5], nodes[0], nodes[3]]));
      m.add_face(new Face([nodes[5], nodes[3], nodes[2]]));
      m.add_face(new Face([nodes[5], nodes[2], nodes[1]]));
      m.add_face(new Face([nodes[4], nodes[0], nodes[1]]));
      m.add_face(new Face([nodes[4], nodes[3], nodes[0]]));
      m.add_face(new Face([nodes[4], nodes[2], nodes[3]]));
      m.add_face(new Face([nodes[4], nodes[1], nodes[2]]));
    }

    return m
  }
}

class Hexahedron {
  constructor (cx=0, cy=0, cz=0, a=1, b=1, c=1, ds=false) {
    this.loc = new Vector(cx, cy, cz);
    this.a = a;
    this.b = b;
    this.c = c;
    this.ds = ds;
  }

  get_mesh() {
    const m = new Mesh();

    var ha = this.a/2.0;
    var hb = this.b/2.0;
    var hc = this.c/2.0;
    const nodes = [];
    nodes.push(new Node(-ha, -hb, -hc, 0));
    nodes.push(new Node(ha, -hb, -hc, 0));
    nodes.push(new Node(ha, hb, -hc, 0));
    nodes.push(new Node(-ha, hb, -hc, 0));
    nodes.push(new Node(-ha, -hb, hc, 0));
    nodes.push(new Node(ha, -hb, hc, 0));
    nodes.push(new Node(ha, hb, hc, 0));
    nodes.push(new Node(-ha, hb, hc, 0));

    for (var i = 0; i < nodes.length; i++) {
      var vadd = nodes[i].add(this.loc);
      nodes[i] = new Node(vadd.components[0], vadd.components[1], vadd.components[2], 0);
    }

    m.add_face(new Face([nodes[3], nodes[2], nodes[1], nodes[0]]));
    m.add_face(new Face([nodes[4], nodes[5], nodes[6], nodes[7]]));
    m.add_face(new Face([nodes[0], nodes[1], nodes[5], nodes[4]]));
    m.add_face(new Face([nodes[2], nodes[3], nodes[7], nodes[6]]));
    m.add_face(new Face([nodes[1], nodes[2], nodes[6], nodes[5]]));
    m.add_face(new Face([nodes[4], nodes[7], nodes[3], nodes[0]]));

    if (this.ds == true) {
      m.add_face(new Face([nodes[0], nodes[1], nodes[2], nodes[3]]));
      m.add_face(new Face([nodes[7], nodes[6], nodes[5], nodes[4]]));
      m.add_face(new Face([nodes[4], nodes[5], nodes[1], nodes[0]]));
      m.add_face(new Face([nodes[6], nodes[7], nodes[3], nodes[2]]));
      m.add_face(new Face([nodes[5], nodes[6], nodes[2], nodes[1]]));
      m.add_face(new Face([nodes[0], nodes[3], nodes[7], nodes[4]]));
    }

    return m
  }
}

class TriPrism {
  constructor (cx=0, cy=0, cz=0, a=1, b=1, c=1, ds=false) {
    this.loc = new Vector(cx, cy, cz);
    this.a = a;
    this.b = b;
    this.c = c;
    this.ds = ds;
  }

  get_mesh() {
    const m = new Mesh();

    var ha = this.a/2.0;
    var hb = this.b/2.0;
    var hc = this.c/2.0;
    const nodes = [];

    nodes.push(new Node(0, hb, -hc, 0)); // ridge of the pyramid
    nodes.push(new Node(0, -hb, -hc, 0)); // ridge of the pyramid
    nodes.push(new Node(-ha, -hb, hc, 0)); // base of the pyramid
    nodes.push(new Node(ha, -hb, hc, 0)); // base of the pyramid
    nodes.push(new Node(ha, hb, hc, 0)); // base of the pyramid
    nodes.push(new Node(-ha, hb, hc, 0)); // base of the pyramid

    for (var i = 0; i < nodes.length; i++) {
      var vadd = nodes[i].add(this.loc);
      nodes[i] = new Node(vadd.components[0], vadd.components[1], vadd.components[2], 0);
    }

    m.add_face(new Face([nodes[2], nodes[3], nodes[4], nodes[5]])); // base of the pyramid
    m.add_face(new Face([nodes[0], nodes[1], nodes[5]])); // triangulated quad side of the pyramid
    m.add_face(new Face([nodes[1], nodes[2], nodes[5]])); // triangulated quad side of the pyramid
    m.add_face(new Face([nodes[0], nodes[3], nodes[1]])); // triangulated quad side of the pyramid
    m.add_face(new Face([nodes[0], nodes[4], nodes[3]])); // triangulated quad side of the pyramid
    m.add_face(new Face([nodes[2], nodes[1], nodes[3]])); // side triangle of the pyramid
    m.add_face(new Face([nodes[0], nodes[5], nodes[4]])); // side triangle of the pyramid

    /*
    if (this.ds == true) {
      m.add_face(new Face([nodes[0], nodes[1], nodes[2], nodes[3]]));
      m.add_face(new Face([nodes[7], nodes[6], nodes[5], nodes[4]]));
      m.add_face(new Face([nodes[4], nodes[5], nodes[1], nodes[0]]));
      m.add_face(new Face([nodes[6], nodes[7], nodes[3], nodes[2]]));
      m.add_face(new Face([nodes[5], nodes[6], nodes[2], nodes[1]]));
      m.add_face(new Face([nodes[0], nodes[3], nodes[7], nodes[4]]));
    }*/

    return m
  }
}

class Dodecahedron {
  constructor (cx=0, cy=0, cz=0, rad=1, ds=false) {
    this.loc = new Vector(cx, cy, cz)
    this.rad = rad
    this.ds = ds;
  }

  get_mesh() {
    const m = new Mesh();
    const phi = (1 + 5**0.5)/2.0;

    const nodes = [];

    nodes.push( new Node(1, 1, 1, 0));
    nodes.push( new Node(1, 1, -1, 0));
    nodes.push( new Node(1, -1, 1, 0));
    nodes.push( new Node(1, -1, -1, 0));
    nodes.push( new Node(-1, 1, 1, 0));
    nodes.push( new Node(-1, 1, -1, 0));
    nodes.push( new Node(-1, -1, 1, 0));
    nodes.push( new Node(-1, -1, -1, 0));

    nodes.push( new Node(0, -phi, -1/phi, 0));
    nodes.push( new Node(0, -phi, 1/phi, 0));
    nodes.push( new Node(0, phi,-1/phi, 0));
    nodes.push( new Node(0, phi, 1/phi, 0));

    nodes.push( new Node(-phi, -1/phi, 0, 0));
    nodes.push( new Node(-phi, 1/phi, 0, 0));
    nodes.push( new Node(phi, -1/phi, 0, 0));
    nodes.push( new Node(phi, 1/phi, 0, 0));

    nodes.push( new Node(-1/phi, 0, -phi, 0));
    nodes.push( new Node(1/phi, 0, -phi, 0));
    nodes.push( new Node(-1/phi, 0, phi, 0));
    nodes.push( new Node(1/phi, 0, phi, 0));

    for (var i = 0; i < nodes.length; i++) {
      var vadd = nodes[i].add(this.loc);
      vadd = vadd.normalize();
      vadd = vadd.scaleBy(this.rad);
      nodes[i] = new Node(vadd.components[0], vadd.components[1], vadd.components[2], 0)
    }

    m.add_face(new Face([nodes[2], nodes[9], nodes[6], nodes[18], nodes[19]]));
    m.add_face(new Face([nodes[4], nodes[11], nodes[0], nodes[19], nodes[18]]));
    m.add_face(new Face([nodes[18], nodes[6], nodes[12], nodes[13], nodes[4]]));
    m.add_face(new Face([nodes[19], nodes[0], nodes[15], nodes[14], nodes[2]]));
    m.add_face(new Face([nodes[4], nodes[13], nodes[5], nodes[10], nodes[11]]));
    m.add_face(new Face([nodes[14], nodes[15], nodes[1], nodes[17], nodes[3]]));
    m.add_face(new Face([nodes[1], nodes[15], nodes[0], nodes[11], nodes[10]]));
    m.add_face(new Face([nodes[3], nodes[17], nodes[16], nodes[7], nodes[8]]));
    m.add_face(new Face([nodes[2], nodes[14], nodes[3], nodes[8], nodes[9]]));
    m.add_face(new Face([nodes[6], nodes[9], nodes[8], nodes[7], nodes[12]]));
    m.add_face(new Face([nodes[1], nodes[10], nodes[5], nodes[16], nodes[17]]));
    m.add_face(new Face([nodes[12], nodes[7], nodes[16], nodes[5], nodes[13]]));

    if (this.ds == true) {
      m.add_face(new Face([nodes[19], nodes[18], nodes[6], nodes[9], nodes[2]]));
      m.add_face(new Face([nodes[18], nodes[19], nodes[0], nodes[11], nodes[4]]));
      m.add_face(new Face([nodes[4], nodes[13], nodes[12], nodes[6], nodes[18]]));
      m.add_face(new Face([nodes[2], nodes[14], nodes[15], nodes[0], nodes[19]]));
      m.add_face(new Face([nodes[11], nodes[10], nodes[5], nodes[13], nodes[4]]));
      m.add_face(new Face([nodes[3], nodes[17], nodes[1], nodes[15], nodes[14]]));
      m.add_face(new Face([nodes[10], nodes[11], nodes[0], nodes[15], nodes[1]]));
      m.add_face(new Face([nodes[8], nodes[7], nodes[16], nodes[17], nodes[3]]));
      m.add_face(new Face([nodes[9], nodes[8], nodes[3], nodes[14], nodes[2]]));
      m.add_face(new Face([nodes[12], nodes[7], nodes[8], nodes[9], nodes[6]]));
      m.add_face(new Face([nodes[17], nodes[16], nodes[5], nodes[10], nodes[1]]));
      m.add_face(new Face([nodes[13], nodes[5], nodes[16], nodes[7], nodes[12]]));
    }

    return m
  }
}

/*
class Lattice {
  constructor (stiffness, start_bounds) {
    this.stiffness = stiffness;
    this.start_bounds = start_bounds;
    this.centroid = null;
    this.nodes = [];
    this.repulsion_factor = 1.0;
  }
}*/


function objectsEqual(o1, o2) {
  const entries1 = Object.entries(o1);
  const entries2 = Object.entries(o2);
  if (entries1.length !== entries2.length) {
    return false;
  }
  for (let i = 0; i < entries1.length; ++i) {
    // Keys
    if (entries1[i][0] !== entries2[i][0]) {
      return false;
    }
    // Values
    if (entries1[i][1] !== entries2[i][1]) {
      return false;
    }
  }
  return true;
}

function mesh_to_gData(mesh, targetmesh, triangulate=false, debug=false) {
  if (debug){
    console.time("mesh => gData")
  }

  targetmesh = targetmesh || 0;
  var node_checklist = [] //Node Buffer
  var link_checklist = [] //Link Buffer
  var gData = {'nodes': [], 'links': [], 'mesh': []}
  var original_edge_lengths = []
  //console.log(mesh)
  if (debug){
    console.time("--nodes, links, connectivity => gData")
  }
  for (var i = 0; i < mesh.faces.length; i++) {
    var nl = mesh.faces[i].nodes.length;
    //console.log(mesh.faces[i].nodes.length)
    gData['mesh'].push([])
    for (var j = 0; j < nl; j++) {//iterate 3 times for triangles 4//for quads

      var nn = mesh.faces[i].nodes;
      var n = nn[j];

      //Variables for target mesh
      var nn0;
      var n0;

      if (targetmesh != 0) {
        var nn0 = targetmesh.faces[i].nodes;
        var n0 = nn0[j];
      }

      if (!(node_checklist.includes(n))) {
        //[n.components[0],n.components[0],n.components[0]]
        node_checklist.push(n);
        if (targetmesh != 0) {
          gData['nodes'].push({'id':node_checklist.indexOf(n), 'connectivity': 0, 'visible':false, 'x':n.components[0],'y':n.components[1],'z':n.components[2],'x0':n.components[0],'y0':n.components[1],'z0':n.components[2],'x1':n0.components[0],'y1':n0.components[1],'z1':n0.components[2],'stage':n.components[3]})
        } else {
          gData['nodes'].push({'id':node_checklist.indexOf(n), 'connectivity': 0, 'visible':false, 'x':n.components[0],'y':n.components[1],'z':n.components[2],'stage':n.components[3]})
        }
      }
      gData['mesh'][i].push(gData['nodes'][node_checklist.indexOf(n)]) //Addition for mesh face reference
    }


    for (var j = 0; j < nl; j++) {//iterate 3 times for triangles 4//for quads
      var nn = mesh.faces[i].nodes;
      var n = nn[j];

      var l
      var l_len
      if (j < nl-1) {
        l = [node_checklist.indexOf(n), node_checklist.indexOf(nn[j+1])]
        l_len  = ((n.components[0] - nn[j+1].components[0])**2 + (n.components[1] - nn[j+1].components[1])**2 + (n.components[2] - nn[j+1].components[2])**2)**0.5
      } else if (j == nl-1) {
        l = [node_checklist.indexOf(n), node_checklist.indexOf(nn[0])]
        l_len = ((n.components[0] - nn[0].components[0])**2 + (n.components[1] - nn[0].components[1])**2 + (n.components[2] - nn[0].components[2])**2)**0.5
      }
      //console.log(l)
      //Remove reversal and duplicates
      // var a = JSON.stringify(link_checklist); //SUPER SLOW 98% of time
      // var b = JSON.stringify(l); //SLOW //SUPER SLOW 98% of time
      // var c = a.indexOf(b)
      // if (c == -1) {
      // //if (!(link_checklist.includes(l))) {
      //   link_checklist.push(l);
      //   link_checklist.push([l[1], l[0]]); //Include reversed to checklist to omit in future
      //   gData['links'].push({'source':l[0], 'target': l[1], 'value': l_len, 'state': 0, 'visible':true})
      //   if (!(original_edge_lengths.includes(l_len))) {
      //     original_edge_lengths.push(l_len);
      //   }
      //   //Update connectivity counters
      //   gData['nodes'][l[0]]['connectivity'] ++
      //   gData['nodes'][l[1]]['connectivity'] ++
      // }

      //FASTER APPROACH
      const isFound = link_checklist.some(xlink => {
        if ((xlink[0] == l[0] && xlink[1] == l[1]) || (xlink[0] == l[1] && xlink[1] == l[0])) {
          return true;
        }
        return false;
      });
      //
      //
      if (!isFound) {
        link_checklist.push(l);
        gData['links'].push({'source':l[0], 'target': l[1], 'value': l_len, 'state': 0, 'visible':true})
        //Update connectivity counters
        gData['nodes'][l[0]]['connectivity'] ++
        gData['nodes'][l[1]]['connectivity'] ++
      }

      //FASTEST NO CHECK
      //gData['links'].push({'source':l[0], 'target': l[1], 'value': l_len, 'state': 0, 'visible':true}) //NO CHECK REPLACE WITH ABOVE
    }

  }

  if (debug){
    console.timeEnd("--nodes, links, connectivity => gData")
  }

  //console.log("mesh faces before triangulation: " + gData['mesh'].length)
  //console.log(gData)
  var c_count = 0
  //triangulate mesh
  const original_face_number = gData.mesh.length;

  if (triangulate) {
    for (var i = 0; i < original_face_number; i++) {
      if (gData.mesh[i].length == 4) {
        c_count ++
        gData.mesh.push([gData.mesh[i][0],gData.mesh[i][2],gData.mesh[i][3]]) //add to the end
        gData.mesh[i] = [gData.mesh[i][0],gData.mesh[i][1],gData.mesh[i][2]] //replace existing face
      }
    }
  }
  //console.log("|||||||:  " + c_count)
  //console.log(gData['mesh'])

  // //Create connectivity layers
  // var groupBy = function(xs, key) {
  //   return xs.reduce(function(rv, x) {
  //     (rv[x[key]] = rv[x[key]] || []).push(x);
  //     return rv;
  //   }, {});
  // };
  //
  // var mapped_nodes = []
  // //var distance_quad = []
  // //var unique_distances = []
  //
  // for (var i = 0; i < node_checklist.length; i++) {
  //   for (var j = 0; j < node_checklist.length; j++) {
  //     if (i != j) {
  //       var dist = ((node_checklist[i].components[0] - node_checklist[j].components[0])**2 + (node_checklist[i].components[1] - node_checklist[j].components[1])**2 + (node_checklist[i].components[2] - node_checklist[j].components[2])**2)**0.5
  //       /*
  //       if (!(unique_distances.includes(dist))) {
  //         unique_distances.push(dist)
  //       }*/
  //       //distance_quad.push(dist)
  //       mapped_nodes.push({link: [i, j], layer: dist})
  //     }
  //     else if (i == j) {
  //       j = node_checklist.length //skip upper quad when you reach
  //     }
  //   }
  // }
  // mapped_nodes.sort((a,b) =>  a.layer-b.layer) //sort ascending order
  // //gData['layers'] = groupBy(mapped_nodes, 'layer')
  // //Consider renaming in sequence
  //
  // //Add links but with a number
  // original_edge_lengths.sort(function(a, b) {
  //   return a - b;
  // });
  // gData['unique_edge_lengths'] = original_edge_lengths;
  //gData['link_layers'] = groupBy(gData['links'], 'value')
  //console.log("MESH FACES: "+ gData.mesh.length)
  if (debug){
    console.timeEnd("mesh => gData")
  }

  return gData;
}


function calculate_link_length(source_object, target_object) {
  var source_pt = new THREE.Vector3(source_object.x, source_object.y, source_object.z);
  var target_pt = new THREE.Vector3(target_object.x, target_object.y, target_object.z);
  return source_pt.distanceTo(target_pt);
}


function space_frame_triprism_gData(origin = new THREE.Vector3(0, 0, 0)) {

  var source_idx, target_idx, link_length, link_visibility;
  var node_position_z, node_position_y, node_position_z;
  var noise_value_x, noise_value_y, noise_value_z;

  var gData = {'nodes': [], 'links': [], 'joints': [], 'cladding': [], 'mesh': []};
  var node_counter = 0;
  var frame_size_upper_grid = frame_size_x * frame_size_y;

  
  // upper rectangle grid - just nodes
  for (var i = 0; i < frame_size_x; i++) {
    for (var j = 0; j < frame_size_y; j++) {

      node_position_x = i * frame_cell_w - ((frame_size_x - 1) * frame_cell_w) / 2.0 + origin.x;
      node_position_y = j * frame_cell_h - ((frame_size_y - 1) * frame_cell_h) / 2.0 + origin.y;
      node_position_z = 0 + origin.z;

      noise_value_x = perlin3D(i * noise_scale_x + noise_shift_x + origin.x, j * noise_scale_y + noise_shift_y + origin.y, noise_scale_z + noise_shift_z + origin.z);
      noise_value_y = perlin3D(i * noise_scale_x + noise_shift_x + origin.x, j * noise_scale_y + noise_shift_y + origin.y, noise_scale_z + noise_shift_z + origin.z + noise_component_offset);
      noise_value_z = perlin3D(i * noise_scale_x + noise_shift_x + origin.x, j * noise_scale_y + noise_shift_y + origin.y, noise_scale_z + noise_shift_z + origin.z + noise_component_offset * 2);
      
      if (modulate_x) {node_position_x += noise_factor * noise_value_x;}
      if (modulate_y) {node_position_y += noise_factor * noise_value_y;}
      if (modulate_z) {node_position_z += noise_factor * noise_value_z;}

      source_idx = node_counter;
      gData['nodes'].push({'id': source_idx, 'connectivity': 0, 'visible': false, 'x': node_position_x, 'y': node_position_y, 'z': node_position_z, 'stage': 1});
      node_counter ++
    }
  }

  var nodes_in_upper_grid = node_counter; // record how many nodes we created in the upper grid
  node_counter = 0; // reset the counter, we need to iterate through the nodes from the beginning

  // upper rectangle grid - just vertical and horizontal links
  for (var i = 0; i < frame_size_x; i++) {
    for (var j = 0; j < frame_size_y; j++) {

      source_idx = node_counter;

      // vertical link
      if (j != frame_size_y - 1) {
        target_idx = node_counter + 1;
        link_length = calculate_link_length(gData['nodes'][source_idx], gData['nodes'][target_idx]) * links_length_reduction[0];
        link_visibility = link_length > cutoff_vert_links ? false : frame_links_visibility[0];
        gData['links'].push({'source': source_idx, 'target': target_idx, 'value': link_length, 'thickness': frame_links_thickness[0], 'state': 0, 'visible': link_visibility});
      }

      // horizontal link
      if (i != frame_size_x - 1) {
        target_idx = node_counter + frame_size_y;
        link_length = calculate_link_length(gData['nodes'][source_idx], gData['nodes'][target_idx]) * links_length_reduction[1];
        link_visibility = link_length > cutoff_hor_links ? false : frame_links_visibility[1];
        gData['links'].push({'source': source_idx, 'target': target_idx, 'value': link_length, 'thickness': frame_links_thickness[1], 'state': 0, 'visible': link_visibility});
      }

      // joints - at vertical links
      if (j != frame_size_y - 1) {
        target_idx = node_counter + 1;
        gData['joints'].push({'source': source_idx, 'target': target_idx, 'value': joint_length, 'thickness': joint_thickness_f, 'state': 0, 'visible': joint_visibility});
      } else { // when we come to the top row, we need to point to the previous node, not the next one
        target_idx = node_counter - 1;
        gData['joints'].push({'source': source_idx, 'target': target_idx, 'value': joint_length, 'thickness': joint_thickness_f, 'state': 0, 'visible': joint_visibility});
      }

      // cladding - vertical orientation - upper grid
      if ((j != frame_size_y - 1) && (i != frame_size_x - 1) && (cladding_upper)) {
        source_idx_a = node_counter;
        target_idx_a = node_counter + 1;
        source_idx_b = node_counter + frame_size_y;
        target_idx_b = node_counter + frame_size_y + 1;
        link_length_a = calculate_link_length(gData['nodes'][source_idx_a], gData['nodes'][target_idx_a]) * links_length_reduction[0];
        link_length_b = calculate_link_length(gData['nodes'][source_idx_b], gData['nodes'][target_idx_b]) * links_length_reduction[0];
        cladding_visibility = gene() < cladding_panel_prob ? true : false;
        gData['cladding'].push({'source_a': source_idx_a, 'source_b': source_idx_b, 'target_a': target_idx_a, 'target_b': target_idx_b, 'value_a': link_length_a, 'value_b': link_length_b, 'thickness': cladding_thickness, 'width': cladding_w, 'location': 'upper', 'visible': cladding_visibility});
      }

      node_counter ++
    }
  }

  // lower rectangle grid (smaller by one cell in width and shifted) - just nodes
  for (var i = 0; i < frame_size_x - 1; i++) {
    for (var j = 0; j < frame_size_y; j++) {

      node_position_x = i * frame_cell_w - ((frame_size_x - 1) * frame_cell_w) / 2.0 + origin.x + frame_cell_w / 2.0;
      node_position_y = j * frame_cell_h - ((frame_size_y - 1) * frame_cell_h) / 2.0 + origin.y;
      node_position_z = origin.z - frame_cell_d;

      noise_value_x = perlin3D(i * noise_scale_x + noise_shift_x + origin.x, j * noise_scale_y + noise_shift_y + origin.y, noise_scale_z + noise_shift_z + origin.z);
      noise_value_y = perlin3D(i * noise_scale_x + noise_shift_x + origin.x, j * noise_scale_y + noise_shift_y + origin.y, noise_scale_z + noise_shift_z + origin.z + noise_component_offset);
      noise_value_z = perlin3D(i * noise_scale_x + noise_shift_x + origin.x, j * noise_scale_y + noise_shift_y + origin.y, noise_scale_z + noise_shift_z + origin.z + noise_component_offset * 2);
      
      if (modulate_x) {node_position_x += noise_factor * noise_value_x;}
      if (modulate_y) {node_position_y += noise_factor * noise_value_y;}
      if (modulate_z) {node_position_z += noise_factor * noise_value_z;}

      source_idx = node_counter;
      gData['nodes'].push({'id':node_counter, 'connectivity': 0, 'visible': false, 'x': node_position_x,'y': node_position_y,'z':node_position_z, 'stage': 1});
      node_counter ++
    }
  }

  node_counter = nodes_in_upper_grid; // move the counter back so we start from the beggining of the lower grid

  // lower rectangle grid (smaller by one cell in width and shifted) - just nodes
  for (var i = 0; i < frame_size_x - 1; i++) {
    for (var j = 0; j < frame_size_y; j++) {

      source_idx = node_counter;

      gData['nodes'].push({'id':node_counter, 'connectivity': 0, 'visible': false, 'x': node_position_x,'y': node_position_y,'z':node_position_z, 'stage': 1});
      
      // vertical link
      if (j != frame_size_y - 1) {
        target_idx = node_counter + 1;
        link_length = calculate_link_length(gData['nodes'][source_idx], gData['nodes'][target_idx]) * links_length_reduction[0];
        link_visibility = link_length > cutoff_vert_links ? false : frame_links_visibility[0];
        gData['links'].push({'source': source_idx, 'target': target_idx, 'value': link_length, 'thickness': frame_links_thickness[0], 'state': 0, 'visible': link_visibility});
      }

      // horizontal link
      if (i != frame_size_x - 2) {
        target_idx = node_counter + frame_size_y;
        link_length = calculate_link_length(gData['nodes'][source_idx], gData['nodes'][target_idx]) * links_length_reduction[1];
        link_visibility = link_length > cutoff_hor_links ? false : frame_links_visibility[1];
        gData['links'].push({'source': source_idx, 'target': target_idx, 'value': link_length, 'thickness': frame_links_thickness[1], 'state': 0, 'visible': link_visibility});
      }

      // joints - at vertical links
      if (j != frame_size_y - 1) {
        target_idx = node_counter + 1;
        gData['joints'].push({'source': source_idx, 'target': target_idx, 'value': joint_length, 'thickness': joint_thickness_f, 'state': 0, 'visible': joint_visibility});
      } else { // when we come to the top row, we need to point to the previous node, not the next one
        target_idx = node_counter - 1;
        gData['joints'].push({'source': source_idx, 'target': target_idx, 'value': joint_length, 'thickness': joint_thickness_f, 'state': 0, 'visible': joint_visibility});
      }

      // cladding - vertical orientation - lower grid
      if ((j != frame_size_y - 1) && (i != frame_size_x - 1) && (cladding_lower)) {
        source_idx_a = node_counter;
        target_idx_a = node_counter + 1;
        source_idx_b = node_counter + frame_size_y;
        target_idx_b = node_counter + frame_size_y + 1;
        link_length_a = calculate_link_length(gData['nodes'][source_idx_a], gData['nodes'][target_idx_a]) * links_length_reduction[0];
        link_length_b = calculate_link_length(gData['nodes'][source_idx_b], gData['nodes'][target_idx_b]) * links_length_reduction[0];
        cladding_visibility = gene() < cladding_panel_prob ? true : false;
        gData['cladding'].push({'source_a': source_idx_a, 'source_b': source_idx_b, 'target_a': target_idx_a, 'target_b': target_idx_b, 'value_a': link_length_a, 'value_b': link_length_b, 'thickness': cladding_thickness, 'width': cladding_w, 'location': 'lower', 'visible': cladding_visibility});
      }

      // cladding - vertical orientation - left side
      if ((i == 0) && (j != frame_size_y - 1) && (cladding_left)) {
        source_idx_a = node_counter;
        target_idx_a = node_counter + 1;
        source_idx_b = node_counter - frame_size_upper_grid;
        target_idx_b = node_counter - frame_size_upper_grid + 1;
        link_length_a = calculate_link_length(gData['nodes'][source_idx_a], gData['nodes'][target_idx_a]) * links_length_reduction[0];
        link_length_b = calculate_link_length(gData['nodes'][source_idx_b], gData['nodes'][target_idx_b]) * links_length_reduction[0];
        cladding_visibility = gene() < cladding_panel_prob ? true : false;
        gData['cladding'].push({'source_a': source_idx_a, 'source_b': source_idx_b, 'target_a': target_idx_a, 'target_b': target_idx_b, 'value_a': link_length_a, 'value_b': link_length_b, 'thickness': cladding_thickness, 'width': cladding_w, 'location': 'left', 'visible': cladding_visibility});
      }

      // cladding - vertical orientation - right side
      if ((i == frame_size_x - 2) && (j != frame_size_y - 1) && (cladding_right)) {
        source_idx_a = node_counter;
        target_idx_a = node_counter + 1;
        source_idx_b = node_counter - frame_size_upper_grid + frame_size_y;
        target_idx_b = node_counter - frame_size_upper_grid + frame_size_y + 1;
        link_length_a = calculate_link_length(gData['nodes'][source_idx_a], gData['nodes'][target_idx_a]) * links_length_reduction[0];
        link_length_b = calculate_link_length(gData['nodes'][source_idx_b], gData['nodes'][target_idx_b]) * links_length_reduction[0];
        cladding_visibility = gene() < cladding_panel_prob ? true : false;
        gData['cladding'].push({'source_a': source_idx_a, 'source_b': source_idx_b, 'target_a': target_idx_a, 'target_b': target_idx_b, 'value_a': link_length_a, 'value_b': link_length_b, 'thickness': cladding_thickness, 'width': cladding_w, 'location': 'right', 'visible': cladding_visibility});
      }

      node_counter ++
    }
  }

  node_counter = 0; // reset the node counter as we will be iterating from the first node to create the cross-links

  // cross-links between rectangular grids
  for (var i = 0; i < frame_size_x; i++) {
    for (var j = 0; j < frame_size_y; j++) {

      source_idx = node_counter;

      // cross-link a
      if (i != frame_size_x - 1) {
        target_idx = node_counter + frame_size_upper_grid;
        link_length = calculate_link_length(gData['nodes'][source_idx], gData['nodes'][target_idx]) * links_length_reduction[2];
        gData['links'].push({'source': source_idx, 'target': target_idx, 'value': link_length, 'thickness': frame_links_thickness[2], 'state': 0, 'visible': frame_links_visibility[2]});
      }

      // cross-link b
      if (i != 0) {
        target_idx = node_counter + frame_size_upper_grid - frame_size_y;
        link_length = calculate_link_length(gData['nodes'][source_idx], gData['nodes'][target_idx]) * links_length_reduction[3];
        gData['links'].push({'source': source_idx, 'target': target_idx, 'value': link_length, 'thickness': frame_links_thickness[3], 'state': 0, 'visible': frame_links_visibility[3]});
      }

      // cross-link c
      if ((i != frame_size_x - 1) && (j != frame_size_y - 1) && !((j % 2 == 0) && alternating_cd_ef)) {
        target_idx = node_counter + frame_size_upper_grid + 1;
        link_length = calculate_link_length(gData['nodes'][source_idx], gData['nodes'][target_idx]) * links_length_reduction[4];
        link_visibility = link_length > cutoff_cdef_links ? false : frame_links_visibility[4];
        gData['links'].push({'source': source_idx, 'target': target_idx, 'value': link_length, 'thickness': frame_links_thickness[4], 'state': 0, 'visible': link_visibility});
        //detail part - at cross-link c in the middle
        var tightener_length = link_length * tightener_length_reduction;
        gData['links'].push({'source': source_idx, 'target': target_idx, 'value': tightener_length, 'thickness': frame_links_thickness[4] * tightener_thickness_f, 'state': 0, 'visible': link_visibility});
      }

      // cross-link d
      if ((i != 0) && (j != frame_size_y - 1) && !((j % 2 == 0) && alternating_cd_ef)) {
        target_idx = node_counter + frame_size_upper_grid - frame_size_y + 1;
        link_length = calculate_link_length(gData['nodes'][source_idx], gData['nodes'][target_idx]) * links_length_reduction[5];
        link_visibility = link_length > cutoff_cdef_links ? false : frame_links_visibility[5];
        gData['links'].push({'source': source_idx, 'target': target_idx, 'value': link_length, 'thickness': frame_links_thickness[5], 'state': 0, 'visible': link_visibility});
        //detail part - at cross-link d in the middle
        var tightener_length = link_length * tightener_length_reduction;
        gData['links'].push({'source': source_idx, 'target': target_idx, 'value': tightener_length, 'thickness': frame_links_thickness[5] * tightener_thickness_f, 'state': 0, 'visible': link_visibility});
      }

      // cross-link e
      if ((j != 0) && (i != frame_size_x - 1) && !((j % 2 == 0) && alternating_cd_ef)) {
        target_idx = node_counter + frame_size_upper_grid - 1;
        link_length = calculate_link_length(gData['nodes'][source_idx], gData['nodes'][target_idx]) * links_length_reduction[6];
        link_visibility = link_length > cutoff_cdef_links ? false : frame_links_visibility[6];
        gData['links'].push({'source': source_idx, 'target': target_idx, 'value': link_length, 'thickness': frame_links_thickness[6], 'state': 0, 'visible': link_visibility});
        //detail part - at cross-link e in the middle
        var tightener_length = link_length * tightener_length_reduction;
        gData['links'].push({'source': source_idx, 'target': target_idx, 'value': tightener_length, 'thickness': frame_links_thickness[6] * tightener_thickness_f, 'state': 0, 'visible': link_visibility});
      }

      // cross-link f
      if ((j != 0) && (i != 0) && !((j % 2 == 0) && alternating_cd_ef)) {
        target_idx = node_counter + frame_size_upper_grid - frame_size_y - 1;
        link_length = calculate_link_length(gData['nodes'][source_idx], gData['nodes'][target_idx]) * links_length_reduction[7];
        link_visibility = link_length > cutoff_cdef_links ? false : frame_links_visibility[7];
        gData['links'].push({'source': source_idx, 'target': target_idx, 'value': link_length, 'thickness': frame_links_thickness[7], 'state': 0, 'visible': link_visibility});
        //detail part - at cross-link f in the middle
        var tightener_length = link_length * tightener_length_reduction;
        gData['links'].push({'source': source_idx, 'target': target_idx, 'value': tightener_length, 'thickness': frame_links_thickness[7] * tightener_thickness_f, 'state': 0, 'visible': link_visibility});
      }


      var pattern_condition;

      // cross-link g_u (upper grid)
      if (alternating_gu_hu_pattern == 1) {pattern_condition = (i < frame_size_x - 1) && (j < frame_size_y - 1) && !((i % 2 == j % 2) && alternating_gu_hu);} // large diagrid (default pattern is dense diagrid)
      if (alternating_gu_hu_pattern == 2) {pattern_condition = (i < frame_size_x - 1) && (j < frame_size_y - 1) && !((i % 2 == 0) && alternating_gu_hu);} // triangles pointing up-down
      if (alternating_gu_hu_pattern == 3) {pattern_condition = (i < frame_size_x - 1) && (j < frame_size_y - 1) && !((i % 2 == 1) && alternating_gu_hu);} // mirrored image of the above pattern
      if (alternating_gu_hu_pattern == 4) {pattern_condition = (i < frame_size_x - 1) && (j < frame_size_y - 1) && !((j % 2 == 0) && alternating_gu_hu);} // triangles pointing left-right
      if (alternating_gu_hu_pattern == 5) {pattern_condition = (i < frame_size_x - 1) && (j < frame_size_y - 1) && !((j % 2 == 1) && alternating_gu_hu);} // mirrored image of the above pattern

      if (pattern_condition){
        target_idx = node_counter + frame_size_y + 1;
        link_length = calculate_link_length(gData['nodes'][source_idx], gData['nodes'][target_idx]);
        link_visibility = link_length > cutoff_gh_links ? false : frame_links_visibility[8];
        gData['links'].push({'source': source_idx, 'target': target_idx, 'value': link_length, 'thickness': frame_links_thickness[8], 'state': 0, 'visible': link_visibility});
        //detail part - at cross-link g_u (upper grid) in the middle
        var tightener_length = link_length * tightener_length_reduction;
        gData['links'].push({'source': source_idx, 'target': target_idx, 'value': tightener_length, 'thickness': frame_links_thickness[8] * tightener_thickness_f, 'state': 0, 'visible': link_visibility});
      }

      // cross-link h_u (upper grid)
      if (alternating_gu_hu_pattern == 1) {pattern_condition = (i < frame_size_x - 1) && !((i % 2 == j % 2) && alternating_gu_hu);} // large diagrid (default pattern is dense diagrid)
      if (alternating_gu_hu_pattern == 2) {pattern_condition = (i < frame_size_x - 1) && !((i % 2 == 1) && alternating_gu_hu);} // triangles pointing up-down
      if (alternating_gu_hu_pattern == 3) {pattern_condition = (i < frame_size_x - 1) && !((i % 2 == 0) && alternating_gu_hu);} // mirrored image of the above pattern
      if (alternating_gu_hu_pattern == 4) {pattern_condition = (i < frame_size_x - 1) && !((j % 2 == 0) && alternating_gu_hu);} // triangles pointing left-right
      if (alternating_gu_hu_pattern == 5) {pattern_condition = (i < frame_size_x - 1) && !((j % 2 == 1) && alternating_gu_hu);} // mirrored image of the above pattern

      if (pattern_condition) {
        target_idx = node_counter + frame_size_y - 1;
        link_length = calculate_link_length(gData['nodes'][source_idx], gData['nodes'][target_idx]);
        link_visibility = link_length > cutoff_gh_links ? false : frame_links_visibility[9];
        gData['links'].push({'source': source_idx, 'target': target_idx, 'value': link_length, 'thickness': frame_links_thickness[9], 'state': 0, 'visible': link_visibility});
        //detail part - at cross-link h_u (upper grid) in the middle
        var tightener_length = link_length * tightener_length_reduction;
        gData['links'].push({'source': source_idx, 'target': target_idx, 'value': tightener_length, 'thickness': frame_links_thickness[9] * tightener_thickness_f, 'state': 0, 'visible': link_visibility});
      }



      // cross-link g_l (lower grid)
      if (alternating_gl_hl_pattern == 1) {pattern_condition = (i < frame_size_x - 2) && (j < frame_size_y - 1) && !((i % 2 == j % 2) && alternating_gl_hl);} // large diagrid (default pattern is dense diagrid)
      if (alternating_gl_hl_pattern == 2) {pattern_condition = (i < frame_size_x - 2) && (j < frame_size_y - 1) && !((i % 2 == 0) && alternating_gl_hl);} // triangles pointing up-down
      if (alternating_gl_hl_pattern == 3) {pattern_condition = (i < frame_size_x - 2) && (j < frame_size_y - 1) && !((i % 2 == 1) && alternating_gl_hl);} // mirrored image of the above pattern
      if (alternating_gl_hl_pattern == 4) {pattern_condition = (i < frame_size_x - 2) && (j < frame_size_y - 1) && !((j % 2 == 0) && alternating_gl_hl);} // triangles pointing left-right
      if (alternating_gl_hl_pattern == 5) {pattern_condition = (i < frame_size_x - 2) && (j < frame_size_y - 1) && !((j % 2 == 1) && alternating_gl_hl);} // mirrored image of the above pattern

      if (pattern_condition){
        source_idx = node_counter + frame_size_upper_grid;
        target_idx = node_counter + frame_size_upper_grid + frame_size_y + 1;
        link_length = calculate_link_length(gData['nodes'][source_idx], gData['nodes'][target_idx]);
        link_visibility = link_length > cutoff_gh_links ? false : frame_links_visibility[10];
        gData['links'].push({'source': source_idx, 'target': target_idx, 'value': link_length, 'thickness': frame_links_thickness[10], 'state': 0, 'visible': link_visibility});
        //detail part - at cross-link g_l (lower grid) in the middle
        var tightener_length = link_length * tightener_length_reduction;
        gData['links'].push({'source': source_idx, 'target': target_idx, 'value': tightener_length, 'thickness': frame_links_thickness[10] * tightener_thickness_f, 'state': 0, 'visible': link_visibility});
      }

      // cross-link h_l (lower grid)
      if (alternating_gl_hl_pattern == 1) {pattern_condition = (i < frame_size_x - 2) && !((i % 2 == j % 2) && alternating_gl_hl);} // large diagrid (default pattern is dense diagrid)
      if (alternating_gl_hl_pattern == 2) {pattern_condition = (i < frame_size_x - 2) && !((i % 2 == 1) && alternating_gl_hl);} // triangles pointing up-down
      if (alternating_gl_hl_pattern == 3) {pattern_condition = (i < frame_size_x - 2) && !((i % 2 == 0) && alternating_gl_hl);} // mirrored image of the above pattern
      if (alternating_gl_hl_pattern == 4) {pattern_condition = (i < frame_size_x - 2) && !((j % 2 == 0) && alternating_gl_hl);} // triangles pointing left-right
      if (alternating_gl_hl_pattern == 5) {pattern_condition = (i < frame_size_x - 2) && !((j % 2 == 1) && alternating_gl_hl);} // mirrored image of the above pattern

      if (pattern_condition) {
        source_idx = node_counter + frame_size_upper_grid;
        target_idx = node_counter + frame_size_upper_grid + frame_size_y - 1;
        link_length = calculate_link_length(gData['nodes'][source_idx], gData['nodes'][target_idx]);
        link_visibility = link_length > cutoff_gh_links ? false : frame_links_visibility[11];
        gData['links'].push({'source': source_idx, 'target': target_idx, 'value': link_length, 'thickness': frame_links_thickness[11], 'state': 0, 'visible': link_visibility});
        //detail part - at cross-link h_l (lower grid) in the middle
        var tightener_length = link_length * tightener_length_reduction;
        gData['links'].push({'source': source_idx, 'target': target_idx, 'value': tightener_length, 'thickness': frame_links_thickness[11] * tightener_thickness_f, 'state': 0, 'visible': link_visibility});
      }


      node_counter ++
    }
  }

  return gData;
}