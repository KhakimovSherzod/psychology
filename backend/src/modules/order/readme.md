# Order Module TODOs

This is a step-by-step list of features to implement for the `Order` aggregate root in a Udemy-like system.

---

## 1️⃣ Order Creation
- [+] TODO: Implement `createOrder(userId: number, items: OrderItem[]): Order`
- [+] TODO: Validate that each `OrderItem` references an existing playlist
- [+] TODO: Prevent duplicate playlists in the same order
- [+] TODO: Calculate total amount based on item prices
- [+] TODO: Set initial order status to `CREATED` and assign UUID

---

System / Internal APIs

Mark order paid

Expire order

Create enrollments


## 2️⃣ Order Item Management
- [ ] TODO: Implement `addItem(item: OrderItem)` method
- [ ] Prevent duplicate playlist items
- [ ] Ensure order is not already paid
- [ ] TODO: Implement `removeItem(playlistId: number)` method
- [ ] Only allow removal if order is unpaid
- [ ] TODO: Ensure price snapshot is stored in `OrderItem` when added

---

## 3️⃣ Order Status Management
- [ ] TODO: Implement `markAsPaid(paidAt?: Date)` method
  - [ ] Validate order is not already paid
  - [ ] Set `_status` to `PAID` and `_paidAt` timestamp
- [ ] TODO: Implement `cancel()` method
  - [ ] Cannot cancel if order is already paid
  - [ ] Set `_status` to `CANCELLED`
- [ ] TODO: Implement `expire()` method
  - [ ] Cannot expire if order is already paid
  - [ ] Set `_status` to `EXPIRED`
- [ ] TODO: Implement `setPendingPayment()` method
  - [ ] Set `_status` to `PENDING_PAYMENT` when payment is initiated

---

## 4️⃣ Payment Integration
- [ ] TODO: Accept updates from `Payment` module
  - [ ] Handle payment success/failure/refund
  - [ ] Update order status automatically after successful payment
- [ ] TODO: Validate that total payments do not exceed order total
- [ ] TODO: Allow multiple payments per order if partial payments are needed

---

## 5️⃣ Enrollment Triggering
- [ ] TODO: Trigger creation of `Enrollment` for each playlist after payment
  - [ ] Link enrollment to `user` and `order`
  - [ ] Set expiration date if applicable
  - [ ] Prevent duplicate enrollment

---

## 6️⃣ Discounts / Promotions (Optional)
- [ ] TODO: Apply coupon codes or discounts to items or total amount
- [ ] TODO: Recalculate total amount before payment

---

## 7️⃣ Business Rules & Invariants
- [ ] TODO: Ensure total amount always equals sum of item prices
- [ ] TODO: Prevent modification of items after order is paid
- [ ] TODO: Validate currency consistency
- [ ] TODO: Handle errors for duplicate playlists

---

## 8️⃣ Queries / Reporting
- [ ] TODO: Implement `totalAmount()` getter
- [ ] TODO: Implement `items()` getter returning defensive copy
- [ ] TODO: Implement `paidAt()` getter
- [ ] TODO: Implement `status()` getter
- [ ] TODO: Optional: reporting methods for admin dashboards

---

## Notes
- The `Order` aggregate root owns `OrderItem`s
- `Order` is responsible for enforcing business rules
- Payment processing, playlist content, and user authentication are **handled in separate modules**