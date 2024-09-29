let orderStatus = ["Order Placed", "Preparing", "Out for Delivery", "Delivered"];
let statusIndex = 0;
let cart = [];

window.onload = function () {
    loadRestaurants();
    loadRecommended();
    updateCart();
    setupPaymentForm();
    setupReviewForm();
};

function loadRestaurants() {
    const restaurantContainer = document.getElementById('restaurants');
    const reviewSelect = document.getElementById('restaurant-select');
    restaurantContainer.innerHTML = '';
    reviewSelect.innerHTML = '';

    const restaurants = [
        { name: "Burger Palace", items: [{ name: "Cheese Burger", price: 599 }, { name: "Chicken Burger", price: 649 }] },
        { name: "Pizza World", items: [{ name: "Pepperoni Pizza", price: 999 }, { name: "Veggie Pizza", price: 849 }] },
        { name: "KFC", items: [{ name: "Fried Chicken", price: 799 }, { name: "Fries", price: 299 }, { name: "Zinger Burger", price: 549 }] },
        { name: "Nairobi Street Kitchen", items: [{ name: "Butter Chicken Samosa", price: 999 }, { name: "Lobster Roll", price: 849 }, { name: "Chicken shawarma", price: 500 }] }
    ];

    restaurants.forEach((restaurant, index) => {
        const restaurantDiv = document.createElement('div');
        let className = '';

        switch (restaurant.name) {
            case "Burger Palace":
                className = 'burger-palace';
                break;
            case "Pizza World":
                className = 'pizza-world';
                break;
            case "KFC":
                className = 'kfc';
                break;
            case "Nairobi Street Kitchen":
                className = 'nairobi-street-kitchen';
                break;
            default:
                className = 'restaurant-default';
        }
        
        restaurantDiv.className = 'restaurant ' + className;
        restaurantDiv.innerHTML = `<h3>${restaurant.name}</h3>`;
        
        restaurant.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                <p>${item.name} - Ksh ${item.price.toFixed(2)}</p>
                <button onclick="addToCart('${restaurant.name}', '${item.name}', ${item.price})">Order Now</button>
            `;
            restaurantDiv.appendChild(itemDiv);
        });
        
        restaurantContainer.appendChild(restaurantDiv);
        
        const option = document.createElement('option');
        option.value = index;
        option.text = restaurant.name;
        reviewSelect.appendChild(option);
    });
}

function loadRecommended() {
    const recommendedContainer = document.getElementById('recommended');
    const recommendedItems = [
        { name: "Spicy Nachos", price: 499 },
        { name: "Caesar Salad", price: 749 },
        { name: "Chocolate Cake", price: 399 }
    ];

    const discountPercentage = 10; // 10% discount
    const totalPrice = recommendedItems.reduce((sum, item) => sum + item.price, 0);
    const discountedPrice = totalPrice * (1 - discountPercentage / 100);

    const containerDiv = document.createElement('div');
    containerDiv.className = 'recommended-package';
    containerDiv.innerHTML = `
        <h3>Special Recommended Package</h3>
        <p>Original Price: Ksh ${totalPrice.toFixed(2)}</p>
        <p>Discount: ${discountPercentage}%</p>
        <p>Discounted Price: Ksh ${discountedPrice.toFixed(2)}</p>
        <button onclick="addToCart('Package', 'Recommended Package', ${discountedPrice.toFixed(2)})">Order Now</button>
    `;

    const itemsListDiv = document.createElement('div');
    itemsListDiv.className = 'recommended-items';

    recommendedItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `
            <p>${item.name} - Ksh ${item.price.toFixed(2)}</p>
        `;
        itemsListDiv.appendChild(itemDiv);
    });

    containerDiv.appendChild(itemsListDiv);
    recommendedContainer.appendChild(containerDiv);
}

function addToCart(restaurantName, itemName, price) {
    cart.push({ restaurantName, itemName, price });
    updateCart();
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

function setupPaymentForm() {
    const mpesaPaymentForm = document.getElementById('payment-form-mpesa');
    
    mpesaPaymentForm.addEventListener('submit', function (event) {
        event.preventDefault();
        
        // SweetAlert2 Confirmation Popup
        Swal.fire({
            icon: 'success',
            title: 'Mpesa Payment Submitted!',
            text: 'Your payment has been submitted successfully! Download your receipt.',
            confirmButtonText: 'OK'
        }).then(() => {
            // Hide payment section and show tracking section
            document.getElementById('payment-section').style.display = 'none';
            document.getElementById('tracking-section').style.display = 'block';
            
            // Call the order tracking function
            startOrderTracking();
        });
    });
}

/*
function setupPaymentForm() {
    const mpesaPaymentForm = document.getElementById('payment-form-mpesa');
      mpesaPaymentForm.addEventListener('submit', function (event) {
        event.preventDefault();
        alert('Mpesa Payment Submitted! Download Receipt'); 
        document.getElementById('payment-section').style.display = 'none';
        document.getElementById('tracking-section').style.display = 'block';
        startOrderTracking();
    });
}
    */
function startOrderTracking() {
    const orderStatusDisplay = document.getElementById('order-status').getElementsByTagName('span')[0];
    const interval = setInterval(() => {
        statusIndex++;
        if (statusIndex < orderStatus.length) {
            orderStatusDisplay.innerText = orderStatus[statusIndex];
        }
        if (orderStatus[statusIndex] === "Delivered") {
            clearInterval(interval);
            document.getElementById('tracking-section').style.display = 'none';
            document.getElementById('reviews-section').style.display = 'block';
        }
    }, 5000); // Update every 5 seconds
}

function setupReviewForm() {
    const reviewForm = document.getElementById('review-form');
    reviewForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const restaurantIndex = document.getElementById('restaurant-select').value;
        const rating = document.getElementById('review-rating').value;
        const reviewText = document.getElementById('review-text').value;

        if (reviewText.length < 10) {
            alert("Your review must be at least 10 characters long.");
            return;
        }

      //  alert('Review submitted!');//
        reviewForm.reset(); // Clear the form after submission
        displayReviews(restaurantIndex);
    });
}


document.getElementById('review-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const restaurant = document.getElementById('restaurant-select').value;
    const rating = document.getElementById('review-rating').value;
    const reviewText = document.getElementById('review-text').value;

    if (restaurant && rating && reviewText) {
        Swal.fire({
            icon: 'success',
            title: 'Thank you for your review!',
            text: `Your review for has been submitted.`,
            confirmButtonText: 'OK'
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Incomplete Review',
            text: 'Please make sure all fields are filled out before submitting your review.',
            confirmButtonText: 'OK'
        });
    }
});





function displayReviews(restaurantIndex) {
    const reviewsDisplay = document.getElementById('reviews-display');
    reviewsDisplay.innerHTML = '';

    // Example reviews //
    const reviews = [
        { rating: 5, text: "Great food!" },
        { rating: 4, text: "Good service." }
    ];

    reviews.forEach(review => {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'review-item';
        reviewDiv.innerHTML = `
            <p><strong>Rating:</strong> <span class="rating">${'★'.repeat(review.rating)}</span></p>
            <p>${review.text}</p>
        `;
        reviewsDisplay.appendChild(reviewDiv);
    });
}

// Drop Us A Message //
function dropUs() {
    Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: 'Your message has been successfully sent.',
        confirmButtonText: 'OK'
    });
}
function addExtrasToCart() {
    alert('Extras added to cart!');
}
