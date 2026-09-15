/* Purpose: Resets and seeds the FoodBoxx database with demo data | Module: database | Owner: Michaela | Created: 08 Sep 2026 */

-- Select Database
-- Tells MySQL to use the foodboxx database.
USE foodboxx;

-- Clear existing data for fresh testing
-- Deleting in this order so we don't break foreign key constraints
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM subscriptions;
DELETE FROM products;
DELETE FROM users;

-- Demo User
-- Creates a demo account for testing login and authentication.
-- Password: Demo123! (hashed with bcryptjs, cost 10 - generated once with:
-- node -e "console.log(require('bcryptjs').hashSync('Demo123!', 10))")

INSERT INTO users (id, name, email, password_hash, dietary_preferences, created_at) 
VALUES (1, 'Demo User', 'demo@foodboxx.co.za', 
        '$2b$10$KK7dm1HpP6WCiXC8ws.P7eghEtTyfrYdS4XZjwsIBU4Z1aOr2fROy',
        'standard', NOW());

-- Products
-- Adds the sample FoodBoxx products used for testing.
-- Covers every dietary tag from the brief (standard, vegan, halal, keto,
-- nut-free, gluten-free) so the diet filter can actually be tested properly.

INSERT INTO products (id, name, description, price, category, dietary_tags, image_url, is_active) 
VALUES 
(1, 'Starter Box', '3 meals + 3 snacks', 49.00, 'box', JSON_ARRAY('standard'), '/images/starter-box.png', TRUE),
(2, 'Standard Box', '5 meals + 5 snacks', 79.00, 'box', JSON_ARRAY('standard'), '/images/standard-box.png', TRUE),
(3, 'Premium Box', 'Premium selection', 99.00, 'box', JSON_ARRAY('standard'), '/images/premium-box.png', TRUE),
(4, 'Vegan Boost Box', 'Plant-based performance fuel', 79.00, 'box', JSON_ARRAY('vegan'), '/images/vegan-box.png', TRUE),
(5, 'Keto Fuel Box', 'Low-carb keto meals', 89.00, 'box', JSON_ARRAY('keto'), '/images/keto-box.png', TRUE),
(6, 'Nut-Free Safety Box', 'Safe for nut allergies', 69.00, 'box', JSON_ARRAY('nut-free'), '/images/nut-free-box.png', TRUE),
(7, 'Monthly Snack Box', 'Recurring snack subscription', 199.00, 'box', JSON_ARRAY('standard'), '/images/snack-box.png', TRUE),
(8, 'Exam Week Survival Box', 'Fuel for exams', 99.00, 'box', JSON_ARRAY('standard'), '/images/exam-box1.png', TRUE),

-- added these two so halal and gluten-free actually have something to return
(11, 'Halal Fuel Box', 'Halal-certified performance fuel', 79.00, 'box', JSON_ARRAY('halal'), '/images/halaal-box.png', TRUE),
(12, 'Gluten-Free Box', 'Gluten-free performance fuel', 79.00, 'box', JSON_ARRAY('gluten-free'), '/images/gluten-free.png', TRUE),

(9, 'Builder Meal', 'Custom meal item', 25.00, 'meal', JSON_ARRAY('standard'), '/images/builder-meal.png', TRUE),
(10, 'Builder Snack', 'Custom snack item', 12.00, 'snack', JSON_ARRAY('standard'), '/images/builder-snack.png', TRUE),
(13, 'Power Rice Bowl', 'Builder meal', 25.00, 'meal', JSON_ARRAY('standard'), '/images/power-rice-bowl.png', TRUE),
(14, 'Lean Steak & Greens', 'Builder meal', 25.00, 'meal', JSON_ARRAY('standard'), '/images/lean-steak-greens.png', TRUE),
(15, 'Harvest Veggie Curry', 'Builder meal', 25.00, 'meal', JSON_ARRAY('standard'), '/images/harvest-curry.png', TRUE),
(16, 'Grilled Chicken Meal', 'Builder meal', 25.00, 'meal', JSON_ARRAY('standard'), '/images/builder-meal.png', TRUE),
(17, 'Dark Choc Almonds', 'Builder snack', 12.00, 'snack', JSON_ARRAY('standard'), '/images/dark-choc-almonds.png', TRUE),
(18, 'Apple Cinnamon Bites', 'Builder snack', 12.00, 'snack', JSON_ARRAY('standard'), '/images/apple-cinnamon-bites.png', TRUE),
(19, 'Pretzel Sticks', 'Builder snack', 12.00, 'snack', JSON_ARRAY('standard'), '/images/pretzel-sticks.png', TRUE),
(20, 'Protein Balls', 'Builder snack', 12.00, 'snack', JSON_ARRAY('standard'), '/images/builder-snack.png', TRUE),
(21, 'Builder Snack Mix', 'Builder snack', 12.00, 'snack', JSON_ARRAY('standard'), '/images/builder-snack.png', TRUE);
