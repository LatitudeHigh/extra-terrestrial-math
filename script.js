// Leave this file alone
const canvas = document.querySelector("#canvas");

window.onload = function() {
    resizeListener();
    if (typeof start === 'function') {
        start();
    }
};


function resizeListener() {
  canvas.height = window.innerHeight - 80;
  canvas.width = window.innerWidth - 20;
}

window.addEventListener("resize", resizeListener);