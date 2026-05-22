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

const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT
            project.project_id,
            project.title,
            project.description,
            project.date,
            project.location,
            project.organization_id,
            organization.name AS organization_name
        FROM project
        JOIN organization ON project.organization_id = organization.organization_id
        WHERE project.date >= CURRENT_DATE
        ORDER BY project.date ASC
        LIMIT $1;
    `;
    const result = await db.query(query, [number_of_projects]);
    return result.rows;
};

const getProjectDetails = async (id) => {
    const query = `
        SELECT
            project.project_id,
            project.title,
            project.description,
            project.date,
            project.location,
            project.organization_id,
            organization.name AS organization_name
        FROM project
        JOIN organization ON project.organization_id = organization.organization_id
        WHERE project.project_id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails };