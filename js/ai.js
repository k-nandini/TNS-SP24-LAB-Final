async function setupCamera() {
  const video = document.getElementById("video");
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
  keypoints.forEach((keypoint) => {
    if (keypoint.score > minConfidence) {
      const { y, x } = keypoint.position;
      ctx.beginPath();
      ctx.arc(x * scale, y * scale, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "aqua";
      ctx.fill();
      ctx.fillText(keypoint.part, x * scale, y * scale);
    }
  });
}

function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
  const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
    keypoints,
    minConfidence
  );

  adjacentKeyPoints.forEach((keypoints) => {
    ctx.beginPath();
    ctx.moveTo(
      keypoints[0].position.x * scale,
      keypoints[0].position.y * scale
    );
    ctx.lineTo(
      keypoints[1].position.x * scale,
      keypoints[1].position.y * scale
    );
    ctx.lineWidth = 4;
    ctx.strokeStyle = "lime";
    ctx.stroke();
  });
}

function drawPose(pose) {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const scale = canvas.width / video.width; // Scaling factor based on canvas size

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before new drawing

  drawKeypoints(pose.keypoints, 0.5, ctx, scale); // Draw keypoints with minimum confidence
  drawSkeleton(pose.keypoints, 0.5, ctx, scale); // Draw skeleton lines
}

//  Combination of working codes, refined by adding delay of 100ms to inputs
function classifyPose(pose) {
  const keypoints = pose.keypoints;
  const nose = keypoints.find(k => k.part === "nose");
  const leftEar = keypoints.find(k => k.part === "leftEar");
  const rightEar = keypoints.find(k => k.part === "rightEar");
  const leftShoulder = keypoints.find(k => k.part === "leftShoulder");
  const rightShoulder = keypoints.find(k => k.part === "rightShoulder");
  const leftWrist = keypoints.find(k => k.part === "leftWrist");
  const rightWrist = keypoints.find(k => k.part === "rightWrist");
  const leftElbow = keypoints.find(k => k.part === "leftElbow");
  const rightElbow = keypoints.find(k => k.part === "rightElbow");

  function simulateKeyPress(key) {
    if (Date.now() - window.lastKeyPressTime >= 100) {
      const event = new KeyboardEvent('keydown', {
        key: key,
        bubbles: true
      });
      document.dispatchEvent(event);
      window.lastKeyPressTime = Date.now();
    }
  }

  if (typeof window.lastKeyPressTime === 'undefined') {
    window.lastKeyPressTime = 0;
  }

  let currentAction = "idle"; // Default action

  // Head tilt detection for left and right movement
  if (leftEar && rightEar && leftShoulder && rightShoulder) {
    if (Math.abs(leftEar.position.y - leftShoulder.position.y) < Math.abs(rightEar.position.y - rightShoulder.position.y)) {
      currentAction = "left";
    } else {
      currentAction = "right";
    }
  }

  // Jump Detection: Check vertical movement of the nose in relation to shoulders
  if (typeof window.previousNoseY === 'undefined' || typeof window.previousShoulderY === 'undefined') {
    window.previousNoseY = nose ? nose.position.y : 0;
    window.previousShoulderY = (leftShoulder ? leftShoulder.position.y : 0) + (rightShoulder ? rightShoulder.position.y : 0) / 2;
  }

  if (nose && nose.position.y < window.previousNoseY - 15 && (leftShoulder.position.y + rightShoulder.position.y) / 2 < window.previousShoulderY - 15) {
    currentAction = "jump";
  }

  // Update previous positions
  window.previousNoseY = nose ? nose.position.y : window.previousNoseY;
  window.previousShoulderY = (leftShoulder ? leftShoulder.position.y : 0) + (rightShoulder ? rightShoulder.position.y : 0) / 2;

  // Punch Detection
  if (rightWrist && rightElbow && rightShoulder && rightWrist.position.x > rightElbow.position.x + 10 && rightWrist.position.y < rightShoulder.position.y) {
    currentAction = "punch_right";
  }
  if (leftWrist && leftElbow && leftShoulder && leftWrist.position.x < leftElbow.position.x - 10 && leftWrist.position.y < leftShoulder.position.y) {
    currentAction = "punch_left";
  }

  // Simulate key press based on current action
  switch (currentAction) {
    case "left":
      simulateKeyPress("a");
      break;
    case "right":
      simulateKeyPress("d");
      break;
    case "jump":
      simulateKeyPress("w");
      break;
    case "punch_right":
    case "punch_left":
      simulateKeyPress("s");
      break;
    case "idle":
      // Optionally handle idle; no key press necessary
      break;
  }

  // Update the output div
  const output = document.getElementById("output");
  output.innerHTML = "Detected Actions: " + currentAction;
}

