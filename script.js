const targetDate = new Date(2026, 7, 15, 0, 0, 0);
const dayAfterDate = new Date(targetDate.getTime() + 24 * 60 * 60 * 1000);
const monthlyEggStartDate = new Date(2026, 2, 15, 0, 0, 0);

const monthlyEggElement = document.getElementById("monthlyEgg");
const countdownWrapElement = document.getElementById("countdownWrap");
const celebrationElement = document.getElementById("celebration");
const milestoneElement = document.getElementById("milestoneBadge");

const milestones = [
  { max: 1, level: 8, label: "¡Mañana nos vamos! 💍✈️" },
  { max: 2, level: 7, label: "¡Faltan 2 días! 🎉" },
  { max: 3, level: 6, label: "¡Faltan 3 días! 🎊" },
  { max: 4, level: 5, label: "¡Faltan 4 días! 🧳" },
  { max: 5, level: 4, label: "¡Faltan 5 días! ✈️" },
  { max: 6, level: 3, label: "¡Faltan 6 días! 🧭" },
  { max: 7, level: 2, label: "¡Última semana! ✈️" },
  { max: 14, level: 1, label: "¡Quedan 2 semanas! 🧳" },
];

function updateMilestone(days) {
  const tier = milestones.find((milestone) => days <= milestone.max);

  if (!tier) {
    milestoneElement.hidden = true;
    return;
  }

  milestoneElement.hidden = false;
  milestoneElement.className = `milestone-badge level-${tier.level}`;
  milestoneElement.textContent = tier.label;
}

function calculateMonthsLeft(now, endDate) {
  let monthsLeft = (endDate.getFullYear() - now.getFullYear()) * 12;
  monthsLeft += endDate.getMonth() - now.getMonth();

  if (now.getMonth() > endDate.getMonth()) {
    monthsLeft -= 1;
  }

  return Math.max(monthsLeft, 0);
}

function updateMonthlyEgg(now) {
  if (!monthlyEggElement) {
    return;
  }

  if (now < monthlyEggStartDate) {
    monthlyEggElement.classList.remove("is-special");
    monthlyEggElement.classList.add("is-hidden");
    monthlyEggElement.innerHTML = "";
    return;
  }

  monthlyEggElement.classList.remove("is-hidden");

  const isFifteenth = now.getDate() === 15;
  const monthsLeft = calculateMonthsLeft(now, targetDate);
  const monthsLabel = monthsLeft === 1 ? "mes" : "meses";
  monthlyEggElement.classList.toggle("is-special", isFifteenth);
  monthlyEggElement.innerHTML = `
    <span class="plane" aria-hidden="true">✈</span>
    <p class="monthly-egg-main">Faltan <strong>${monthsLeft}</strong> ${monthsLabel} para el "si, quiero".</p>
  `;
}

let celebrationPhase = null;

function renderCelebration(now) {
  const phase = now < dayAfterDate ? "today" : "married";
  if (phase === celebrationPhase) return;
  celebrationPhase = phase;

  celebrationElement.innerHTML = phase === "today"
    ? `
      <div class="celebration-rings" aria-hidden="true">✈️</div>
      <h2 class="celebration-title">Hemos llegado a destino</h2>
      <p class="celebration-names">Inma &amp; Pedro se casan hoy</p>
      <p class="celebration-line">Gracias por hacernos partícipes de este viaje 🧭💍</p>
    `
    : `
      <div class="celebration-rings" aria-hidden="true">✈️</div>
      <h2 class="celebration-title">Destino alcanzado</h2>
      <p class="celebration-names">Inma &amp; Pedro ya son marido y mujer</p>
      <p class="celebration-line">Gracias por hacernos partícipes de este viaje 🧭💍</p>
    `;
}

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    countdownWrapElement.hidden = true;
    celebrationElement.hidden = false;
    renderCelebration(now);
    return;
  }

  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;

  const sunsets = days;
  const weekends = Math.floor(days / 7);

  updateMonthlyEgg(now);
  updateMilestone(days);

  document.getElementById("travelText").innerHTML = `
    ✈️ Faltan <strong>${days}</strong> días de trayecto<br>
    🌅 <strong>${sunsets}</strong> atardeceres por recorrer<br>
    🧭 y aproximadamente <strong>${weekends}</strong> fines de semana
    <div class="final-line">
      El próximo viaje no aparece en Google Maps🗺️
    </div>
  `;
}

updateCountdown();
setInterval(updateCountdown, 1000);

const despedidaToggle = document.getElementById("despedidaToggle");
const despedidaGallery = document.getElementById("despedidaGallery");
const galleryTrack = document.getElementById("galleryTrack");

despedidaToggle.addEventListener("click", () => {
  const isOpen = despedidaToggle.getAttribute("aria-expanded") === "true";
  despedidaToggle.setAttribute("aria-expanded", String(!isOpen));
  despedidaGallery.hidden = isOpen;
  if (!isOpen) galleryTrack.scrollLeft = 0;
});

document.querySelector(".gallery-prev").addEventListener("click", () => {
  galleryTrack.scrollBy({ left: -270, behavior: "smooth" });
});

document.querySelector(".gallery-next").addEventListener("click", () => {
  galleryTrack.scrollBy({ left: 270, behavior: "smooth" });
});

function launchPlaneBurst() {
  const layer = document.createElement("div");
  layer.className = "plane-burst-layer";
  document.body.appendChild(layer);

  const planeCount = 8;
  for (let i = 0; i < planeCount; i++) {
    const plane = document.createElement("span");
    plane.className = "plane-burst";
    plane.textContent = "✈";
    plane.style.top = `${10 + Math.random() * 70}%`;
    plane.style.animationDelay = `${i * 0.12}s`;
    layer.appendChild(plane);
  }

  setTimeout(() => layer.remove(), 2600);
}

monthlyEggElement.addEventListener("click", (event) => {
  if (event.target.closest(".plane")) {
    launchPlaneBurst();
  }
});