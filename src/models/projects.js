import db from './db.js';

async function getAllProjects() {
    try {
        const result = await db.query(`
            SELECT 
                project.project_id,
                project.title,
                project.description,
                project.location,
                project.date,
                organization.name AS organization_name
            FROM project
            JOIN organization ON project.organization_id = organization.organization_id
            ORDER BY project.date ASC
        `);
        return result.rows;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
}

export { getAllProjects };