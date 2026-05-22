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

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          date
        FROM project
        WHERE organization_id = $1
        ORDER BY date;
    `;
    
    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

export { getAllProjects, getProjectsByOrganizationId };