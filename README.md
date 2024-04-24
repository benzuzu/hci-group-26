# Introduction

Tired of wasted time between classes? 
Sick of feeling groggy in an afternoon lecture? 
Need a quick break?

Welcome to Frame Frenzy!

This game is a fun, collaborative challenge designed for [CPSC 484/584 Introduction to HCI](https://cpsc484-584-hci.gitlab.io/s23/project).

Specifically, the game itself is implemented with aspects of [p5.js](https://p5js.org/) and the spacial data is obtained via a WebSocket.

Technical details for the interactive systems are available on the [HCI course website](https://cpsc484-584-hci.gitlab.io/s23/display_tutorial).

## How to Run

No extra dependency installation is needed! We are only running static js. Simply open the path to the index.html file in your browser and play (make sure the js and css files are in the same directory, but this should be the default).

## Problem Space and Solutions

At Yale, classes are usually around 15 minutes apart from each other. During these times, often referred to as “passing periods”, students often feel bored in lecture halls or seminar rooms waiting for class to begin. There's usually an awkward amount of downtime that feels as if it goes to waste, but not enough to do work or other important activities. This can cause boredom, or worse, sleepiness, before a lecture, and will significantly degrade the quality of learning for students once we aggregate this impact over multiple lectures in a single day. Students need to be in the right mindset going into 50-75 minute lectures, and current pre-class activities don’t seem to be achieving this.

Our goal is to make thse intermediate times a little bit better and prepare students to be focused and productive in class. Frame Frenzy is designed to do precisely this. The game is similar to Twister or Hole in the Wall, where contestants have to hold positions for a certain amount of time to make it to the next stage. We focus on accomplisihing 2 tasks.

Task 1: Physical Movements

The game will require maintaining tough positions and strong balance. Definitely exercises core/abdominal muscles and movement in general. Engaging in some sort of physical activity is shown to improve focus and attention span afterward. This will help them be more engaged and ready for class.

Task 2: Smile and Laugh

The game will force many funny moments, epic fails, and ecstatic victories. It's impossible to play without laughing! Since the main game itself gets its participants to move about and contort their bodies together in funny ways, it is highly likely that this feature will create funny moments that make users laugh. Also, any sort of game that you can play with friends is an opportunity to socialize and chat. These sorts of engaging activities are guaranteed to help students feel more energized and less lethargic for an hour-long lecture.

## System Overview

Three files in this repository define the project's structure:

+ `index.html`: defines the elements of the webpage (excluding the dynamic game elements, which are defined in `sketch.js`).
+ `style.css`: defines the style properties of the elements of the webpage.
+ `sketch.js`: defines the game interaction and websocket connection.

Most of the components that actually implement the game are defined in `sketch.js`.
At a high level, the components defined therein open a websocket to one of the HCI displays, process body tracking data from the Kinect sensor to obtain a command, send that command to the game, and update the game objects screen displays.

## Environment Constraints

This game was designed to be played in a relatively spacious place, where 1-4 people can move around freely to complete the levels. This game may be difficult to play in small spaces or with too many people. 

The game also REQUIRES the Kinect Sensor, and it must be angled toward the participants. Other than that, however, there are no additional constraints.

## Collaboration Record

Esmie Hurd (esh53)

Met up to begin making changes to initial prototype, created README document to include information about the game in general, the problem space our group means to address, and the tasks we have implemented as a solution, helped test each version of the prototype. Helped style the frontend code (css + html).

Ben Xu (bwx2)

Met up to begin making changes to initial prototype, worked to expand game to faciliate multiple levels, improved game performance and transitions between webpages, helped test each version of the prototype. Wrote the backend code (JS + HTML). 

Claire Qu (cxq2)

Met up to begin making changes to initial prototype, worked on front end design, helped test each version of the prototype. Stress tested the final product.

Felix Qin (cq63)

Met up to continue adding changes to incorporate multiple levels and improved game performance, helped edit README and front end design. Stress tested the final product.

