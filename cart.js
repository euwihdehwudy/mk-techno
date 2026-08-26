/* =====================================================
   m/k-techno
   نظام السلة والطلبات — النسخة المحسّنة
   ===================================================== */

/* ================= SETTINGS ================= */

const WHATSAPP_NUMBER = "201017865201";
const CART_STORAGE_KEY = "mkTechnoCart";

let cart = [];

try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    const parsedCart = savedCart ? JSON.parse(savedCart) : [];
    cart = Array.isArray(parsedCart) ? parsedCart : [];
} catch (error) {
    console.warn("تعذر قراءة السلة المحفوظة.", error);
    cart = [];
}


/* ================= HELPERS ================= */

function formatPrice(value) {
    return Number(value || 0).toLocaleString("ar-EG") + " ج.م";
}

function getValue(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : "";
}

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = String(text ?? "");
    return div.innerHTML;
}


/* ================= SAVE CART ================= */

function saveCart() {
    localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
    );
}


/* ================= ADD PRODUCT ================= */

function addToCart(name, price) {

    price = Number(price);

    if (!name || !Number.isFinite(price)) {
        showMessage("⚠️ بيانات المنتج غير صحيحة");
        return;
    }

    const existingProduct = cart.find(
        item => item.name === name
    );

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            name: String(name),
            price: price,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    renderCart();
    renderCheckout();

    showMessage("✅ تمت إضافة المنتج إلى السلة");
}


/* ================= REMOVE PRODUCT ================= */

function removeFromCart(index) {

    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= cart.length
    ) {
        return;
    }

    cart.splice(index, 1);

    saveCart();
    renderCart();
    renderCheckout();
    updateCartCount();

    showMessage("🗑️ تم حذف المنتج من السلة");
}


/* ================= INCREASE ================= */

function increaseQuantity(index) {

    if (!cart[index]) {
        return;
    }

    cart[index].quantity++;

    saveCart();
    renderCart();
    renderCheckout();
    updateCartCount();
}


/* ================= DECREASE ================= */

function decreaseQuantity(index) {

    if (!cart[index]) {
        return;
    }

    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }

    saveCart();
    renderCart();
    renderCheckout();
    updateCartCount();
}


/* ================= CART TOTAL ================= */

function getCartTotal() {

    return cart.reduce(
        (total, item) => {
            return total +
                (Number(item.price) *
                 Number(item.quantity));
        },
        0
    );
}


/* ================= ITEMS COUNT ================= */

function getCartItemsCount() {

    return cart.reduce(
        (total, item) => {
            return total +
                Number(item.quantity);
        },
        0
    );
}


/* ================= UPDATE CART COUNT ================= */

function updateCartCount() {

    const cartCount =
        document.getElementById("cartCount");

    if (cartCount) {
        cartCount.textContent =
            getCartItemsCount();
    }
}


/* ================= RENDER CART ================= */

function renderCart() {

    const container =
        document.getElementById("cartItems");

    const totalElement =
        document.getElementById("cartTotal");

    if (!container) {
        return;
    }

    /* السلة فارغة */

    if (cart.length === 0) {

        container.innerHTML = `
            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <h2>
                    السلة فارغة
                </h2>

                <p>
                    لم تقم بإضافة أي منتجات بعد.
                </p>

                <a
                    href="electronics.html"
                    class="btn">
                    🔧 ابدأ التسوق
                </a>

            </div>
        `;

        if (totalElement) {
            totalElement.textContent = "0";
        }

        return;
    }


    container.innerHTML = "";


    /* المنتجات */

    cart.forEach(
        (item, index) => {

            const itemTotal =
                Number(item.price) *
                Number(item.quantity);

            const row =
                document.createElement("div");

            row.className = "cart-row";

            row.innerHTML = `

                <div class="cart-info">

                    <h3>
                        ${escapeHTML(item.name)}
                    </h3>

                    <div class="cart-price">
                        ${formatPrice(item.price)}
                    </div>

                </div>


                <div class="quantity">

                    <button
                        type="button"
                        aria-label="زيادة الكمية"
                        onclick="increaseQuantity(${index})">
                        +
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        type="button"
                        aria-label="تقليل الكمية"
                        onclick="decreaseQuantity(${index})">
                        −
                    </button>

                </div>


                <strong>
                    ${formatPrice(itemTotal)}
                </strong>


                <button
                    type="button"
                    class="remove"
                    onclick="removeFromCart(${index})"
                    aria-label="حذف المنتج">
                    حذف
                </button>
            `;

            container.appendChild(row);
        }
    );


    if (totalElement) {
        totalElement.textContent =
            getCartTotal().toLocaleString("ar-EG");
    }
}


