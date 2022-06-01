// Targeting Elements
var file = document.getElementById("file-to-upload");
var img = document.getElementById("image-to-edit");
var reset = document.querySelector(".btn-reset");
var download = document.querySelector(".btn-download");
var flips = document.querySelectorAll(".flip input[type='checkbox']");

// Targeting Controls (Ranges)
var grayscale = document.getElementById("grayscale");
var blur = document.getElementById("blur");
var brightness = document.getElementById("brightness");
var contrast = document.getElementById("contrast");
var hueRotate = document.getElementById("hue-rotate");
var invert = document.getElementById("invert");
var saturate = document.getElementById("saturate");
var sepia = document.getElementById("sepia");

// Targeting Controls (Array With All)
var inputRanges = document.querySelectorAll("input[type='range']");
var inputcheckbox = document.querySelectorAll("input[type='checkbox']");
var btns = document.querySelectorAll("button.btn");

// Creating Canvas
var canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d");

// Appying The Result When Any Change Occurs
function applyValues() {
  ctx.filter = `
        grayscale(${grayscale.value}%)
        blur(${blur.value * 0.1}px)
        brightness(${brightness.value}%)
        contrast(${contrast.value}%)
        hue-rotate(${hueRotate.value}deg)
        invert(${invert.value}%)
        saturate(${saturate.value}%)
        sepia(${sepia.value}%)
    `;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

// Resetting The Control Values
function resetValues() {
  blur.value = 0;
  grayscale.value = 0;
  brightness.value = 100;
  contrast.value = 100;
  hueRotate.value = 0;
  invert.value = 0;
  saturate.value = 100;
  sepia.value = 0;
  applyValues();
}

// Enabling The Control Values When Uploading An Image
function enableValues() {
  inputRanges.forEach((input) => {
    input.disabled = false;
  });
  inputcheckbox.forEach((input) => {
    input.disabled = false;
  });
  btns.forEach((btn) => {
    btn.disabled = false;
  });
}

// Resetting The Flipping Control Values
function resetFliping() {
  ctx.resetTransform();
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  document.getElementById("flip-h").checked = false;
  document.getElementById("flip-v").checked = false;
  document.getElementById("flip-n").checked = true;
}

// On Window Load Function
window.onload = function () {
  resetValues();
};

// Choosing An Image To Edit
file.onchange = function (event) {
  resetValues();
  enableValues();
  img.src = window.URL.createObjectURL(this.files[0]);
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    img.style.display = "none";
  };
  reset.removeAttribute("disabled");
  download.removeAttribute("disabled");
};

// Applying The Effect For Each Coloring Control
inputRanges.forEach((input) => {
  input.addEventListener("input", (event) => {
    applyValues();
  });
});

// Applying The Effect For Each Flipping Control
flips.forEach((flip) => {
  flip.addEventListener("change", function (e) {
    if (this.id == "flip-h") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      document.getElementById("flip-n").checked = false;
    } else if (this.id == "flip-v") {
      ctx.translate(0, canvas.height);
      ctx.scale(1, -1);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      document.getElementById("flip-n").checked = false;
    } else {
      resetFliping();
    }

    if (
      !document.getElementById("flip-h").checked &&
      !document.getElementById("flip-v").checked
    ) {
      resetFliping();
    }
  });
});

// Resetting The Values For Coloring And Flipping Controls
reset.onclick = function (event) {
  resetValues();
  resetFliping();
};

// Downloading The Final Editted Image
document.querySelector(".btn.btn-download a").onclick = function (e) {
  if (download.hasAttribute("disabled")) {
    e.preventDefault();
    alert("Upload Image First");
  } else {
    e.target.href = canvas.toDataURL();
    e.target.download = "download";
  }
};
