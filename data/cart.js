export let cart = JSON.parse(localStorage.getItem("cart"));

if (!cart) {
  cart = [
    {
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 2,
    },
    {
      productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity: 1,
    },
  ];
}
function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
export function addToCart(productId) {
  let matchingItem;
  const quantitySelector = document.querySelector(
    `.js-quantity-selector-${productId}`
  );

  const quantity = Number(quantitySelector.value);
  cart.forEach((item) => {
    if (productId === item.productId) {
      matchingItem = item;
    }
  });
  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
    });
  }
  saveToStorage();
}

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;
  saveToStorage();
}

export function calculateCartQunatity() {
  let cartQuantity = 0;

  cart.forEach((item) => {
    cartQuantity = cartQuantity + item.quantity;
  });

  const homeCartQuantity = document.querySelector(".js-cart-quantity");
  if (homeCartQuantity) {
    homeCartQuantity.innerHTML = cartQuantity;
  }
  const checkoutQuantity = document.querySelector(".js-checkout-header");
  if (checkoutQuantity) {
    checkoutQuantity.innerHTML = `(${cartQuantity}) Items`;
  }
  // const quantityLabel = document.querySelector(".js-quantity-label");
  // if (quantityLabel) {
  //   quantityLabel.innerHTML = cartQuantity;
  // }
}

export function updateQuantity(productId, newQuantity) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      matchingItem = cartItem;
    }
  });
  // if (newQuantity <= 0) {
  //   removeFromCart(productId);
  // }
  matchingItem.quantity = newQuantity;
  saveToStorage();
  // calculateCartQunatity();
}