/* ================= CHECKOUT PRODUCTS ================= */

function renderCheckout() {

    const container =
        document.getElementById("checkoutProducts");

    const totalElement =
        document.getElementById("checkoutTotal");

    if (!container) {
        return;
    }


    /* السلة فارغة */

    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <h2>
                    لا توجد منتجات
                </h2>

                <a
                    href="electronics.html"
                    class="btn">
                    العودة للمتجر
                </a>

            </div>
        `;

        if (totalElement) {
            totalElement.textContent = "0";
        }

        return;
    }


    container.innerHTML = "";


    cart.forEach(item => {

        const row =
            document.createElement("div");

        row.className =
            "order-product";

        const total =
            Number(item.price) *
            Number(item.quantity);

        row.innerHTML = `

            <span>
                ${escapeHTML(item.name)}
                ×
                ${item.quantity}
            </span>

            <strong>
                ${formatPrice(total)}
            </strong>
        `;

        container.appendChild(row);
    });


    if (totalElement) {
        totalElement.textContent =
            getCartTotal().toLocaleString("ar-EG");
    }
}


/* ================= SUBMIT ORDER ================= */

function submitOrder() {

    if (cart.length === 0) {

        alert(
            "السلة فارغة، أضف منتجًا أولاً."
        );

        return;
    }


    const name =
        getValue("customerName");

    const phone =
        getValue("customerPhone");

    const email =
        getValue("customerEmail");

    const address =
        getValue("customerAddress");

    const payment =
        getValue("paymentMethod");

    const notes =
        getValue("orderNotes");


    /* التحقق */

    if (!name) {
        alert("اكتب اسم العميل.");
        return;
    }

    if (!phone) {
        alert("اكتب رقم الهاتف.");
        return;
    }

    if (!address) {
        alert("اكتب العنوان.");
        return;
    }

    if (!payment) {
        alert("اختر طريقة الدفع.");
        return;
    }


    /* رقم الطلب */

    const orderNumber =
        "MK-" +
        Date.now().toString().slice(-8);


    /* المنتجات */

    let productsText = "";

    cart.forEach(
        (item, index) => {

            const total =
                Number(item.price) *
                Number(item.quantity);

            productsText +=
                `${index + 1}- ${item.name}\n` +
                `   الكمية: ${item.quantity}\n` +
                `   السعر: ${formatPrice(total)}\n\n`;
        }
    );


    /* الإجمالي */

    const grandTotal =
        getCartTotal();


    /* رسالة واتساب */

    const message =
`🛒 *طلب جديد من m/k-techno*

━━━━━━━━━━━━━━

📋 *رقم الطلب:*
${orderNumber}

👤 *بيانات العميل*

الاسم:
${name}

📞 رقم الهاتف:
${phone}

📧 البريد الإلكتروني:
${email || "غير مذكور"}

📍 العنوان:
${address}

━━━━━━━━━━━━━━

🛍️ *المنتجات المطلوبة*

${productsText}

━━━━━━━━━━━━━━

💰 *إجمالي الطلب:*
${formatPrice(grandTotal)}

💳 *طريقة الدفع:*
${payment}

📝 *الملاحظات:*
${notes || "لا توجد ملاحظات"}

━━━━━━━━━━━━━━

🤖 m/k-techno
شكراً لطلبك ❤️`;


    /* رابط واتساب */

    const whatsappURL =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(message);


    window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
    );
}


/* ================= CONTACT MESSAGE ================= */

function sendContact(event) {

    if (event) {
        event.preventDefault();
    }


    const name =
        getValue("contactName");

    const phone =
        getValue("contactPhone");

    const email =
        getValue("contactEmail");

    const message =
        getValue("contactMessage");


    if (!name || !phone || !message) {

        alert(
            "من فضلك أكمل البيانات المطلوبة."
        );

        return;
    }


    const text =
`📩 *رسالة جديدة إلى m/k-techno*

👤 الاسم:
${name}

📞 الهاتف:
${phone}

📧 البريد الإلكتروني:
${email || "غير مذكور"}

💬 الرسالة:
${message}`;


    const url =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(text);


    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );
}


/* ================= MESSAGE ================= */

function showMessage(message) {

    const oldMessage =
        document.querySelector(".cart-message");

    if (oldMessage) {
        oldMessage.remove();
    }


    const box =
        document.createElement("div");

    box.className =
        "cart-message";

    box.setAttribute("role", "status");

    box.textContent =
        message;

    document.body.appendChild(box);


    setTimeout(
        () => {
            if (box && box.parentNode) {
                box.remove();
            }
        },
        2500
    );
}


/* ================= START ================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();
        renderCart();
        renderCheckout();

    }
);