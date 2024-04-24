// Adapted from https://p5js.org/examples/interaction-snake-game.html
//
var host = "cpsc484-03.stdusr.yale.internal:8888";
// var host = "localhost:4444";
$(document).ready(function() {
  frames.start();
  twod.start();
});

var current_page = 'home';
var level = 1;

var frames = {
  socket: null,

  start: function() {
    var url = "ws://" + host + "/frames";
    frames.socket = new WebSocket(url);
    frames.socket.onmessage = function (event) {
      if (current_page == 'home') {
        var left_wrist_raised = frames.is_left_wrist_raised(JSON.parse(event.data));
        var right_wrist_raised = frames.is_right_wrist_raised(JSON.parse(event.data));
        if (left_wrist_raised) {
          // console.log("person " + left_wrist_raised + " left wrist raised!");
          document.querySelector('#kinect-window').style.display = 'none';
          document.querySelector('#instructions').style.display = 'flex';
          current_page = 'instructions';
        }
        var right_wrist_raised = frames.is_right_wrist_raised(JSON.parse(event.data));
        if (right_wrist_raised) {
          // console.log("person " + right_wrist_raised + " right wrist raised!");
          document.querySelector('#level1').style.display = 'flex';
          document.querySelector('#kinect-window').style.display = 'none';
          document.querySelector('h1').textContent = 'Cover part of the square with your body!';
          var buttons = document.querySelectorAll('.button');
          buttons.forEach(function(button) {
            button.setAttribute('hidden', '');
          });
          current_page = 'game';
          level = 1;
          var box = document.querySelector('#box1');          
          box.style.left = '500px';
          box.style.top = '200px';

          let display = document.getElementById('timerl1');
          frames.start_timer(10, display);
        }
      } else if (current_page == 'instructions') {
        var right_wrist_raised = frames.is_right_wrist_raised(JSON.parse(event.data));
        if (right_wrist_raised) {
          // console.log("person " + right_wrist_raised + " right wrist raised!");
          document.querySelector('#instructions').style.display = 'none';
          document.querySelector('#kinect-window').style.display = 'flex';
          current_page = 'home';
        }
      } else if (current_page == 'game') {
        const timerid = 'timerl' + level;
        if (document.getElementById(timerid).textContent == "Time's up!") {
          var bodies = frames.get_all_points(JSON.parse(event.data));
          var twod = document.querySelector('#l1twod');
          if (level == 3) {
            twod = document.querySelector('#l3twod');
          } else if (level == 5) {
            twod = document.querySelector('#l5twod');
          }
          const canvas = twod.getBoundingClientRect();
          var found = new Array(level).fill(false);
          if (bodies) {
            switch (level) {
              case 1: {
                console.log(canvas.left + 730);
                for (const point of bodies) {
                  if (
                    (point[0] > canvas.left + 730) && 
                    (point[0] < canvas.left + 930) &&
                    (point[1] > 180) &&
                    (point[1] < 400)
                  ) {
                    found[0] = true;
                  }
                }
                break;
              }
              case 3: {
                console.log(canvas.left + 730);
                console.log(canvas.left + 430);
                console.log(canvas.left + 230);
                for (const point of bodies) {
                  if (
                    (point[0] > canvas.left + 730) && 
                    (point[0] < canvas.left + 930) &&
                    (point[1] > 180) &&
                    (point[1] < 400)
                  ) {
                    found[0] = true;
                  }
                  if (
                    (point[0] > canvas.left + 430) && 
                    (point[0] < canvas.left + 630) &&
                    (point[1] > 280) &&
                    (point[1] < 500)
                  ) {
                    found[1] = true;
                  }
                  if (
                    (point[0] > canvas.left + 230) && 
                    (point[0] < canvas.left + 430) &&
                    (point[1] > 580) &&
                    (point[1] < 800)
                  ) {
                    found[2] = true;
                  }
                }
                break;
              }
              case 5: {
                for (const point of bodies) {
                  if (
                    (point[0] > canvas.left + 730) && 
                    (point[0] < canvas.left + 930) &&
                    (point[1] > 180) &&
                    (point[1] < 400)
                  ) {
                    found[0] = true;
                  }
                  if (
                    (point[0] > canvas.left + 430) && 
                    (point[0] < canvas.left + 630) &&
                    (point[1] > 280) &&
                    (point[1] < 500)
                  ) {
                    found[1] = true;
                  }
                  if (
                    (point[0] > canvas.left + 230) && 
                    (point[0] < canvas.left + 430) &&
                    (point[1] > 580) &&
                    (point[1] < 800)
                  ) {
                    found[2] = true;
                  }
                  if (
                    (point[0] > canvas.left + 30) && 
                    (point[0] < canvas.left + 280) &&
                    (point[1] > 0) &&
                    (point[1] < 200)
                  ) {
                    found[2] = true;
                  }
                  if (
                    (point[0] > canvas.left + 430) && 
                    (point[0] < canvas.left + 630) &&
                    (point[1] > 580) &&
                    (point[1] < 800)
                  ) {
                    found[2] = true;
                  }
                }
                break;
              }
            }
          }

          // console.log(found, level);
          if (found.includes(false)) {
            console.log(found);
            const l = '#level' + level;
            document.querySelector(l).style.display = 'none';
            document.querySelector('#failure').style.display = 'flex';
            document.querySelector('h1').textContent = 'Nooo :(';
            // console.log(JSON.parse(event.data));
            console.log(bodies);
            current_page = 'failure';
            let display = document.getElementById('timer2');
            frames.start_timer(5, display);
          } else {
            if (level == 5) {
              document.querySelector('#level5').style.display = 'none';
              document.querySelector('#win').style.display = 'flex';
              document.querySelector('h1').textContent = 'Yay!';
            } else if (level == 3) {
              document.querySelector('#level3').style.display = 'none';
              document.querySelector('#success').style.display = 'flex';
              document.querySelector('h1').textContent = 'Well Done!';
            } else {
              document.querySelector('#level1').style.display = 'none';
              document.querySelector('#success').style.display = 'flex';
              document.querySelector('h1').textContent = 'Nice!';
            }

            current_page = 'success';
            let display = document.getElementById('timer1');
            frames.start_timer(5, display);
          } 
        }
      } else if (current_page == 'success') {
        if (document.querySelector('#timer1').textContent == "Time's up!") {
          if (level == 1) {
            var box1 = document.querySelector('#box31');          
            box1.style.left = '500px';
            box1.style.top = '200px';

            var box2 = document.querySelector('#box32');          
            box2.style.left = '800px';
            box2.style.top = '300px';

            var box3 = document.querySelector('#box33');          
            box3.style.left = '1000px';
            box3.style.top = '600px';
          } else if (level == 3) {
            var box1 = document.querySelector('#box51');          
            box1.style.left = '500px';
            box1.style.top = '200px';

            var box2 = document.querySelector('#box52');          
            box2.style.left = '800px';
            box2.style.top = '300px';

            var box3 = document.querySelector('#box53');          
            box3.style.left = '1000px';
            box3.style.top = '600px';

            var box4 = document.querySelector('#box54');          
            box4.style.left = '1200px';
            box4.style.top = '0px';

            var box5 = document.querySelector('#box55');          
            box5.style.left = '500px';
            box5.style.top = '600px';
          }
          level += 2;
          const l = '#level' + level;
          const t = 'timerl' + level;
          let display = document.getElementById(t);
          frames.start_timer(10, display);
          document.querySelector(l).style.display = 'flex';
          document.querySelector('#success').style.display = 'none';
          document.querySelector('h1').textContent = 'Cover part of the square with your body!';
          current_page = 'game';
        }
      } else if (current_page == 'failure') {
        if (document.querySelector('#timer2').textContent == "Time's up!") {
          level = 1;
          document.querySelector('#kinect-window').style.display = 'flex';
          document.querySelector('#failure').style.display = 'none';
          document.querySelector('h1').textContent = "Let's Play Frame Frenzy!";
          current_page = 'home';
          var buttons = document.querySelectorAll('.button');
          buttons.forEach(function(button) {
            button.removeAttribute('hidden');
          });
          // location.reload();
        }
      }
    }
  },

  is_right_wrist_raised: function (frame) {
    if (frame.people.length < 1) {
      return false;
    }

    // Normalize by subtracting the root (pelvis) joint coordinates
    for (var i = 0; i < frame.people.length; i++) {
      var pelvis_y = frame.people[i].joints[0].position.y;
      var pelvis_z = frame.people[i].joints[0].position.z;
      var pelvis_x = frame.people[i].joints[0].position.x;
      var right_wrist_y = (frame.people[i].joints[14].position.y - pelvis_y) * -1;
      var right_wrist_z = (frame.people[i].joints[14].position.z - pelvis_z) * -1;
      var right_wrist_x = (frame.people[i].joints[14].position.x - pelvis_x) * -1;
      // console.log("PERSON " + i, right_wrist_x, right_wrist_y, right_wrist_z);

      if (right_wrist_z < 100) {
        continue;
      }

      if (right_wrist_x < 300 && right_wrist_x > -50) {
        if (right_wrist_y > 500) {
          return i + 1;
        }
      }
    }
    return false;
  },

  is_left_wrist_raised: function (frame) {
    if (frame.people.length < 1) {
      return false;
    }

    // Normalize by subtracting the root (pelvis) joint coordinates
    for (var i = 0; i < frame.people.length; i++) {
      var pelvis_y = frame.people[i].joints[0].position.y;
      var pelvis_z = frame.people[i].joints[0].position.z;
      var pelvis_x = frame.people[i].joints[0].position.x;
      var left_wrist_y = (frame.people[i].joints[7].position.y - pelvis_y) * -1;
      var left_wrist_z = (frame.people[i].joints[7].position.z - pelvis_z) * -1;
      var left_wrist_x = (frame.people[i].joints[7].position.x - pelvis_x) * -1;
      // console.log("PERSON " + i, left_wrist_x, left_wrist_y, left_wrist_z);

      if (left_wrist_z < 100) {
        continue;
      }


      if (left_wrist_x < 50 && left_wrist_x > -300) {
        if (left_wrist_y > 500) {
          return i + 1;
        }
      }
    }
    return false;
  },

  start_timer: function (duration, display) {
      let timer = duration;
      let intervalId = setInterval(function () {
          display.textContent = timer;
          console.log("tick");

          if (--timer <= 0) {
              clearInterval(intervalId);
              display.textContent = "Time's up!";
          }
      }, 1000);
  },

  get_all_points: function (frame) {
    if (frame.people.length < 1) {
      return false;
    }

    var points = [[]];

    for (var i = 0; i < frame.people.length; i++) {
      for (var j = 0; j < 32; j++) {
        points.push([frame.people[i].joints[j].pixel.x, frame.people[i].joints[j].pixel.y]);
      }
    }

    return points;
  }

};

var twod = {
  socket: null,

  start: function() {
    var url = "ws://" + host + "/twod";
    twod.socket = new WebSocket(url);
    twod.socket.onmessage = function(event) {
      twod.show(JSON.parse(event.data));
    }
  },

  show: function(twod) {
    $('.twod').attr("src", 'data:image/pnjpegg;base64,'+twod.src);
  }
};