// Perfect left to right logic,  needs refining
// function classifyPose(pose) {
//   const keypoints = pose.keypoints;
//   const leftEar = keypoints.find(k => k.part === "leftEar");
//   const rightEar = keypoints.find(k => k.part === "rightEar");
//   const leftShoulder = keypoints.find(k => k.part === "leftShoulder");
//   const rightShoulder = keypoints.find(k => k.part === "rightShoulder");
//
//   function simulateKeyPress(key) {
//     const event = new KeyboardEvent('keydown', {
//       key: key,
//       bubbles: true
//     });
//     document.dispatchEvent(event);
//   }
//
//   let currentAction = "idle"; // Default action
//
//   // Head tilt detection for left and right movement
//   if (leftEar && rightEar && leftShoulder && rightShoulder) {
//     const leftDistance = Math.abs(leftEar.position.y - leftShoulder.position.y);
//     const rightDistance = Math.abs(rightEar.position.y - rightShoulder.position.y);
//
//     const tiltThreshold = 10; // Adjust this threshold based on sensitivity needed
//
//     if (leftDistance < tiltThreshold) {
//       currentAction = "left";
//     } else if (rightDistance < tiltThreshold) {
//       currentAction = "right";
//     }
//   }
//
//   // Simulate key press based on current action
//   switch (currentAction) {
//     case "left":
//       simulateKeyPress("a");
//       break;
//     case "right":
//       simulateKeyPress("d");
//       break;
//     case "idle":
//       // No key press necessary if idle
//       break;
//   }
//
//   // Update the output div
//   const output = document.getElementById("output");
//   output.innerHTML = "Detected Actions: " + currentAction;
// }


// Perfect Jump, okay attack, missing left/right
// function classifyPose(pose) {
//   const keypoints = pose.keypoints;
//   const nose = keypoints.find(k => k.part === "nose");
//   const leftWrist = keypoints.find(k => k.part === "leftWrist");
//   const rightWrist = keypoints.find(k => k.part === "rightWrist");
//   const leftElbow = keypoints.find(k => k.part === "leftElbow");
//   const rightElbow = keypoints.find(k => k.part === "rightElbow");
//   const leftShoulder = keypoints.find(k => k.part === "leftShoulder");
//   const rightShoulder = keypoints.find(k => k.part === "rightShoulder");
//
//   function simulateKeyPress(key) {
//     const event = new KeyboardEvent('keydown', {
//       key: key,
//       bubbles: true
//     });
//     document.dispatchEvent(event);
//   }
//
//   let currentAction = "idle"; // Default action
//
//   // Jump Detection: Check vertical movement of the nose in relation to shoulders
//   if (typeof window.previousNoseY === 'undefined' || typeof window.previousShoulderY === 'undefined') {
//     window.previousNoseY = nose.position.y;
//     window.previousShoulderY = (leftShoulder.position.y + rightShoulder.position.y) / 2;
//   }
//
//   if (nose.position.y < window.previousNoseY - 15 && (leftShoulder.position.y + rightShoulder.position.y) / 2 < window.previousShoulderY - 15) {
//     currentAction = "jump";
//   }
//
//   // Update previous positions
//   window.previousNoseY = nose.position.y;
//   window.previousShoulderY = (leftShoulder.position.y + rightShoulder.position.y) / 2;
//
//   // Punch Detection
//   if (rightWrist.position.x > rightElbow.position.x + 10 && rightWrist.position.y < rightShoulder.position.y) {
//     currentAction = "punch_right";
//   }
//   if (leftWrist.position.x < leftElbow.position.x - 10 && leftWrist.position.y < leftShoulder.position.y) {
//     currentAction = "punch_left";
//   }
//
//   // Simulate key press based on current action
//   switch (currentAction) {
//     case "jump":
//       simulateKeyPress("w");
//       break;
//     case "punch_right":
//       simulateKeyPress("s");
//       break;
//     case "punch_left":
//       simulateKeyPress("s");
//       break;
//     case "idle":
//       // Optionally handle idle; no key press necessary
//       break;
//   }
//
//   // Update the output div
//   const output = document.getElementById("output");
//   output.innerHTML = "Detected Actions: " + currentAction;
// }


async function loadAndPredict() {
  const video = await setupCamera();
  video.play();

  const net = await posenet.load();
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  function detectPose() {
    net
      .estimateSinglePose(video, {
        flipHorizontal: false,
      })
      .then((pose) => {
        drawPose(pose);
        classifyPose(pose);
      });
  }

  setInterval(detectPose, 100); // Continuously run detection every 100 milliseconds
}

loadAndPredict();
