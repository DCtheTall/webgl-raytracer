![Raytracer screenshot](http://dcthetall-webgl-raytracer.herokuapp.com/demo-picture.png)

# WebGL Raytracer
Author: Dylan Cutler

---

This project is an interactive WebGL raytracer written
in TypeScript and modular GLSL compiled to a single
bundle program (`public/bundle.js`) with Webpack.


[Live Demo*](http://dcthetall-webgl-raytracer.herokuapp.com)

*The live demo is operational, however I recommend you use a VR capable GPU for the best experience

---

Features include:
- Can render multiple spheres and rectangular prisms
- Rectangular prisms can have arbitrary rotation
- Blinn-Phong illumination on surfaces
- Shadow casting
- Reflective surfaces
- Sphere materials refract light using matrix ray
  tracing
- Parametric texture mapping on spheres
- Orbit controls
- A mouse caster which highlights shapes when you
  hover over them
- Ability to toggle UI features
