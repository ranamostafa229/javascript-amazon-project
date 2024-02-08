import {
  cart,
  removeFromCart,
  calculateCartQunatity,
  updateQuantity,
  updateDeliveryOption,
} from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import {
  calculateDeliveryDate,
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import isSatSun from "../utils/day.js";
import { renderCheckoutHeader } from "./checkoutHeader.js";

export function renderOrderSummary() {
  // combine all HTML together
  let cartSummaryHtml = "";

  // (2) Generate the HTML
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const deliveryOptionId = cartItem.deliveryOptionId;

    const matchingProduct = getProduct(productId);
    const deliveryOption = getDeliveryOption(deliveryOptionId);
    const dayString = calculateDeliveryDate(deliveryOption);

    cartSummaryHtml += `
      <div class="cart-item-container js-cart-item-container-${
        matchingProduct.id
      }">
          <div class="delivery-date">
          Delivery date: ${dayString}
          </div>
  
          <div class="cart-item-details-grid">
          <img class="product-image"
              src="${matchingProduct.image}">
  
          <div class="cart-item-details">
              <div class="product-name">
              ${matchingProduct.name}
              </div>
              <div class="product-price">
              $ ${formatCurrency(matchingProduct.priceCents)}
              </div>
              <div class="product-quantity">
              <span>
                  Quantity: <span class="quantity-label js-quantity-label-${
                    matchingProduct.id
                  }">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${
                matchingProduct.id
              }">
                  Update
              </span>
              <input class="quantity-input js-quantity-input-${
                matchingProduct.id
              }" >
              <span class="save-quantity-link link-primary js-save-quantity-link " data-product-id="${
                matchingProduct.id
              }">
                Save
              </span>
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${
                matchingProduct.id
              }">
                  Delete
              </span>
              </div>
          </div>
  
          <div class="delivery-options">
              <div class="delivery-options-title">
              Choose a delivery option:
              </div>
              ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
          </div>
       </div>
      `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = "";
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
      const dayString = deliveryDate.format("dddd, MMMM D");
      const priceCents = deliveryOption.priceCents;
      const priceString =
        priceCents === 0
          ? "FREE Shipping"
          : `$${formatCurrency(priceCents)} - Shipping`;

      const isChecked = cartItem.deliveryOptionId === deliveryOption.id;
      html += `
      <div class="delivery-option js-delivery-option"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${deliveryOption.id}"
      >
        <input type="radio"
            ${isChecked ? "checked" : ""}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
        <div>
            <div class="delivery-option-date">
            ${dayString}
            </div>
            <div class="delivery-option-price">
            ${priceString}
            </div>
        </div>
      </div>
      `;
    });
    return html;
  }

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHtml;

  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);

      // remove the cart item
      // By using DOM
      /* const container = document.querySelector(
         `.js-cart-item-container-${productId}`
       );
       container.remove();
      */
      // [OR] By Regenrate the html for the order summary
      renderOrderSummary();
      // when the remove item update cart quantity
      calculateCartQunatity();
      // when delete item update payment summary
      renderPaymentSummary();
      renderCheckoutHeader();
    });
  });

  // make update button interactive
  document.querySelectorAll(".js-update-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      console.log(productId);
      const cartContainer = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      cartContainer.classList.add("is-editing-quantity");
    });
  });

  document.querySelectorAll(".js-save-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const cartContainer = document.querySelector(
        `.js-cart-item-container-${productId}`
      );

      const quantityInput = document.querySelector(
        `.js-quantity-input-${productId}`
      );
      const newQuantity = Number(quantityInput.value);
      if (newQuantity <= 0 || newQuantity >= 1000) {
        alert("Quantity must be at least 1 and less than 1000");
        return;
      }
      updateQuantity(productId, newQuantity);
      const quantityLabel = document.querySelector(
        `.js-quantity-label-${productId}`
      );
      quantityLabel.innerHTML = newQuantity;
      // calculateCartQunatity();
      renderOrderSummary();
      renderPaymentSummary();
      renderCheckoutHeader();
      cartContainer.classList.remove("is-editing-quantity");
    });
  });
  // when the page load update cart quantity
  calculateCartQunatity();

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      // when change delivery option update payment summary
      renderPaymentSummary();
    });
  });

  //
  let day = dayjs();
  const dayafter = day.add(5, "days");
  const dayString = dayafter.format("MMMM D");
  console.log(dayString);

  const monthafter = day.add(1, "months");
  const monthString = monthafter.format("MMMM D");
  console.log(monthString);

  const monthbefore = day.subtract(1, "months");
  const monthbeforeString = monthbefore.format("MMMM D");
  console.log(monthbeforeString);

  const date = day.format("dddd");
  console.log(date);

  console.log(isSatSun(day));
  // document.querySelector(".js-delivery-date").innerHTML = dayString;
}
