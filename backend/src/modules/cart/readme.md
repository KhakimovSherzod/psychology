# Cart Module TODO

## Core Features

* [x] Create active cart for user
* [x] Add playlist to cart
* [x] Remove item from cart
* [x] Clear cart
* [x] Get current active cart
* [x] Prevent duplicate playlists in cart

---

## Cart Validation

* [ ] Prevent adding free playlists to cart
* [ ] Prevent adding already purchased playlists
* [ ] Validate playlist exists
* [ ] Validate playlist is published
* [ ] Validate playlist is not archived

---

## Pricing Logic

* [ ] Snapshot playlist price when added to cart
* [ ] Support currency (USD / UZS etc.)
* [ ] Prevent price change after adding to cart
* [ ] Recalculate cart total

---

## Discounts & Promotions

* [ ] Coupon codes
* [ ] Percentage discounts
* [ ] Fixed discounts
* [ ] Expiration date for coupons
* [ ] Apply discount to entire cart
* [ ] Apply discount to specific playlist

---

## Cart Expiration

* [ ] Expire carts after X days
* [ ] Automatically clean old carts
* [ ] Prevent checkout with expired cart

---

## Checkout Preparation

* [ ] Convert cart to order
* [ ] Lock cart during checkout
* [ ] Validate playlist availability again
* [ ] Validate price integrity before payment

---

## Payment Integration

* [ ] Create payment session
* [ ] Attach order to payment
* [ ] Handle payment success
* [ ] Handle payment failure
* [ ] Mark order as paid

---

## Security

* [ ] Prevent race conditions when adding items
* [ ] Prevent duplicate purchases
* [ ] Validate price from database only
* [ ] Prevent client-side price manipulation

---

## Cart APIs

### GET

* [x] `GET /cart` → get active cart
* [x] `GET /cart/total` → calculate total price

### POST

* [x] `POST /cart/items` → add playlist to cart
* [ ] `POST /cart/checkout` → convert cart to order
* [ ] `POST /cart/apply-coupon`

### DELETE

* [x] `DELETE /cart/items/:playlistId`
* [x] `DELETE /cart/clear`

---

## Performance

* [x] Add indexes for `cartId` and `playlistId`
* [ ] Optimize cart queries
* [ ] Cache playlist price if necessary

---

## Advanced Features (Optional)

* [ ] Save cart for guest users
* [ ] Merge guest cart with user cart on login
* [ ] Recommend playlists based on cart
* [ ] Bundle discounts (buy 3 get 20% off)

---

## Observability

* [ ] Cart event logging
* [ ] Track abandoned carts
* [ ] Metrics for cart conversion rate
