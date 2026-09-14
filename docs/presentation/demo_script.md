# Demo Script — FoodBoxx Presentation

**Purpose:** Section-by-section presentation guide

**Module:** docs/presentation

**Owner:** Michaela

**Presentation:** 25 Sep, 11:30

**Maximum time:** 10 minutes

> **Important:** These are talking points, not something to read word-for-word. The goal is to sound natural and explain what we're doing while we demonstrate it.

# 1. Intro — Michaela

**Time: ±1 minute**

### Cover

* Introduce Group 10
* Introduce FoodBoxx
* Explain the problem
* Explain the solution
* Briefly explain the business model
* Hand over to Adam

### Talking points

> Good morning everyone. We’re Group 10, and our project is FoodBoxx.

>

> The problem we focused on is something a lot of university students can relate to. Students are busy with classes, studying and other responsibilities, so finding food that is both convenient and nutritious can sometimes be difficult.

>

> Our solution to this is FoodBoxx. FoodBoxx is a meal and snack box platform built around what we call Performance Fuel food that is designed to fit into a busy student’s lifestyle.

>

> Users have the flexibility to either purchase a box as a once-off order, subscribe to a box, or build their own custom box based on what they want.

>

> We also included campus pickup pods, which makes collecting your order more convenient.

>

> And with that, I’ll hand over to Adam to quickly explain the technology behind FoodBoxx.

# 2. Tech Stack + Architecture — Adam

**Time: ±1 minute**

### Cover

* Vue 3
* Bootstrap 5
* Node.js + Express
* MVC architecture
* MySQL
* Five required tables
* JWT + bcrypt
* Simulated payment gateway

### Talking points

> For the frontend, we're using Vue 3 with Bootstrap 5, while the backend is built using Node.js and Express.

>

> We structured the backend using MVC and connected it to a MySQL database using the five tables required by the brief.

>

> For authentication, we use JWT and bcrypt. Passwords are hashed rather than stored as plain text, and JWT is used to manage authenticated sessions.

>

> Our payment gateway is simulated, as required by the brief. Even though the payment isn't connected to a real bank, we've still implemented the payment and transaction flow so that successful and failed payments are handled correctly.

>

> Caleb is going to take us through the main user journey now.

# 3. Live Demo — Caleb

**Time: ±3–3.5 minutes**

### Opening

> We'll now show the main FoodBoxx journey, starting with creating an account and ending with placing an order and managing a subscription.

## 3.1 Register / Login

**Caleb**

### Show

* Registration
* Validation
* Login
* SweetAlert2 feedback

### Talking point

> Users can create an account and log in. We've also added validation throughout the application, with user-friendly feedback instead of browser alert popups.

## 3.2 Home Page

**Sisamila — ±10 seconds**

### Show

* Homepage
* Main branding
* Value proposition

### Talking point

> The homepage introduces the FoodBoxx concept and gives users a quick way to start exploring the available boxes.

**Hand back to Caleb.**

## 3.3 Menu + Filters

**Caleb**

### Show

* Product list
* Search
* Dietary filters

### Filters

* Vegan
* Halal
* Keto
* Nut-free
* Gluten-free

### Talking point

> From the menu, users can search for products or filter them based on their dietary preferences.

**Demonstrate one or two filters rather than every filter.**

## 3.4 Custom Box Builder

**Caleb**

### Show

* Select meals
* Select snacks
* Running total

### Talking point

> Users can also build their own box by selecting meals and snacks. The total updates as they make their choices.

**Show the total changing live.**

## 3.5 Cart

**Caleb**

### Show

* Cart items
* Quantity changes
* One-off/subscription option

### Talking point

> Once the user has selected their products, they can review their cart, change quantities, and choose whether they're making a once-off purchase or starting a subscription.

## 3.6 Checkout

**Caleb**

### Show

* Pickup pod selection
* Dietary preference confirmation
* Simulated payment

### Talking point

> At checkout, the user selects their pickup pod and confirms their dietary preferences before completing the simulated payment.

### Important

Use an approved successful payment card.

**Do not use the declined `0002` card here. Save it for the backend demonstration.**

## 3.7 Order Confirmation

**Caleb**

### Show

* Successful order
* QR code

### Talking point

> Once the payment is successful, the order is confirmed and a unique QR code is generated for collection.

## 3.8 Dashboard / Subscription

**Caleb**

### Show

* Subscription
* Pause
* Skip
* Resume
* Cancel
* Loyalty progress

### Talking point

> From the dashboard, users can manage their subscription by pausing, skipping, resuming or cancelling it. They can also see their loyalty progress.

# 4. Backend + Security — Adam

**Time: ±1 minute**

### Cover

* Failed payment
* Transaction rollback
* JWT
* bcrypt
* QR token

### Talking points

> We also wanted to demonstrate what happens when something goes wrong, rather than only showing the successful path.

>

> Here we're using the declined payment test card. The payment fails, and importantly, the order isn't created.

>

> This demonstrates our transaction handling. If the payment fails, the database changes are rolled back instead of leaving us with an unpaid order.

>

> We also use bcrypt to hash passwords and JWT for authentication.

>

> Finally, each successful order receives a unique, cryptographically random QR token which can be used for pickup.

### Show

* Postman or terminal
* Declined payment
* Failure response
* Database showing no unwanted order

---

# 5. QA + Testing — Michaela

**Time: ±1 minute**

### Cover

* Backend endpoint testing
* Validation
* Error handling
* Browser testing
* Responsive/device testing
* Retesting after fixes
* One real testing result if available

### Talking points

> Once the main functionality was in place, I focused on testing the application and making sure that the different parts worked together properly.

>

> For the backend, we tested our API endpoints using Postman, including successful requests, validation and different error cases.

>

> We also tested the frontend across different browsers and screen sizes, including desktop, tablet and mobile, to make sure the application remained responsive.

>

> Another important part of our testing was retesting after fixes. Whenever we found and fixed an issue, we tested that area again to make sure the fix worked and that it hadn't affected another part of the application.

>

> We also kept track of the issues we found, fixed them, and retested the affected flows before the final version.

### Add an actual result if available

> We tested **[X] endpoints**, and after our final fixes **[Y]% passed**.

**Only use real numbers.**

### Add a real example if available

> One issue we found during testing was **[actual issue]**. We fixed it and then retested the affected flow to make sure everything was working correctly.

# 6. Additional Pages + Design — Sisamila

**Time: ±1 minute**

### Cover

* Home page
* Pickup pods
* Orders/history
* Reorder
* Profile
* Dietary preferences
* Design consistency

### Talking points

> Outside of the main ordering journey, we also built a few supporting pages to make the application feel more complete.

>

> The pickup pods page gives users information about where they can collect their orders.

>

> Users can also view their order history and reorder previous purchases.

>

> The profile section allows users to manage their account and dietary preferences.

>

> We also focused on keeping the design consistent across the different pages and screen sizes.

# 7. Closing — Michaela

**Time: ±30 seconds**

### Talking points

> Overall, FoodBoxx is designed to give students a convenient way to access meals and snacks that fit their needs, while still giving them the flexibility to either order once, subscribe, or build their own box.

>

> Thank you for listening. We’re happy to take any questions.
