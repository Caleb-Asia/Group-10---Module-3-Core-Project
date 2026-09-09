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
        '$2b$10$rpER/5X.rQM3kOPaloqL5.9Oa.6ZQIk/1uLZ0Y9QVSh5XEskIhb56', 
        'standard', NOW());

-- Products
-- Adds the sample FoodBoxx products used for testing.
-- Covers every dietary tag from the brief (standard, vegan, halal, keto,
-- nut-free, gluten-free) so the diet filter can actually be tested properly.

INSERT INTO products (id, name, description, price, category, dietary_tags, image_url, is_active) 
VALUES 
(1, 'Starter Box', '3 meals + 3 snacks', 49.00, 'box', JSON_ARRAY('standard'), '/images/boxes/starter.jpg', TRUE),
(2, 'Standard Box', '5 meals + 5 snacks', 79.00, 'box', JSON_ARRAY('standard'), '/images/boxes/standard.jpg', TRUE),
(3, 'Premium Box', 'Premium selection', 99.00, 'box', JSON_ARRAY('standard'), '/images/boxes/premium.jpg', TRUE),
(4, 'Vegan Boost Box', 'Plant-based performance fuel', 79.00, 'box', JSON_ARRAY('vegan'), '/images/boxes/vegan.jpg', TRUE),
(5, 'Keto Fuel Box', 'Low-carb keto meals', 89.00, 'box', JSON_ARRAY('keto'), '/images/boxes/keto.jpg', TRUE),
(6, 'Nut-Free Safety Box', 'Safe for nut allergies', 69.00, 'box', JSON_ARRAY('nut-free'), '/images/boxes/nutfree.jpg', TRUE),
(7, 'Monthly Snack Box', 'Recurring snack subscription', 199.00, 'box', JSON_ARRAY('standard'), '/images/boxes/snack.jpg', TRUE),
(8, 'Exam Week Survival Box', 'Fuel for exams', 99.00, 'box', JSON_ARRAY('standard'), '/images/boxes/exam.jpg', TRUE),

-- added these two so halal and gluten-free actually have something to return
(11, 'Halal Fuel Box', 'Halal-certified performance fuel', 79.00, 'box', JSON_ARRAY('halal'), '/images/boxes/halal.jpg', TRUE),
(12, 'Gluten-Free Box', 'Gluten-free performance fuel', 79.00, 'box', JSON_ARRAY('gluten-free'), '/images/boxes/glutenfree.jpg', TRUE),

(9, 'Builder Meal', 'Custom meal item', 25.00, 'meal', JSON_ARRAY('standard'), '/images/items/meal.jpg', TRUE),
(10, 'Builder Snack', 'Custom snack item', 12.00, 'snack', JSON_ARRAY('standard'), '/images/items/snack.jpg', TRUE);
