// ================================
// CV Yahir Valenzuela - Main JS
// ================================

// 1️⃣ Confirmación de carga
document.addEventListener("DOMContentLoaded", () => {
  console.log("CV cargado correctamente 🚀");
  initTheme();
  initScrollAnimations();
});

// ================================
// 2️⃣ MODO CLARO / OSCURO
// ================================

function initTheme() {
  const btn = document.getElementById("btnTheme");

  // Si no existe botón, no rompe nada
  if (!btn) return;

  // Cargar preferencia guardada
  const savedTheme = localStorage.getItem("cv-theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }

  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("cv-theme", isDark ? "dark" : "light");
  });
}

// ================================
// 3️⃣ ANIMACIÓN SUAVE AL SCROLL
// ================================

function initScrollAnimations() {
  const elements = document.querySelectorAll(".content-card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "all 0.6s ease";
    observer.observe(el);
  });
}

// ================================
// 4️⃣ BOTÓN PDF (opcional)
// ================================

function exportPDF() {
  window.print();
}