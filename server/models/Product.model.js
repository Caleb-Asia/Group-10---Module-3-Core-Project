/*
  Purpose: Product data-access queries | Module: models
  Owner: Michaela | Created: 9 Sep 2026
  Notes: Uses parameterised SQL for product catalogue, filtering, and box-builder item retrieval.
*/

const db = require('../config/db');

const findAll = async ({ diet, search } = {}) => {
  let sql = `
    SELECT id, name, description, price, category, dietary_tags, image_url, is_active
    FROM products
    WHERE is_active = 1`;
  const params = [];

  // Append optional filters with explicit SQL spacing.
  if (diet) {
    sql += ` AND JSON_CONTAINS(dietary_tags, ?)`;
    params.push(JSON.stringify(diet));
  }
  if (search) {
    sql += ` AND (name LIKE ? OR description LIKE ?)`;
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm);
  }

  // Keep catalogue results stable for the frontend.
  sql += ` ORDER BY id ASC`;
  const [rows] = await db.execute(sql, params);
  return rows;
};

const findById = async id => {
  const [rows] = await db.execute(
    `SELECT id, name, description, price, category, dietary_tags, image_url, is_active
     FROM products
     WHERE id = ? AND is_active = 1
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};

const findBuilderItems = async () => {
  // Only individual meals and snacks can be used by the box builder.
  const [rows] = await db.execute(
    `SELECT id, name, description, price, category, dietary_tags, image_url, is_active
     FROM products
     WHERE is_active = 1 AND category IN (?, ?)
     ORDER BY category ASC, id ASC`,
    ['meal', 'snack']
  );
  return rows;
};

module.exports = { findAll, findById, findBuilderItems };
