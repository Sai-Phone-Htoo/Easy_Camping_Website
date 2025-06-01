document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("easyCampingCart")) || [];
    const summaryContainer = document.getElementById("order-summary");
    const totalEl = document.getElementById("order-total");

    let total = 0;
    summaryContainer.innerHTML = "";

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.textContent = `${item.name} x${item.quantity}`;

        const span = document.createElement("span");
        span.textContent = `$${itemTotal.toFixed(2)}`;
        li.appendChild(span);

        summaryContainer.appendChild(li);
    });

    totalEl.textContent = `$${total.toFixed(2)}`;

    document.getElementById("payment-form").addEventListener("submit", (e) => {
        e.preventDefault();
        // Clear cart
        localStorage.removeItem("easyCampingCart");
        // Redirect to success page
        window.location.href = "payment-success.html";
    });
});
