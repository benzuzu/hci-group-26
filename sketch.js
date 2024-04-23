// Adapted from https://p5js.org/examples/interaction-snake-game.html
//
// var host = "cpsc484-03.stdusr.yale.internal:8888";
var host = "localhost:4444";
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
      frames.get_pelvis_position(JSON.parse(event.data));
      if (current_page == 'home') {
        var left_wrist_raised = frames.is_left_wrist_raised(JSON.parse(event.data));
        var right_wrist_raised = frames.is_right_wrist_raised(JSON.parse(event.data));
        if (left_wrist_raised) {
          console.log("person " + left_wrist_raised + " left wrist raised!");
          document.querySelector('#kinect-window').style.display = 'none';
          document.querySelector('#instructions').style.display = 'flex';
          current_page = 'instructions';
        }
        var right_wrist_raised = frames.is_right_wrist_raised(JSON.parse(event.data));
        if (right_wrist_raised) {
          console.log("person " + right_wrist_raised + " right wrist raised!");
          document.querySelector('#game').style.display = 'flex';
          document.querySelector('#kinect-window').style.display = 'none';
          document.querySelector('h1').textContent = 'Cover part of the square with your body!';
          var buttons = document.querySelectorAll('.button');
          buttons.forEach(function(button) {
            button.setAttribute('hidden', '');
          });
          current_page = 'game';
          var box = document.querySelector('#box');          
          box.style.left = '500px';
          box.style.top = '200px';

          let display = document.getElementById('timer');
          frames.start_timer(10, display);
        }
      } else if (current_page == 'instructions') {
        var right_wrist_raised = frames.is_right_wrist_raised(JSON.parse(event.data));
        if (right_wrist_raised) {
          console.log("person " + right_wrist_raised + " right wrist raised!");
          document.querySelector('#instructions').style.display = 'none';
          document.querySelector('#kinect-window').style.display = 'none';
          current_page = 'home';
        }
      } else if (current_page == 'game') {
        if (document.querySelector('#timer').textContent == "Time's up!") {
          var bodies = frames.get_all_points(JSON.parse(event.data));
          switch (level) {
            case 1:
          }

          document.querySelector('#game').style.display = 'none';
          document.querySelector('#kinect-window').style.display = 'none';
          console.log(JSON.parse(event.data));
          console.log(bodies);
          current_page = 'home';
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

  get_pelvis_position: function (frame) {
    if (frame.people.length < 1) {
      return false;
    }

    var pelvis_y = frame.people[1].joints[0].position.y;
    var pelvis_z = frame.people[1].joints[0].position.z;
    var pelvis_x = frame.people[1].joints[0].position.x;

    // console.log(pelvis_x, pelvis_y, pelvis_z);
    return true;
  },

  start_timer: function (duration, display) {
      let timer = duration;
      let intervalId = setInterval(function () {
          display.textContent = timer;
          console.log("tick");

          if (--timer < 0) {
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
