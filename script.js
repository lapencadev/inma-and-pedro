const targetDate = new Date(2026, 7, 15, 0, 0, 0);
const monthlyEggStartDate = new Date(2026, 2, 15, 0, 0, 0);

const monthlyEggElement = document.getElementById("monthlyEgg");

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

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    document.body.innerHTML = "<h1>Ha llegado el destino.</h1>";
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