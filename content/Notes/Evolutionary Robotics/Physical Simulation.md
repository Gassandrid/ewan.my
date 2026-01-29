---
class:
  - note
  - lecture
tags:
  - university
  - cs/robotics
  - cs/ai/evolution
course: "[[Evolutionary Robotics]]"
lecture-number: 6
source:
related:
author:
description:
aliases:
date: 2026-01-29T08:32:41-05:00
updated: 2026-01-29T09:08:06-05:00
---

As computer moved from a government/corporate tool to a personal tool, there was a shift from batch processing to interactive computing. One of the fronts this was seen on is the onset of **computer graphics**. Early computer graphics were limited to simple line drawings, but as hardware improved, more complex graphics became possible.

## Physical Simulation Vs Computer Graphics

Both worked together, but had different loops:

### Computer Graphics

1. Define Position, orientation, and shape of each object at time $t$.
2. Render
3. Define the position, orientation, and shape of each object at time $t+1$

While a big loop, this was still mostly dictated by humans, "feeling out" how to move the objects in a scene from time step to time step.

With the arrival of **Math Engine** in 2000, artificial physics engines started to be used to simulate the physical world. This allowed for more realistic simulations, as the physics engine could handle the complex calculations needed to simulate real-world physics.

### Physical Simulation

1. Define the position, oreintation, shape, mass and friction properties of each object.
2. Define how objects are attached together
3. Start the simulation

$$
  Force = mass \cdot acceleration (F = ma) \to acceleration = \frac{F}{m}
$$

> [!Example] Basic Physics Simulation
>
> Say you have a ball of mass 2kg defined to be a set few meters above the ground. The physics engine will apply a gravitational force roughly equal to $9.8 m/s^2$ downwards on the ball. The acceleration of the ball will be:
>
> $$
>  acceleration = \frac{F}{m} = \frac{9.8 \, m/s^2 \cdot 2 \, kg}{2 \, kg} = 9.8 \, m/s^2
> $$

---

## Physics Engines

While we wont be using `ODE` in this class, its important to understand the basic components of a physics engine.

```cpp
dInitODE2(0); // initialize ODE

world = dWorldCreate(); // this holds all the physical objects and simulates their interactions

space = dHashSpaceCreate (0); // manages the spatial organization of objects for collision detection

contactgroup = dJointGroupCreate (0); // holds the contact joints generated during collision detection

dWorldSetGravity (world,0,0,-GRAVITY); // set gravity in the world

dWorldSetCFM (world,1e-5); // set the constraint force mixing parameter for stability
```

This piece of code initializes the ODE physics engine, creates a world to hold physical objects, sets up a space for collision detection, and configures gravity and stability parameters.

### Bodies

Bodies in `ODE` are the fundamental physical objects that can move and interact within the simulation. Each body has properties such as mass, position, velocity, and orientation.

We create a body and set its mass and position like so:

```cpp
dBodyID body = dBodyCreate(world); // create a new body in the world

dMass mass;
dMassSetBox(&mass,1,1,1,1); // set mass properties for a box of size 1x1x1 with density 1
dMassAdjust(&mass,0.2f); // adjust mass to have a total mass of 0.2

dBodySetMass(body,&mass); // assign the mass properties to the body
dBodySetPosition(body,0,6,0); // set the initial position of the body to (0,6,0)
```

What this does is create a body in the world, define its mass as a box with dimensions 1x1x1 and density 0.2, and set its initial position to (0,6,0).

Bodies in this case will always be rectangular prisms, but you can define other shapes as well.

#### Orientation for Bodies

We use [[Quaternions]] here, I love them and am used to them but for others in this class we will assume layman understanding of them. Main thing is that you can avoid the **Gimbal Lock** problem that comes with Euler Angles.

Without going too deep into them, we can always assume that specifying orientation in 3d will usually require 4 numbers (x, y, z, w). First 3 specify the axis of rotation, and the last specifies the amount of rotation. Encoded as a quaternion:

$$
  q = \cos(\frac{\theta}{2}) + (x \hat{i} + y \hat{j} + z \hat{k}) \sin(\frac{\theta}{2})
$$

If the object is a cylinder, we can specify its rotation with 3 angles:

```cpp
dMatrix3 R;
dRFromZAxis(R,x1,y1,z1);
dBodySetRotation(body,R);
```

### Joints - how Bodies Move Relative to Each other

Joints define how bodies are connected and how they can move relative to each other. There are several types of joints in ODE, including hinge joints, slider joints, and ball-and-socket joints.

```cpp
dJointID hinge; // create a hinge joint

hinge = dJointCreateHinge (world,0); // create a hinge joint in the world

dJointAttach (hinge,body[0],body[1]); // attach the hinge joint to two bodies

dJointSetHingeAnchor (hinge,0,0,1); // set the anchor point of the hinge joint at (0,0,1)

dJointSetHingeAxis (hinge,x1,y1,z1); // set the axis of rotation for the hinge joint
```

These have to be defined before the simulation starts, and define how the bodies can move relative to each other.

#### Important Part - Be aware of DEgrees of Freedom

Possibly the most important part of joints is understanding how many degrees of freedom (DOF) a joint has. This defines how many independent movements the joint allows.

More degrees of freedom means more complex movement, but also more complexity in the simulation. We usually are looking to minimize the degrees of freedom to make the simulation more stable and efficient.

> [!Example] Insects
> Insects like ants have a LOT of legs and joints. However, each joint only has a few degrees of freedom. This allows them to move efficiently without overcomplicating the simulation.
>
> Think about their "elbows" and "knees" - they mostly just bend in one direction, which simplifies the joint mechanics.

### Geoms - how Bodies Collide

**Geoms** define the shape of bodies for collision detection. They are used to determine when and how bodies collide with each other in the simulation.

We distinguish beetween the **inertial** properties of a body (mass, position, velocity) and the **geometric** properties (shape, size) used for collision detection.

Below creates a box geom and associates it with a body:

```cpp
dGeomID geom = dCreateBox(space,1,1,1)
dGeomSetBody(geom,body);
```

To keep pairs from colliding:

1. Compute the distance between each geom pair.
2. If $distance \leq 0$, push the bodies apart proportionally to the penetration depth.

> [!Question] Why is collision detection so computationally expensive?
> It involves checking every pair of objects in the simulation to see if they are colliding, which can be a lot of calculations, especially as the number of objects increases. Efficient algorithms and data structures are needed to manage this complexity.
