-- FOODBOXX DATABASE SEED FILE
-- Purpose: This file resets the existing FoodBoxx data and inserts sample/demo data for testing the application.

-- Select Database
-- Tells MySQL to use the foodboxx database.
USE foodboxx;

-- Clear existing data for fresh testing
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM subscriptions;
DELETE FROM products;
DELETE FROM users;

-- Demo User
-- Creates a demo account for testing login and authentication.
-- Password: Demo123!

INSERT INTO users (id, name, email, password_hash, dietary_preferences, created_at) 
VALUES (1, 'Demo User', 'demo@foodboxx.co.za', 
        '$2a$10$N9qo8uLOickgx2ZMRZo5i.U7AEF7v5K2c5k1pY1Y1f1Q9z6Fz5l2a', 
        'standard', NOW());

-- Products
-- Adds the sample FoodBoxx products used for testing.
-- Includes standard, dietary, subscription and custom builder options.

INSERT INTO products (id, name, description, price, category, dietary_tags, image_url, is_active) 
VALUES 
(1, 'Starter Box', '3 meals + 3 snacks', 49.00, 'box', JSON_ARRAY('standard'), '/assets/boxes/starter.jpg', TRUE), 
(2, 'Standard Box', '5 meals + 5 snacks', 79.00, 'box', JSON_ARRAY('standard'), '/assets/boxes/standard.jpg', TRUE), 
(3, 'Premium Box', 'Premium selection', 99.00, 'box', JSON_ARRAY('standard'), '/assets/boxes/premium.jpg', TRUE), 
(4, 'Vegan Boost Box', 'Plant-based performance fuel', 79.00, 'box', JSON_ARRAY('vegan'), '/assets/boxes/vegan.jpg', TRUE), 
(5, 'Keto Fuel Box', 'Low-carb keto meals', 89.00, 'box', JSON_ARRAY('keto'), '/assets/boxes/keto.jpg', TRUE), 
(6, 'Nut-Free Safety Box', 'Safe for nut allergies', 69.00, 'box', JSON_ARRAY('nut-free'), '/assets/boxes/nutfree.jpg', TRUE), 
(7, 'Monthly Snack Box', 'Recurring snack subscription', 199.00, 'box', JSON_ARRAY('standard'), '/assets/boxes/snack.jpg', TRUE), 
(8, 'Exam Week Survival Box', 'Fuel for exams', 99.00, 'box', JSON_ARRAY('standard'), '/assets/boxes/exam.jpg', TRUE), 
(9, 'Builder Meal', 'Custom meal item', 25.00, 'meal', JSON_ARRAY('standard'), '/assets/items/meal.jpg', TRUE), 
(10, 'Builder Snack', 'Custom snack item', 12.00, 'snack', JSON_ARRAY('standard'), '/assets/items/snack.jpg', TRUE);