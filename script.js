/* ─── Navbar ─── */

const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-link");

function updateNav() {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

    const sections = document.querySelectorAll(".section");
    let current = "hero";

    sections.forEach((section) => {
        const top = section.offsetTop - 100;
        const bottom = top + section.offsetHeight;
        if (scrollY >= top && scrollY < bottom) {
            current = section.id;
        }
    });

    navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
}

window.addEventListener("scroll", updateNav, { passive: true });
window.addEventListener("load", updateNav);

navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    });
});

/* ─── Cart & Booking ─── */

const addButtons = document.querySelectorAll(".add-btn");
const cartBody = document.querySelector("#cart-body");
const totalEl = document.querySelector("#total");
const cartEmpty = document.querySelector("#cart-empty");
const cartCount = document.querySelector("#cart-count");
const services = document.querySelectorAll(".service");
const bookingForm = document.querySelector("#booking-form");
const successMsg = document.querySelector("#success-message");

let totalAmount = 0;
let selectedServices = [];
let itemCount = 0;

function toggleCartEmpty() {
    cartEmpty.style.display = cartBody.children.length === 0 ? "flex" : "none";
}

function renumberRows() {
    Array.from(cartBody.children).forEach((row, i) => {
        row.children[0].textContent = i + 1;
    });
}

function updateCartCount() {
    cartCount.textContent = itemCount;
}

addButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        const serviceName = services[index].querySelector("h3").textContent;
        const priceText = services[index].querySelector(".price").textContent;
        const price = parseInt(priceText.replace(/[₹,]/g, ""));
        const row = document.createElement("tr");

        const cell1 = document.createElement("td");
        const cell2 = document.createElement("td");
        const cell3 = document.createElement("td");
        const cell4 = document.createElement("td");
        const removeBtn = document.createElement("button");
        removeBtn.className = "remove-btn";
        removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';

        cell1.textContent = cartBody.children.length + 1;
        cell2.textContent = serviceName;
        cell3.textContent = priceText;
        cell4.appendChild(removeBtn);

        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        row.appendChild(cell4);
        cartBody.appendChild(row);

        totalAmount += price;
        totalEl.textContent = totalAmount.toLocaleString();

        button.disabled = true;
        button.innerHTML = '<i class="fa-solid fa-check"></i><span>Added</span>';

        selectedServices.push({ name: serviceName, price });
        itemCount++;
        updateCartCount();
        toggleCartEmpty();

        removeBtn.addEventListener("click", () => {
            row.remove();
            renumberRows();
            totalAmount -= price;
            totalEl.textContent = totalAmount.toLocaleString();
            button.disabled = false;
            button.innerHTML = '<i class="fa-solid fa-plus"></i><span>Add</span>';
            selectedServices = selectedServices.filter(item => item.name !== serviceName);
            itemCount--;
            updateCartCount();
            toggleCartEmpty();
        });
    });
});

bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();
    successMsg.textContent = "";

    if (selectedServices.length === 0) {
        alert("Please add at least one service.");
        return;
    }

    const templateParams = {
        name: document.querySelector("#name").value,
        email: document.querySelector("#email").value,
        phone: document.querySelector("#phone").value,
        services: selectedServices.map(item => `${item.name} - ₹${item.price}`).join("\n"),
        total: totalAmount,
    };

    emailjs
        .send("service_5lqj3l5", "template_azyz7kb", templateParams)
        .then(() => {
            successMsg.textContent = "Booking confirmed!";
            successMsg.style.color = "#2e7d32";
            bookingForm.reset();
            cartBody.innerHTML = "";
            totalAmount = 0;
            totalEl.textContent = "0";
            selectedServices = [];
            itemCount = 0;
            updateCartCount();

            addButtons.forEach((button) => {
                button.disabled = false;
                button.innerHTML = '<i class="fa-solid fa-plus"></i><span>Add</span>';
            });

            toggleCartEmpty();
        })
        .catch(() => {
            successMsg.textContent = "Booking failed. Please try again.";
            successMsg.style.color = "#dc2626";
        });
});

toggleCartEmpty();
updateCartCount();
