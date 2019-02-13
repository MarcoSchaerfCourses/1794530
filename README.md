# final-project-for-interactive-graphics-course-1794530
final-project-for-interactive-graphics-course-1794530 created by GitHub Classroom
Animation and mouse control is enabled by default.
Controls are:


Keyboard:
----
A: Move camera left
D: Move camera right
W: Move camera up
S: Move camera down
E: Move forward
Q: Move Backward
Space bar: stop moving

----
R: Start/stop animation
M: Enable/disable mouse

Mouse: 
----
It changes the lookAt of the camera (doesn't affect the movement, it only looks on that direction)

Description:
-----
The surroundings are a representation of the solar system.
- Planets are created using hierarchies
- Each planet has its own texture
- The galaxy is another sphere.
- There is rotation and translation for all planets
- The moon rotations/translates around the Earth
- There is a lighting source placed at the Sun, as well as ambient light.
- Environment can be controlled using keyboard and mouse
- It is possible to select a planet to place the camera behind and follow it around the sun.
2 buffers are used, one for the solar system, another one for the spaceship. The spaceship details are:
- Comprises of 3 part: the body (parent) and the 2 wings (childs)
- The shape of the ship is a single trapezoid used for the 3 parts. The wings are scaled wider and shorter
- The body and wings rotate differently when moving forward/backward/sideway.
- It is fixed on a position in front of the camera
