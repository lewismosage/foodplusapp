function addToCart(restaurantName, itemName, price) {
    cart.push({ restaurantName, itemName, price });
    updateCart();
    document.getElementById('cart').scrollIntoView({ behavior: 'smooth' });
}

function addExtrasToCart() {
    // Check which extras are selected
    const extraHam = document.getElementById('extra-ham');
    const extraSpicy = document.getElementById('extra-spicy');
    const extraEggs = document.getElementById('extra-eggs');

    // Add selected extras to the cart
    if (extraHam.checked) {
        cart.push({ restaurantName: 'Extras', itemName: 'More Ham', price: 350.00 });
    }
    if (extraSpicy.checked) {
        cart.push({ restaurantName: 'Extras', itemName: 'Spicy', price: 50.00 });
    }
    if (extraEggs.checked) {
        cart.push({ restaurantName: 'Extras', itemName: 'Add Eggs', price: 50.00 });
    }

    updateCart();  // Update the cart display
    document.getElementById('cart').scrollIntoView({ behavior: 'smooth' });
}

function updateCart() {
    const cartContainer = document.getElementById('cart-items');
    const totalAmount = document.getElementById('total-amount');
    cartContainer.innerHTML = ''; // Clear existing items

    let total = 0;

    cart.forEach((item, index) => {
        const cartDiv = document.createElement('div');
        cartDiv.className = 'cart-item';
        cartDiv.innerHTML = `
            <p>${item.itemName} - Ksh ${item.price.toFixed(2)}
                <button onclick="removeFromCart(${index})" style="color:red; cursor:pointer;">(X)</button>
            </p>
        `;
        cartContainer.appendChild(cartDiv);
        total += item.price;
    });

    totalAmount.innerText = total.toFixed(2);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function goToCheckout() {
    document.getElementById('payment-section').style.display = 'block';
    document.getElementById('cart').style.display = 'none'; // Hide the cart
}
//Mpesa update payment//
function updatePaymentTotal() {
    // Get the total amount from the cart
    const cartTotalElement = document.getElementById('total-amount');
    const totalAmount = cartTotalElement.textContent;

    // Set the total amount in the Mpesa payment section
    const mpesaTotalElement = document.getElementById('total-amount-mpesa');
    mpesaTotalElement.textContent = totalAmount;
}
function goToCheckout() {
    // Hide the cart section and show the payment section
    document.getElementById('cart').style.display = 'none';
    document.getElementById('payment-section').style.display = 'block';
    
    // Update the payment total
    updatePaymentTotal();
}