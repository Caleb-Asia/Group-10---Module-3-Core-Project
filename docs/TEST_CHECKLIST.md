# FoodBoxx QA Run Sheet

**QA Lead:** Michaela
**Testing dates:** 15–16 September 2026
**Rehearsal:** 16 September 2026
**Final demo:** 17 September 2026

**Key:** ✅ Passed | ❌ Failed | ⬜ Not tested

---

# 1. API Checks

## 🔐 Login & Registration

* ✅ Register with correct details
* ✅ Register with missing details
* ✅ Register with an existing email
* ✅ Login with correct details
* ✅ Login with wrong password
* ✅ Login with an email that doesn't exist
* ✅ JWT is returned after login
* ✅ `/auth/me` works with a valid token
* ✅ `/auth/me` rejects requests without a token
* ✅ Profile/dietary preferences can be updated

## 🍱 Products

* ✅ Get all products
* ✅ Vegan filter works
* ✅ Halal filter works
* ✅ Keto filter works
* ✅ Nut-free filter works
* ✅ Gluten-free filter works
* ✅ Search works
* ✅ Search + filter works together
* ✅ Inactive products don't appear
* ✅ Builder items load correctly
* ✅ Product details load correctly
* ✅ Invalid product ID gives 404

## 🛒 Orders

* ✅ Normal order can be created
* ✅ Approved payment creates the order
* ✅ Declined `0002` payment does NOT create an order
* ✅ Failed payment rolls back correctly
* ✅ Custom Box order works
* ✅ Correct items are saved
* ✅ Correct total is saved
* ✅ Order history loads
* ✅ User with no orders gets an empty list
* ✅ Individual order can be viewed
* ✅ Invalid order ID gives 404
* ✅ QR code/token is generated
* ✅ QR tokens are unique

## 🔄 Subscriptions

* ✅ Create subscription
* ✅ Pause subscription
* ✅ Resume subscription
* ✅ Skip a week
* ✅ Cancel subscription
* ✅ Loyalty/free box logic works

## 💳 Payments

* ✅ Approved payment works
* ✅ Declined `0002` payment works
* ✅ Transaction reference is returned
* ✅ Missing card details are rejected
* ✅ Incorrect card details are rejected

---

# 2. Security Checks

* ✅ Protected routes reject requests without a token
* ✅ Expired tokens are rejected
* ✅ User cannot access another user's orders
* ✅ Passwords are stored as bcrypt hashes
* ✅ SQL injection attempts are rejected
* ✅ No hardcoded passwords/API keys/secrets
* ✅ `.env` is not exposed

---

# 3. Website Test

### Full User Journey

**Register → Login → Menu → Search/Filter → Builder → Cart → Subscription → Checkout → Pickup Pod → Payment → QR → Dashboard**

## 🖥️ Desktop

### Chrome

* ✅ Register
* ✅ Login
* ✅ Menu + filters
* ✅ Builder
* ✅ Cart
* ✅ Checkout
* ✅ Payment
* ✅ QR confirmation
* ✅ Dashboard

### Firefox

* ✅ Full journey works

### Safari

* ✅ Full journey works

### Edge

* ✅ Full journey works

---

# 📱 Mobile / Tablet

### Phone — 375px

* ✅ Layout fits properly
* ✅ No horizontal scrolling
* ✅ Menu works
* ✅ Builder works
* ✅ Cart works
* ✅ Checkout works
* ✅ QR displays properly

### iPhone / Safari

* ✅ Full journey works

### Tablet

* ✅ Layout works
* ✅ Full journey works

### iPad / Safari

* ✅ Full journey works

---

# 4. Quick Website Checks

* ✅ No browser `alert()` / `confirm()` / `prompt()`
* ✅ SweetAlert2 works where needed
* ✅ Cart badge updates correctly
* ✅ Empty cart displays properly
* ✅ Vue routes work
* ✅ Buttons/links work
* ✅ Images load
* ✅ No major console errors
* ✅ Website looks good at 375px
* ✅ API errors don't crash the page
* ✅ Colours/design match the mockup

---

# 5. Final QA Check

* ✅ API tests completed
* ✅ Security tests completed
* ✅ Website journey works
* ✅ Mobile checked
* ✅ Desktop checked
* ✅ Payment tested
* ✅ QR tested
* ✅ Subscription tested
* ✅ Major issues resolved
* ✅ Postman evidence ready
* ✅ Screenshots ready
* ✅ Backup demo recording ready

---

# ⭐ Final QA Summary

**QA Status:** ✅ Complete

**Main user journey:** ✅ Passed

**Backend/API:** ✅ Passed

**Authentication & Security:** ✅ Passed

**Payments:** ✅ Passed

**Subscriptions:** ✅ Passed

**QR functionality:** ✅ Passed

**Desktop & Mobile:** ✅ Passed

**Presentation backup:** ✅ Ready

**Final result:** FoodBoxx is ready for rehearsal and presentation.
