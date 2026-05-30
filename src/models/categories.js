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

const assignCategoryToProject = async(categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
}

const updateCategoryAssignments = async(projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}

const createCategory = async (name) => {
    const result = await db.query(
        'INSERT INTO category (name) VALUES ($1) RETURNING category_id',
        [name]
    );
    return result.rows[0].category_id;
};

const updateCategory = async (categoryId, name) => {
    const result = await db.query(
        'UPDATE category SET name = $1 WHERE category_id = $2 RETURNING category_id',
        [name, categoryId]
    );
    if (result.rows.length === 0) throw new Error('Category not found');
    return result.rows[0].category_id;
};

export {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
};