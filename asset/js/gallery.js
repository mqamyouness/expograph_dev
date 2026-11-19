document.addEventListener("DOMContentLoaded", function () {

    const gallery = document.querySelector(".gallery");
    if (!gallery) return;

    const track = gallery.querySelector(".gallery-track");
    const items = [...gallery.querySelectorAll(".gallery-item")];
    const prev = gallery.querySelector(".gallery-prev");
    const next = gallery.querySelector(".gallery-next");

    let activeIndex = 0;

    function updateActive(index) {
        activeIndex = Math.max(0, Math.min(index, items.length - 1));

        items.forEach((item, i) => {
            item.classList.toggle("active", i === activeIndex);
        });

        items[activeIndex].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center"
        });
    }

    next.addEventListener("click", () => {
        updateActive(activeIndex + 1);
    });

    prev.addEventListener("click", () => {
        updateActive(activeIndex - 1);
    });

    items.forEach((item, index) => {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            updateActive(index);
            openLightbox(index);
        });
    });

    // Lightbox
    const lightbox = document.createElement("div");
    lightbox.className = "gallery-lightbox";

    lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Close">&times;</button>
        <button class="lightbox-prev" aria-label="Previous">‹</button>
        <img src="" alt="">
        <button class="lightbox-next" aria-label="Next">›</button>
        <div class="lightbox-caption"></div>
    `;

    document.body.appendChild(lightbox);

    let lightboxIndex = 0;

    function showLightboxImage(index) {
        lightboxIndex = (index + items.length) % items.length;

        const item = items[lightboxIndex];
        const img = lightbox.querySelector("img");

        img.src = item.href;
        img.alt = item.querySelector("img").alt;

        lightbox.querySelector(".lightbox-caption").textContent =
            item.dataset.caption || "";

    }

    function openLightbox(index) {
        showLightboxImage(index);
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        lightbox.classList.remove("open");
        document.body.style.overflow = "";
    }

    lightbox.querySelector(".lightbox-close")
        .addEventListener("click", closeLightbox);

    lightbox.querySelector(".lightbox-prev")
        .addEventListener("click", () => {
            showLightboxImage(lightboxIndex - 1);
        });

    lightbox.querySelector(".lightbox-next")
        .addEventListener("click", () => {
            showLightboxImage(lightboxIndex + 1);
        });

    lightbox.addEventListener("click", e => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", e => {
        if (!lightbox.classList.contains("open")) return;

        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") showLightboxImage(lightboxIndex + 1);
        if (e.key === "ArrowLeft") showLightboxImage(lightboxIndex - 1);
    });

});