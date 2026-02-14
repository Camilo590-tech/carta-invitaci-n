let animacionIniciada = false;

/* ================================
   CUENTA REGRESIVA
================================ */
function iniciarCuentaRegresiva() {
  const ahora = new Date();
  const apertura = new Date();
  apertura.setHours(10, 35, 0, 0);

  if (ahora >= apertura) {
    habilitarContenido();
    return;
  }

  const contador = document.getElementById("waiting-countdown");

  const intervalo = setInterval(() => {
    const diff = apertura - new Date();

    if (diff <= 0) {
      clearInterval(intervalo);
      habilitarContenido();
      return;
    }

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    contador.textContent = `${h}h ${m}m ${s}s`;
  }, 1000);
}

/* ================================
   HABILITAR CONTENIDO
================================ */
function habilitarContenido() {
  document.getElementById("waiting-container").style.display = "none";

  const overlay = document.getElementById("start-overlay");
  overlay.style.display = "flex";
}

/* ================================
   INICIAR EXPERIENCIA
================================ */
function iniciarExperiencia() {
  document.querySelector(".tree-container").style.visibility = "visible";
  document.querySelector(".response-container").style.visibility = "visible";

  if (!animacionIniciada) {
    animacionIniciada = true;
    iniciarAnimacion();
  }
}

/* ================================
   ANIMACIÓN SVG
================================ */
function iniciarAnimacion() {
  fetch('Img/treelove.svg')
    .then(res => res.text())
    .then(svgText => {
      const container = document.getElementById('tree-container');
      container.innerHTML = svgText;

      const svg = container.querySelector('svg');
      const paths = Array.from(svg.querySelectorAll('path'));

      paths.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.style.stroke = '#222';
        path.style.strokeWidth = '2';
        path.style.fillOpacity = '0';
      });

      setTimeout(() => {
        paths.forEach((path, i) => {
          path.style.transition = `stroke-dashoffset 1.2s ease ${i*0.08}s, fill-opacity 0.5s`;
          path.style.strokeDashoffset = 0;

          setTimeout(() => {
            path.style.fillOpacity = '1';
          }, 1200 + i*80);
        });
      }, 100);
    });
}

/* ================================
   RESPUESTA SI
================================ */
function respuestaSi() {
  alert("💛 Dijiste que sí 💛");
}

/* ================================
   AUDIO + OVERLAY
================================ */
window.addEventListener("DOMContentLoaded", () => {
  iniciarCuentaRegresiva();

  const overlay = document.getElementById("start-overlay");
  const audio = document.getElementById("bg-music");

  overlay.addEventListener("click", () => {

    audio.volume = 0.6;
    audio.loop = true;

    audio.play().then(() => {
      console.log("Música iniciada");
    }).catch(err => console.log(err));

    overlay.style.display = "none";

    iniciarExperiencia(); // 🔥 empieza todo después del click
  });
});
