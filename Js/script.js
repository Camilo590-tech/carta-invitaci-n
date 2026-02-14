// © Zero - Código libre no comercial

// ================================
// CARGA Y ANIMACIÓN DEL SVG
// ================================
fetch('Img/treelove.svg')
  .then(res => res.text())
  .then(svgText => {
    const container = document.getElementById('tree-container');
    container.innerHTML = svgText;

    const svg = container.querySelector('svg');
    if (!svg) return;

    const allPaths = Array.from(svg.querySelectorAll('path'));

    // Preparar paths
    allPaths.forEach(path => {
      path.style.stroke = '#222';
      path.style.strokeWidth = '2.5';
      path.style.fillOpacity = '0';
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.transition = 'none';
    });

    // Animar
    setTimeout(() => {
      allPaths.forEach((path, i) => {
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

    // Movimiento final
    const totalDuration = 1200 + (allPaths.length - 1) * 80 + 500;
    setTimeout(() => {
      svg.classList.add('move-and-scale');
      setTimeout(showDedicationText, 1200);
    }, totalDuration);
  });

// ================================
// TEXTO CON EFECTO TYPING
// ================================
function getURLParam(name) {
  return new URL(window.location.href).searchParams.get(name);
}

function showDedicationText() {
  let text = getURLParam('text');
  if (!text) {
    text =
`Para Mayrunchis:

Solo queria pasar a recordarte que te amo demasiado
que estoy orgulloso de la mujer que eres y que me alegro verte reir.

Adicionalmente queria preguntarte que si...

¿Quieres ir a comer este sábado 14 de febrero conmigo? 🌻`;
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

// ================================
// FIRMA + APARICIÓN DE BOTONES
// ================================
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

  // Mostrar botones después de la firma
  setTimeout(() => {
    const opciones = document.getElementById("opciones");
    opciones.style.display = "block";
    opciones.classList.add("visible");
    activarBotonNo();
  }, 600);
}

// ================================
// BOTÓN NO QUE HUYE 😈
// ================================
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

// ================================
// RESPUESTAS SÍ / NO
// ================================
let intervalo;

function respuestaNo() {
  document.getElementById("resultado").innerHTML = `
    <h2>Está bien 💔</h2>
    <p>Gracias por tu sinceridad.</p>
  `;
}

function respuestaSi() {
  // Guardar confirmación
  localStorage.setItem("dijoQueSi", "true");
  localStorage.setItem("fechaSi", new Date().toISOString());

  // WhatsApp
  const telefono = "573212374682"; // ⬅️ CAMBIA ESTE NÚMERO
  const mensaje = encodeURIComponent(
    "Dije que SÍ 💛🌻\nAcepto la cita.\nNos vemos mañana a las 6:00 pm ✨"
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

// ================================
// CONTADOR HASTA MAÑANA 6:00 PM
// ================================
function iniciarContador() {
  const ahora = new Date();
  const mañana = new Date(ahora);
  mañana.setDate(ahora.getDate() + 1);
  mañana.setHours(18, 0, 0, 0);

  intervalo = setInterval(() => {
    const diff = mañana - new Date();
    if (diff <= 0) {
      clearInterval(intervalo);
      document.getElementById("contador").textContent =
        "✨ ¡Es el momento! ✨";
      return;
    }

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff / 60000) % 60);
    const s = Math.floor((diff / 1000) % 60);

    document.getElementById("contador").textContent =
      `${h}h ${m}m ${s}s`;
  }, 1000);
}

window.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("start-overlay");
  const audio = document.getElementById("bg-music");

  overlay.addEventListener("click", () => {
    if (audio) {
      audio.volume = 0.6;
      audio.loop = true;
      audio.play().catch(() => {});
    }
    overlay.style.display = "none";
  });
});

