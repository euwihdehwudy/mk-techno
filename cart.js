/* =====================================================
   m/k-techno
   نظام السلة والطلبات
   ===================================================== */


/* ================= SETTINGS ================= */

const WHATSAPP_NUMBER = "201017865201";

let cart =
    JSON.parse(
        localStorage.getItem("mkTechnoCart")
    ) || [];


/* ================= SAVE CART ================= */

function saveCart() {

    localStorage.setItem(
        "mkTechnoCart",
        JSON.stringify(cart)
    );

}


/* ================= ADD PRODUCT ================= */

function addToCart(name, price) {

    price = Number(price);

    const existingProduct =
        cart.find(
            item => item.name === name
        );

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({

            name: name,

            price: price,

            quantity: 1

        });

    }

    saveCart();

    updateCartCount();

    showMessage(
        "✅ تمت إضافة المنتج إلى السلة"
    );

}


/* ================= REMOVE PRODUCT ================= */

function removeFromCart(index) {

    if (
        index < 0 ||
        index >= cart.length
    ) {
        return;
    }

    cart.splice(index, 1);

    saveCart();

    renderCart();

    updateCartCount();

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
        document.getElementById(
            "cartCount"
        );

    if (cartCount) {

        cartCount.textContent =
            getCartItemsCount();

    }

}


/* ================= RENDER CART ================= */

function renderCart() {

    const container =
        document.getElementById(
            "cartItems"
        );

    const totalElement =
        document.getElementById(
            "cartTotal"
        );

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
                document.createElement(
                    "div"
                );


            row.className =
                "cart-row";


            row.innerHTML = `

                <div class="cart-info">

                    <h3>
                        ${escapeHTML(item.name)}
                    </h3>

                    <div class="cart-price">

                        ${Number(
                            item.price
                        ).toLocaleString()}

                        ج.م

                    </div>

                </div>


                <div class="quantity">

                    <button
                        type="button"
                        onclick="increaseQuantity(${index})">

                        +

                    </button>


                    <span>
                        ${item.quantity}
                    </span>


                    <button
                        type="button"
                        onclick="decreaseQuantity(${index})">

                        −

                    </button>

                </div>


                <strong>

                    ${itemTotal.toLocaleString()}

                    ج.م

                </strong>


                <button
                    type="button"
                    class="remove"
                    onclick="removeFromCart(${index})">

                    حذف

                </button>

            `;


            container.appendChild(row);

        }
    );


    if (totalElement) {

        totalElement.textContent =
            getCartTotal().toLocaleString();

    }

}


/* ================= CHECKOUT PRODUCTS ================= */

function renderCheckout() {

    const container =
        document.getElementById(
            "checkoutProducts"
        );

    const totalElement =
        document.getElementById(
            "checkoutTotal"
        );

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
            document.createElement(
                "div"
            );


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

                ${total.toLocaleString()}

                ج.م

            </strong>

        `;


        container.appendChild(row);

    });


    if (totalElement) {

        totalElement.textContent =
            getCartTotal().toLocaleString();

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

        alert(
            "اكتب اسم العميل."
        );

        return;

    }


    if (!phone) {

        alert(
            "اكتب رقم الهاتف."
        );

        return;

    }


    if (!address) {

        alert(
            "اكتب العنوان."
        );

        return;

    }


    if (!payment) {

        alert(
            "اختر طريقة الدفع."
        );

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

                `   السعر: ${total.toLocaleString()} ج.م\n\n`;

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
${grandTotal.toLocaleString()} ج.م

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
        encodeURIComponent(
            message
        );


    /*
       فتح واتساب
    */

    window.open(
        whatsappURL,
        "_blank"
    );

}


/* ================= GET INPUT VALUE ================= */

function getValue(id) {

    const element =
        document.getElementById(id);

    if (!element) {
        return "";
    }

    return element.value.trim();

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
        encodeURIComponent(
            text
        );


    window.open(
        url,
        "_blank"
    );

}


/* ================= MESSAGE ================= */

function showMessage(message) {

    const oldMessage =
        document.querySelector(
            ".cart-message"
        );


    if (oldMessage) {

        oldMessage.remove();

    }


    const box =
        document.createElement(
            "div"
        );


    box.className =
        "cart-message";


    box.textContent =
        message;


    document.body.appendChild(box);


    setTimeout(
        () => {

            if (box) {

                box.remove();

            }

        },

        2500
    );

}


/* ================= SECURITY ================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;

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