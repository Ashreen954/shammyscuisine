const cartItemsElement = document.getElementById("cart-items");
const totalBillElement = document.getElementById("total-bill");
const cartBadge = document.querySelector(".cart-badge");
const cartHeading = document.querySelector('h2');

let totalBill = 0;

// Function to update the cart count displayed on the badge
function updateCartCount() {
    // Filter keys to exclude non-cart items like "cartCount" and "language"
    const cartCount = Object.keys(localStorage).filter(key => {
        // Check that the key is not "cartCount" or "language" and the value is a valid JSON object
        if (key === "cartCount" || key === "language") return false;

        try {
            const value = JSON.parse(localStorage.getItem(key));
            // Further check that the value has cart-specific properties like "quantity"
            return value && typeof value.quantity === "number";
        } catch (e) {
            return false; // Exclude keys with invalid JSON
        }
    }).length;

    // Update the cart badge if it exists
    if (cartBadge) {
        cartBadge.textContent = cartCount; // Update cart count in badge
    }
    // Save updated count in localStorage
    localStorage.setItem("cartCount", cartCount); 
    console.log(`Updated Cart Count: ${cartCount}`);
}


// Function to update total bill
function updateTotalBill() {
    totalBill = 0;
    const rows = cartItemsElement.querySelectorAll("tr");
    rows.forEach((row) => {
        const itemTotal = parseFloat(
            row.querySelector(".item-total").textContent.replace("€", "")
        );
        totalBill += itemTotal;
    });
    totalBillElement.textContent = `Total: €${totalBill.toFixed(2)}`;
}

// Get the items order array
const itemsOrder = JSON.parse(localStorage.getItem("itemsOrder")) || [];

function checkAndDisplayEmptyCartMessage() {
    if (itemsOrder.length === 0) {

        cartHeading.textContent = 'Your cart is empty';
        cartHeading.style.textAlign = 'center';
        
        // Hide the cart table and total bill
        document.querySelector('table').style.display = 'none';
        totalBillElement.style.display = 'none';
        
        // Show empty cart message
        cartItemsElement.innerHTML = `<tr><td colspan="6" class="text-center">Your cart is empty</td></tr>`;
    } else {
        // Show the table and total bill again if there are items
        document.querySelector('table').style.display = 'table';
        totalBillElement.style.display = 'block';
    }
}
// Iterate through the itemsOrder array
itemsOrder.forEach((key) => {
    const itemData = JSON.parse(localStorage.getItem(key));
    if (itemData) {
        const row = document.createElement("tr");
        const itemTotal = itemData.quantity * itemData.price;
        const minOrder = itemData.minOrder || 1; // Default to 1 if not set

        row.innerHTML = `
            <td><img src="${itemData.imageUrl}" alt="${key}" style="width: 50px; height: 50px; object-fit: cover;"></td>
            <td>${key}</td>
            <td>
                <div class="quantity-container">
                    <div>
                        <button class="decrement btn btn-sm btn-danger">-</button>
                        <span class="quantity">${itemData.quantity}</span>
                        <button class="increment btn btn-sm btn-success">+</button>
                    </div>
                    <p class="min-order-message">Minimum order quantity is ${minOrder}</p>
                </div>
            </td>
            <td>€${itemData.price}</td>
            <td class="item-total">€${itemTotal.toFixed(2)}</td>
            <td><button class="delete-item btn btn-sm btn-danger">Delete</button></td>
        `;
// Get the min order message and quantity elements
            const minOrderMessage = row.querySelector(".min-order-message");
            const quantityElement = row.querySelector(".quantity");

            // Add event listeners for the increment, decrement, and delete buttons
            const decrementButton = row.querySelector(".decrement");
            const incrementButton = row.querySelector(".increment");
            const deleteButton = row.querySelector(".delete-item");
        // (Event listeners for decrement, increment, and delete buttons remain unchanged)
        // Decrement quantity
        decrementButton.addEventListener("click", () => {
            let quantity = parseInt(quantityElement.textContent); // Parse current quantity from UI.

            if (quantity > minOrder) {
                quantity--;
                quantityElement.textContent = quantity; // Update the UI.
                itemData.quantity = quantity; // Update the item data.
                localStorage.setItem(key, JSON.stringify(itemData)); // Persist the updated quantity.

                // Update item total and total bill.
                row.querySelector(".item-total").textContent = `€${(itemData.quantity * itemData.price).toFixed(2)}`;
                updateTotalBill();

                // Show or hide the minOrderMessage based on the quantity
                if (quantity < minOrder) {
                    minOrderMessage.style.display = "block";
                } else {
                    minOrderMessage.style.display = "none";
                }
            } else {
                quantityElement.textContent = minOrder;
                itemData.quantity = minOrder;
                localStorage.setItem(key, JSON.stringify(itemData));
                minOrderMessage.style.display = "block";
            }
        });

        // Increment quantity
        incrementButton.addEventListener("click", () => {
            let quantity = parseInt(quantityElement.textContent);
            quantity++;
            quantityElement.textContent = quantity;
            itemData.quantity = quantity;
            localStorage.setItem(key, JSON.stringify(itemData));
            row.querySelector(".item-total").textContent = `€${(itemData.quantity * itemData.price).toFixed(2)}`;
            updateTotalBill();
            minOrderMessage.style.display = "none";
        });

        // Delete item from cart
        // Delete item from cart
        deleteButton.addEventListener("click", () => {
            // Remove the item from localStorage
            localStorage.removeItem(key);
        
            // Update the global itemsOrder array by filtering out the deleted item
            const updatedItemsOrder = itemsOrder.filter(item => item !== key);
            localStorage.setItem("itemsOrder", JSON.stringify(updatedItemsOrder));
        
            // Update the global itemsOrder to reflect the change
            itemsOrder.length = 0; // Clear the array in place
            itemsOrder.push(...updatedItemsOrder); // Push the updated items back
        
            // Remove the row from the table
            row.remove();
        
            // Update total bill, cart count, and empty cart message
            updateTotalBill();
            updateCartCount();
            checkAndDisplayEmptyCartMessage();
        });
        

        // Append row to the table
        cartItemsElement.appendChild(row);
        totalBill += itemTotal;
    }
});


// Update the total bill and cart count on page load
checkAndDisplayEmptyCartMessage()
updateTotalBill();
updateCartCount(); // Update the cart count when the page loads
