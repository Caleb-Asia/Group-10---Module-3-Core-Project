const db = require("../config/db");

// Gets all the active products
// Can also filter by diet or search for a product
const findAll = async ({ diet, search } = {}) => {
  let sql = `
    SELECT 
      id, 
      name, 
      description, 
      price, 
      category, 
      dietary_tags, 
      image_url, 
      is_active 
    FROM products 
    WHERE is_active = 1 
  `;

  const params = [];

  // If a diet is provided, only get products with that dietary tag
  if (diet) {
    sql += ` AND JSON_CONTAINS(dietary_tags, ?)`;
    params.push(JSON.stringify(diet));
  }

  // If a search is provided, search the name and description
  if (search) {
    sql += ` AND (name LIKE ? OR description LIKE ?)`;

    const searchTerm = `%${search}%`;

    params.push(searchTerm, searchTerm);
  }

  // Sort the products by their ID
  sql += ` ORDER BY id ASC`;

  const [rows] = await db.execute(sql, params);

  return rows;
};

// Gets one active product using its ID
const findById = async (id) => {
  const sql = `
    SELECT 
      id, 
      name, 
      description, 
      price, 
      category, 
      dietary_tags, 
      image_url, 
      is_active 
    FROM products 
    WHERE id = ? 
      AND is_active = 1 
    LIMIT 1 
  `;

  const [rows] = await db.execute(sql, [id]);

  // Return the product if it exists, otherwise return null
  return rows.length > 0 ? rows[0] : null;
};

// Gets the products that can be used in the box builder
// Only meals and snacks are included
const findBuilderItems = async () => {
  const sql = `
    SELECT 
      id, 
      name, 
      description, 
      price, 
      category, 
      dietary_tags, 
      image_url, 
      is_active 
    FROM products 
    WHERE is_active = 1 
      AND category IN (?, ?) 
    ORDER BY category ASC, id ASC 
  `;

  // Get products that are either meals or snacks
  const [rows] = await db.execute(sql, ["meal", "snack"]);

  return rows;
};

// Export the functions so they can be used in the controller
module.exports = {
  findAll,
  findById,
  findBuilderItems
};