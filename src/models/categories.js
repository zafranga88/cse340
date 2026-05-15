import db from './db.js';

async function getAllCategories() {
    try {
        const result = await db.query(`
            SELECT * FROM category
            ORDER BY name ASC
        `);
        return result.rows;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

export { getAllCategories };