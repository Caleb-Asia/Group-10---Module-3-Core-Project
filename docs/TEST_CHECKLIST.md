# FoodBoxx QA Run Sheet

**QA Lead:** Michaela
**Testing dates:** 21–22 September 2026
**Rehearsal:** 23 September 2026
**Final demo:** 25 September 2026

**Key:** ✅ Passed | ❌ Failed | ⬜ Not tested

---

## 1. API Checks

### 🔐 Login & Registration

* ⬜ Register with correct details
* ⬜ Register with missing details
* ⬜ Register with an existing email
* ⬜ Login with correct details
* ⬜ Login with wrong password
* ⬜ Login with an email that doesn't exist
* ⬜ Check JWT is returned after login
* ⬜ Check `/auth/me` with a valid token
* ⬜ Check `/auth/me` without a token
* ⬜ Update profile/dietary preferences

## **Problems / Notes:**

*

---

### 🍱 Products

* ⬜ Get all products
* ⬜ Vegan filter works
* ⬜ Halal filter works
* ⬜ Keto filter works
* ⬜ Nut-free filter works
* ⬜ Gluten-free filter works
* ⬜ Search works
* ⬜ Search + filter works together
* ⬜ Inactive products don't appear
* ⬜ Builder items load correctly
* ⬜ Product details load correctly
* ⬜ Invalid product ID gives 404

## **Problems / Notes:**

*

---

### 🛒 Orders

* ⬜ Normal order can be created
* ⬜ Approved payment creates the order
* ⬜ Declined `0002` payment does NOT create an order
* ⬜ Failed payment rolls back correctly
* ⬜ Custom Box order works
* ⬜ Correct items are saved
* ⬜ Correct total is saved
* ⬜ Order history loads
* ⬜ User with no orders gets an empty list
* ⬜ Individual order can be viewed
* ⬜ Invalid order ID gives 404

## **Problems / Notes:**

*

---

### 🔄 Subscriptions

* ⬜ Create subscription
* ⬜ Pause subscription
* ⬜ Resume subscription
* ⬜ Skip a week
* ⬜ Cancel subscription
* ⬜ Loyalty/free box logic works

## **Problems / Notes:**

*

---

### 💳 Payments

* ⬜ Approved payment works
* ⬜ Declined `0002` payment works
* ⬜ Transaction reference is returned
* ⬜ Missing card details are rejected
* ⬜ Incorrect card details are rejected

## **Problems / Notes:**

*

---

## 2. Security Checks

* ⬜ Protected routes reject requests without a token
* ⬜ Expired tokens are rejected
* ⬜ User cannot access another user's orders
* ⬜ Passwords are stored as bcrypt hashes
* ⬜ SQL injection attempt doesn't bypass login/search
* ⬜ No hardcoded passwords/API keys/secrets
* ⬜ `.env` is not exposed

## **Problems / Notes:**

*

---

# 3. Website Test

Run the full journey:

**Register → Login → Menu → Builder → Cart → Checkout → Payment → Confirmation → Dashboard**

### 🖥️ Desktop

**Chrome**

* ⬜ Register
* ⬜ Login
* ⬜ Menu + filters
* ⬜ Builder
* ⬜ Cart
* ⬜ Checkout
* ⬜ Payment
* ⬜ Order confirmation
* ⬜ Dashboard

**Firefox**

* ⬜ Full journey works

**Safari**

* ⬜ Full journey works

**Edge**

* ⬜ Full journey works

---

### 📱 Mobile / Tablet

**Phone — 375px**

* ⬜ Layout fits properly
* ⬜ No horizontal scrolling
* ⬜ Menu works
* ⬜ Builder works
* ⬜ Cart works
* ⬜ Checkout works
* ⬜ Order confirmation displays properly

**iPhone / Safari**

* ⬜ Full journey works

**Tablet**

* ⬜ Layout works
* ⬜ Full journey works

**iPad / Safari**

* ⬜ Full journey works

---

# 4. Quick Website Checks

* ⬜ No browser `alert()` / `confirm()` / `prompt()`
* ⬜ SweetAlert2 works where needed
* ⬜ Cart badge updates correctly
* ⬜ Empty cart displays properly
* ⬜ Vue routes work
* ⬜ Buttons/links work
* ⬜ Images load
* ⬜ No major console errors
* ⬜ Website still looks good at 375px
* ⬜ API error doesn't crash the page
* ⬜ Colours/design match the mockup

---

# 5. Bugs I Find

| Problem | Who needs to fix it? | Fixed? |
| ------- | -------------------- | ------ |
|         |                      | ⬜      |
|         |                      | ⬜      |
|         |                      | ⬜      |
|         |                      | ⬜      |
|         |                      | ⬜      |

---

# 6. Things to Retest

After the team fixes something, I'll test it again here.

| What was fixed? | Retested? | Result |
| --------------- | --------- | ------ |
|                 | ⬜         |        |
|                 | ⬜         |        |
|                 | ⬜         |        |
|                 | ⬜         |        |

---

# 7. Final QA Check

Before rehearsal on **23 September**:

* ⬜ API tests done
* ⬜ Security tests done
* ⬜ Website journey works
* ⬜ Mobile checked
* ⬜ Desktop checked
* ⬜ Payment tested
* ⬜ Subscription tested
* ⬜ Major bugs fixed
* ⬜ Remaining bugs reported to the team
* ⬜ Postman evidence saved
* ⬜ Screenshots saved
* ⬜ Backup demo recording ready

### Final Notes

*
*
*
*
