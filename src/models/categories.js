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

async function getCategoryById(id) {
    const query = `
        SELECT
            category_id,
            name
        FROM category
        WHERE category_id = $1;
    `;

    const result = await db.query(query, [id]);

    return result.rows.length > 0 ? result.rows[0] : null;
}

async function getProjectsByCategoryId(categoryId) {
    const query = `
        SELECT
            project.project_id,
            project.title
        FROM project
        JOIN project_category
            ON project.project_id = project_category.project_id
        WHERE project_category.category_id = $1
        ORDER BY project.date ASC;
    `;

    const result = await db.query(query, [categoryId]);

    return result.rows;
}

export {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId
};