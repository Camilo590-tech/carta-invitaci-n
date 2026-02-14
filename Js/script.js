// © Zero - Código libre no comercial

let animacionIniciada = false;

let musicaIniciada = false;

function reproducirMusica() {
  const audio = document.getElementById("bg-music");
  if (audio && !musicaIniciada) {
    musicaIniciada = true;
    audio.volume = 0.6;
    audio.loop = true;
    audio.play().catch(() => {});
  }
}

/* ================================
   CONTROL DE HORA (8:55 AM)
================================ */
function iniciarCuentaRegresiva() {
  const ahora = new Date();

  const apertura = new Date();
  apertura.setHours(10, 18, 0, 0); // ⏰ 8:55 AM

  // Si ya pasó la hora
  if (ahora >= apertura) {
    habilitarContenido();
    return;
  }

  const waiting = document.getElementById("waiting-container");
  const contador = document.getElementById("waiting-countdown");

  if (!waiting || !contador) return;

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
  const waiting = document.getElementById("waiting-container");
  if (waiting) waiting.style.display = "none";

  document.querySelector(".tree-container").style.visibility = "visible";
  document.querySelector(".response-container").style.visibility = "visible";

  if (!animacionIniciada) {
    animacionIniciada = true;
    iniciarAnimacion();
  }
}

/* ================================
   ANIMACIÓN DEL GIRASOL
================================ */
function iniciarAnimacion() {
  fetch('Img/treelove.svg')
    .then(res => res.text())
    .then(svgText => {
      const container = document.getElementById('tree-container');
      container.innerHTML = svgText;

      const svg = container.querySelector('svg');
      if (!svg) return;

      const paths = Array.from(svg.querySelectorAll('path'));

      paths.forEach(path => {
        path.style.stroke = '#222';
        path.style.strokeWidth = '2.5';
        path.style.fillOpacity = '0';

        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.style.transition = 'none';
      });

      setTimeout(() => {
        paths.forEach((path, i) => {
          path.style.transition = `
            stroke-dashoffset 1.2s cubic-bezier(.77,0,.18,1) ${i * 0.08}s,
            fill-opacity 0.5s ${0.9 + i * 0.08}s
          `;
          path.style.strokeDashoffset = 0;

          setTimeout(() => {
            path.style.fillOpacity = '1';
            path.style.stroke = '';
            path.style.strokeWidth = '';
          }, 1200 + i * 80);
        });
      }, 50);

      const total = 1200 + (paths.length - 1) * 80 + 500;
      setTimeout(() => {
        svg.classList.add('move-and-scale');
        setTimeout(showDedicationText, 1200);
      }, total);
    });
}

/* ================================
   TEXTO TYPING
================================ */
function getURLParam(name) {
  return new URL(window.location.href).searchParams.get(name);
}

function showDedicationText() {
  let text = getURLParam('text');

  if (!text) {
    text = `Para Mayrunchis:

Solo quería recordarte que te amo demasiado,
que estoy orgulloso de la mujer que eres
y que me alegra verte reír.

Queria aprovechar y preguntarte algo…

¿Quieres ir a cenar este sábado 14 de febrero conmigo? 🌻`;
  } else {
    text = decodeURIComponent(text).replace(/\\n/g, '\n');
  }

  const container = document.getElementById('dedication-text');
  container.classList.add('typing');

  let i = 0;
  function type() {
    if (i <= text.length) {
      container.textContent = text.slice(0, i++);
      setTimeout(type, text[i - 2] === '\n' ? 350 : 45);
    } else {
      setTimeout(showSignature, 600);
    }
  }
  type();
}

/* ================================
   FIRMA + BOTONES
================================ */
function showSignature() {
  const dedication = document.getElementById('dedication-text');

  let signature = dedication.querySelector('#signature');
  if (!signature) {
    signature = document.createElement('div');
    signature.id = 'signature';
    signature.className = 'signature';
    dedication.appendChild(signature);
  }

  signature.textContent = "Con amor, Panca";
  signature.classList.add('visible');

  setTimeout(() => {
    const opciones = document.getElementById("opciones");
    opciones.style.display = "block";
    opciones.classList.add("visible");
    activarBotonNo();
  }, 600);
}

/* ================================
   BOTÓN NO QUE HUYE
================================ */
function activarBotonNo() {
  const btnNo = document.getElementById("btnNo");
  const contenedor = document.getElementById("opciones");
  if (!btnNo || !contenedor) return;

  btnNo.style.position = "absolute";

  btnNo.addEventListener("mousemove", () => {
    const maxX = contenedor.offsetWidth - btnNo.offsetWidth;
    const maxY = contenedor.offsetHeight - btnNo.offsetHeight;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    btnNo.style.left = `${x}px`;
    btnNo.style.top = `${y}px`;
  });
}

/* ================================
   RESPUESTAS
================================ */
let intervalo;

function respuestaSi() {
  localStorage.setItem("dijoQueSi", "true");

  const telefono = "573212374682";
  const mensaje = encodeURIComponent(
    "Dije que SÍ 💛🌻\nAcepto la cita.\nNos vemos a las 6:00 pm ✨"
  );

  window.open(`https://wa.me/${telefono}?text=${mensaje}`, "_blank");

  document.getElementById("opciones").style.display = "none";

  document.getElementById("resultado").innerHTML = `
    <h2>💛 Dijiste que sí 💛</h2>
    <p>Ya le avisé por WhatsApp 🌻</p>
    <p id="contador"></p>
    <p><strong>Lugar:</strong> Confidencial 🌻</p>
  `;

  iniciarContador();
}

/* ================================
   CONTADOR POST-SÍ
================================ */
function iniciarContador() {
  // 📅 Fecha fija: 14 de febrero de 2026 - 6:00 PM
  const objetivo = new Date(2026, 1, 14, 18, 0, 0, 0);
  // (Mes 1 = febrero, porque los meses empiezan en 0)

  intervalo = setInterval(() => {
    const diff = objetivo - new Date();

    if (diff <= 0) {
      clearInterval(intervalo);
      document.getElementById("contador").textContent =
        "✨ ¡Es el momento! ✨";
      return;
    }

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    document.getElementById("contador").textContent =
      `${h}h ${m}m ${s}s`;
  }, 1000);
}

/* ================================
   AUDIO + OVERLAY
================================ */
window.addEventListener("DOMContentLoaded", () => {
  iniciarCuentaRegresiva();

  const overlay = document.getElementById("start-overlay");
  const audio = document.getElementById("bg-music");

  if (overlay) {
    overlay.addEventListener("click", () => {
      if (audio) {
        audio.volume = 0.6;
        audio.loop = true;
        audio.play().catch(() => {});
      }
      overlay.style.display = "none";
    });
  }
});
