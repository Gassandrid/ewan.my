---
title: Hofstadter Butterfly
class:
  - curation
media-type: png
image: "[[hofstadter_butterfly.png]]"
source:
  - numpy
  - matplotlib
related:
  - "[[Douglas Hofstadter]]"
  - "[[Gödel, Escher, Bach]]"
author:
description:
tags:
  - books/geb
  - curation/render
aliases:
date: 2026-01-18T09:14:09-05:00
updated: 2026-03-12T16:15:13-07:00
---

A piece of my own creation, wanted to encode more parameters into the Hofstadter Butterfly to enrich the color.

![[hofstadter_butterfly.png]]

---

## Earlier Rendition in Shadertoy

![[hofButterFlyEwan.png]]

**Shadertoy** Code:

```cpp
#define PI 3.14159265359

// Parameters
const int   AA_SAMPLES = 2;
const float ITERATIONS = 300.0;
const float HARMONIC   = 0.6;     
const float LIQUID     = 0.015;   
const float VIVIDNESS  = 1.2;     

const float ZOOM       = 0.75; 
const vec2  OFFSET     = vec2(0.0, 0.0);
const float CHROMATIC  = 0.0025;

vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

vec3 getData(vec2 p) {
    p += vec2(sin(p.y * 10.0), cos(p.x * 15.0)) * LIQUID;

    float alpha = (p.x / ZOOM) + 0.5; 
    float energy = (p.y - 0.5) * 8.0 / ZOOM;
    
    vec2 state = vec2(1.0, 0.0);
    float lyapunov = 0.0;
    float totalPhase = 0.0;
    
    for(int n = 1; n <= int(ITERATIONS); n++) {
        float theta = 2.0 * PI * alpha * float(n);
        
        float potential = 2.0 * cos(theta) + HARMONIC * cos(3.0 * theta);
        
        float next_g = (energy - potential) * state.x - state.y;
        state = vec2(next_g, state.x);
        
        float mag = length(state);
        if(mag > 1e-10) {
            state /= mag;
            lyapunov += log(mag);
        }
        
        totalPhase += atan(state.y, state.x);
    }
    lyapunov /= ITERATIONS;
    totalPhase /= ITERATIONS;
    
    float stability = exp(-2.5 * abs(lyapunov));
    stability = smoothstep(0.0, 0.95, stability);
    
    return vec3(stability, totalPhase, 0.0);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec3 totalColor = vec3(0.0);
    
    for( int m=0; m<AA_SAMPLES; m++ )
    for( int n=0; n<AA_SAMPLES; n++ )
    {
        vec2 o = vec2(float(m),float(n)) / float(AA_SAMPLES) - 0.5;
        vec2 uv = (fragCoord + o) / iResolution.xy;
        uv.x *= iResolution.x / iResolution.y;
        uv.x -= (iResolution.x / iResolution.y) * 0.5;
        uv += OFFSET;

        vec3 dataR = getData(uv - vec2(CHROMATIC, 0.0));
        vec3 dataG = getData(uv);
        vec3 dataB = getData(uv + vec2(CHROMATIC, 0.0));

        float index = (uv.x * 0.2) + (dataG.y * VIVIDNESS) + (dataG.x * 0.3);
        
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.0, 0.10, 0.20); 

        vec3 baseCol = palette(index, a, b, c, d);
        
        vec3 finalCol;
        finalCol.r = baseCol.r * dataR.x;
        finalCol.g = baseCol.g * dataG.x;
        finalCol.b = baseCol.b * dataB.x;
        
        finalCol += vec3(0.8) * pow(dataG.x, 8.0);

        totalColor += finalCol;
    }

    totalColor /= float(AA_SAMPLES * AA_SAMPLES);
    
    totalColor = smoothstep(0.0, 1.1, totalColor); 
    totalColor = pow(totalColor, vec3(0.9)); // Gamma correction

    vec2 q = fragCoord.xy / iResolution.xy;
    totalColor *= 0.5 + 0.5*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.25 );
    fragColor = vec4(totalColor, 1.0);
}
```
