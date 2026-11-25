// IMPORTANT: Replace this with your WhatsApp number including country code, digits only.
// Example for India: 919876543210
const WHATSAPP_NUMBER = "919539040769";
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyWv4S6XZK25P4sC7o6qI6QqNKmwU_nis12G-rMTGcXi8J-tOdKJ_wPvPYpI5kCTowQ/exec";

const products = [
  {
    id: "handwash",
    name: "Rose & Aloe Hand Wash",
    category: "wash",
    tag: "HAND CARE",
    price: 99,
    desc: "A gentle everyday hand wash with a fresh, uplifting fragrance.",
    images: ["assets/handwash-1.png", "assets/handwash-2.png"],
  },
  {
    id: "clothwash",
    name: "Fresh Linen Cloth Wash",
    category: "wash",
    tag: "LAUNDRY",
    price: 149,
    desc: "Helps lift everyday dirt and leaves clothes feeling fresh.",
    images: ["assets/clothwash-1.png", "assets/clothwash-2.png"],
  },
  {
    id: "floorcleaner",
    name: "Lemon Floor Cleaner",
    category: "surface",
    tag: "FLOOR CARE",
    price: 120,
    desc: "A bright lemon-fresh clean for your everyday floor routine.",
    images: ["assets/floorcleaner-1.png", "assets/floorcleaner-2.png"],
  },
  {
    id: "phenyl",
    name: "Pine Disinfectant",
    category: "surface",
    tag: "HOME CARE",
    price: 110,
    desc: "A crisp pine fragrance for routine cleaning around the home.",
    images: ["assets/phenyl-1.png", "assets/phenyl-2.png"],
  },
  {
    id: "toiletcleaner",
    name: "Power Toilet Cleaner",
    category: "bathroom",
    tag: "BATHROOM",
    price: 95,
    desc: "A practical bathroom-cleaning essential for your home.",
    images: ["assets/toiletcleaner-1.png", "assets/toiletcleaner-2.png"],
  },
];
const quantities = Object.fromEntries(products.map((p) => [p.id, 0]));
let selectedCoords = null;
const money = (n) => "₹" + n.toFixed(2);
const grid = document.getElementById("productGrid");
const orderLines = document.getElementById("orderLines");
// Track selected products separately from their quantities.
const selectedProducts = Object.fromEntries(products.map((p) => [p.id, false]));
function renderProducts(filter = "all") {
  grid.innerHTML = "";

  products
    .filter((p) => filter === "all" || p.category === filter)
    .forEach((p) => {
      const card = document.createElement("article");

      card.className =
        "product-card" + (selectedProducts[p.id] ? " selected" : "");

      card.innerHTML = `
        <div class="product-image">
          <span class="category-pill">${p.tag}</span>

          <img id="image-${p.id}"
            src="${p.images[0]}"
            alt="${p.name}" />

          <div class="image-dots">
            ${p.images
              .map(
                (_, i) => `
              <button type="button"
                class="${i === 0 ? "active" : ""}"
                aria-label="View image ${i + 1}"
                data-image="${i}">
              </button>
            `,
              )
              .join("")}
          </div>
        </div>

        <div class="product-info">
          <div class="product-title-row">
            <h3>${p.name}</h3>
            <span class="price">${money(p.price)}</span>
          </div>

          <p class="product-desc">${p.desc}</p>

          ${
            selectedProducts[p.id]
              ? `
                <div class="product-bottom">
                  <span class="qty-label">QUANTITY</span>

                  <div class="qty-control">
                    <button type="button" data-change="-1">−</button>
                    <span id="qty-${p.id}">${quantities[p.id]}</span>
                    <button type="button" class="plus" data-change="1">+</button>
                  </div>
                </div>
              `
              : `
                <div class="select-hint">
                  Click to select
                </div>
              `
          }
        </div>
      `;

      // Clicking the entire card selects or deselects it.
      card.addEventListener("click", (e) => {
        // Do not select/deselect when clicking quantity controls or image dots.
        if (
          e.target.closest(".qty-control") ||
          e.target.closest(".image-dots")
        ) {
          return;
        }

        selectedProducts[p.id] = !selectedProducts[p.id];

        if (selectedProducts[p.id]) {
          quantities[p.id] = 1;
        } else {
          quantities[p.id] = 0;
        }

        renderProducts(filter);
        renderOrder();
      });

      // Quantity controls.
      card.querySelectorAll("[data-change]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          changeQty(p.id, Number(btn.dataset.change));
        });
      });

      // Image gallery.
      card.querySelectorAll(".image-dots button").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();

          const index = Number(btn.dataset.image);

          document.getElementById(`image-${p.id}`).src = p.images[index];

          card.querySelectorAll(".image-dots button").forEach((b, i) => {
            b.classList.toggle("active", i === index);
          });
        });
      });

      grid.appendChild(card);
    });
}

function changeQty(id, delta) {
  quantities[id] = Math.max(0, quantities[id] + delta);

  // Automatically deselect when quantity becomes zero.
  if (quantities[id] === 0) {
    selectedProducts[id] = false;
  }

  const activeFilter =
    document.querySelector(".filter.active")?.dataset.filter || "all";

  renderProducts(activeFilter);
  renderOrder();
}

