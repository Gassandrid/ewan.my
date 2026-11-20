---
class:
  - note
tags:
  - engineering/sensors
source:
related:
author:
description:
aliases:
  - IMU
  - IMUs
date: 2026-09-03T16:53:07-04:00
updated: 2026-09-03T17:35:57-04:00
---

Collection of a few sensors, namely:

- accelerometer
	- for movement in space, measures change in speed/directional movement
- gyroscope
	- rotational / angular velocity
- magnetometer
	- not that useful here, mostly used for orientation

[![Screenshot 2026-09-03 at 5.12.40 PM.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/8ae20322f18fd74252215445893df5704c4bdb36828fde915abcf5a42ccc21de/Screenshot%202026-09-03%20at%205.12.40%20PM.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/8ae20322f18fd74252215445893df5704c4bdb36828fde915abcf5a42ccc21de/Screenshot%202026-09-03%20at%205.12.40%20PM.png)

## Operating Principles

### Accelerometer

- **Measures**: linear acceleration 
- **Units** $g's = 9.81 \frac{m}{s^2}$ 
- **Sensing Modality**: capacitive 
- **Mechanics** "proof mass" with capacitive "fingers". Acceleration alters capacitance $\to$ voltage 

$$
m\ddot{x} + b\dot{x} + kx = F_{ext}
$$

For low oscillation frequencies (< 1kHz):

$$
V_{meas} \approx V_{in} \cdot \frac{x}{d}
$$

[![Screenshot 2026-09-03 at 5.15.24 PM.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/a96ba3e4ccc9a4658bd6b76fb8efc0ba897e426a49b3be9926ca05d2ebf8af8b/Screenshot%202026-09-03%20at%205.15.24%20PM.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/a96ba3e4ccc9a4658bd6b76fb8efc0ba897e426a49b3be9926ca05d2ebf8af8b/Screenshot%202026-09-03%20at%205.15.24%20PM.png)

### Gyroscope

- **Measure:** angular velocity
- **Units:** deg/s or rad/s 
- **Sensing modality**: capacitive ( same as accelerometer ) 
- **Mechanics:** "proof mass" oscillates continuously; Coriolis force induces amplitude along radial dimension.

$$
m\ddot{x} + b\dot{x} + kx = F_{ext} \propto \frac{mv^2}{r}
$$

[![Screenshot 2026-09-03 at 5.18.00 PM.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/a121c02e34a01ed5078dc6e3dcb61b4f1f1fd488f9d8bf57770e9fb7d02b4e70/Screenshot%202026-09-03%20at%205.18.00%20PM.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/a121c02e34a01ed5078dc6e3dcb61b4f1f1fd488f9d8bf57770e9fb7d02b4e70/Screenshot%202026-09-03%20at%205.18.00%20PM.png)

### Magnetometer

- **Measures**: magnetic fields ( heading )
- **Units:** Teslas ( $\mu T$ )
- **Sensing Modality**: Hall effect
- **Mechanics**: voltage difference induced by magnetic field perpendicular to lfow electrical current

$$
V_{Hall} = R_{Hall} \frac{IB}{t}
$$

[![Screenshot 2026-09-03 at 5.21.09 PM.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/786cde6cba28a6e959b6c02713f5de8ba8582be2c1c6a47c418e003102c84592/Screenshot%202026-09-03%20at%205.21.09%20PM.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/786cde6cba28a6e959b6c02713f5de8ba8582be2c1c6a47c418e003102c84592/Screenshot%202026-09-03%20at%205.21.09%20PM.png)

## Selecting IMU Operating Parameters

**Range**  

- Determines max/min detectable signal.  

**Resolution**  

- Varies with range (units =  
counts/degree; counts/g)  
- Magnetometer: Heading accuracy  

**Sampling rate**  

- [[Nyquist-Shannon Sampling Theorem]]:  
To avoid losing information, must  
sample at 2x desired max frequency