function renderOrder() {
  const chosen = products.filter((p) => quantities[p.id] > 0);
  const count = chosen.reduce((sum, p) => sum + quantities[p.id], 0);
  const total = chosen.reduce((sum, p) => sum + p.price * quantities[p.id], 0);
  document.getElementById("itemCount").textContent =
    `${count} ${count === 1 ? "item" : "items"}`;
  document.getElementById("orderTitle").textContent = count
    ? "Your favourites"
    : "A fresh start";
  document.getElementById("orderTotal").textContent = money(total);
  if (!chosen.length) {
    orderLines.innerHTML =
      '<div class="empty-state"><span>＋</span><p>Your basket is waiting.</p><small>Add a few home-care favourites to get started.</small></div>';
  } else {
    orderLines.innerHTML = chosen
      .map(
        (p) => `<div class="order-line">
      <div class="checkout-item-left"><img class="checkout-thumb" src="${p.images[0]}" alt="">
        <div><div class="checkout-item-name">${p.name}</div><small>${money(p.price)} each</small></div>
      </div>
      <div class="checkout-controls">
        <button type="button" data-order-change="-1" data-id="${p.id}" aria-label="Decrease quantity">−</button>
        <span>${quantities[p.id]}</span>
        <button type="button" data-order-change="1" data-id="${p.id}" aria-label="Increase quantity">+</button>
      </div>
      <strong>${money(p.price * quantities[p.id])}</strong>
    </div>`,
      )
      .join("");
    orderLines
      .querySelectorAll("[data-order-change]")
      .forEach((btn) =>
        btn.addEventListener("click", () =>
          changeQty(btn.dataset.id, Number(btn.dataset.orderChange)),
        ),
      );
  }
}
document.getElementById("filters").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-filter]");
  if (!btn) return;
  document
    .querySelectorAll(".filter")
    .forEach((b) => b.classList.toggle("active", b === btn));
  renderProducts(btn.dataset.filter);
});
function setLocation(lat, lng) {
  selectedCoords = { lat, lng };
  document.getElementById("locationStatus").textContent = "Location added ✓";
  document.getElementById("mapWrap").hidden = false;
  document.getElementById("mapFrame").src =
    `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  document.getElementById("openMap").href =
    `https://www.google.com/maps?q=${lat},${lng}`;
}
document.getElementById("locateBtn").addEventListener("click", () => {
  const status = document.getElementById("locationStatus");
  if (!navigator.geolocation) {
    status.textContent = "Location not supported";
    return;
  }
  status.textContent = "Finding location…";
  navigator.geolocation.getCurrentPosition(
    (pos) => setLocation(pos.coords.latitude, pos.coords.longitude),
    () => {
      status.textContent = "Could not access location";
      showToast("Please allow location access in your browser.");
    },
    { enableHighAccuracy: true, timeout: 12000 },
  );
});
document.getElementById("clearLocation").addEventListener("click", () => {
  selectedCoords = null;
  document.getElementById("mapWrap").hidden = true;
  document.getElementById("locationStatus").textContent = "Not added yet";
  document.getElementById("mapFrame").src = "";
});
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}

document
  .getElementById("checkoutForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const chosen = products.filter((p) => quantities[p.id] > 0);

    if (!chosen.length) {
      showToast("Please add at least one product.");
      document.getElementById("catalogue").scrollIntoView();
      return;
    }

    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const address = document.getElementById("customerAddress").value.trim();

    if (!name || !address) {
      showToast("Please enter your name and delivery address.");
      return;
    }

    if (!selectedCoords) {
      showToast("Please add your current delivery location.");
      return;
    }

    if (!GOOGLE_SCRIPT_URL) {
      showToast("Google Sheets URL is missing.");
      return;
    }

    if (WHATSAPP_NUMBER.includes("X")) {
      showToast("Please add your WhatsApp number.");
      return;
    }

    const total = chosen.reduce(
      (sum, p) => sum + p.price * quantities[p.id],
      0,
    );

    // Prepare order data for Google Sheets.
    const orderData = {
      name: name,
      phone: phone || "Not provided",
      address: address,

      products: chosen.map((p) => ({
        id: p.id,
        name: p.name,
        quantity: quantities[p.id],
        price: p.price,
        lineTotal: p.price * quantities[p.id],
      })),

      total: total,
      latitude: selectedCoords.lat,
      longitude: selectedCoords.lng,
      mapUrl: `https://www.google.com/maps?q=${selectedCoords.lat},${selectedCoords.lng}`,
    };

    // Prepare WhatsApp message.
    const itemText = chosen
      .map(
        (p) =>
          `• ${p.name} — ${quantities[p.id]} × ${money(p.price)} = ${money(p.price * quantities[p.id])}`,
      )
      .join("\n");

    const locationText = `\nGoogle Maps location: ${orderData.mapUrl}`;

    const message =
      `Hello Nila Homeware Plus! I would like to place an order.\n\n` +
      `CUSTOMER DETAILS\n` +
      `Name: ${name}\n` +
      `Contact number: ${phone || "Not provided"}\n` +
      `Delivery address: ${address}${locationText}\n\n` +
      `ORDER DETAILS\n${itemText}\n\n` +
      `Subtotal: ${money(total)}\n\n` +
      `Please confirm availability and delivery charges. Thank you!`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    const submitBtn = e.currentTarget.querySelector('button[type="submit"]');
    if (submitBtn?.disabled) return;
    if (submitBtn) submitBtn.disabled = true;

    // Open WhatsApp tab before the asynchronous request.
    const whatsappTab = window.open("about:blank", "_blank");

    showToast("Saving your order...");

    try {
      // Save order in Google Sheets.
      // no-cors does not allow us to read Google's response.
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(orderData),
      });

      // Continue to WhatsApp.
      if (whatsappTab) {
        whatsappTab.location.href = whatsappUrl;
      } else {
        window.location.href = whatsappUrl;
      }

      showToast("Opening WhatsApp...");
    } catch (error) {
      console.error("Order saving error:", error);

      if (whatsappTab) {
        whatsappTab.location.href = whatsappUrl;
      } else {
        window.location.href = whatsappUrl;
      }

      showToast("Could not confirm order saving. Please contact us.");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });

document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
renderOrder();
