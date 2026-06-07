import db from './db.js'
import bcrypt from 'bcrypt';

const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
    const queryParams = [name, email, passwordHash, default_role];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    return result.rows[0].user_id;
};

const findUserByEmail = async (email) => {
    const query = `
        SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1
    `;
    const result = await db.query(query, [email]);
    if (result.rows.length === 0) return null;
    return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);
    if (!user) return null;

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) return null;

    delete user.password_hash;
    return user;
};

const getAllUsers = async () => {
    const query = `
        SELECT u.user_id, u.name, u.email, r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        ORDER BY u.user_id
    `;
    const result = await db.query(query);
    return result.rows;
};

const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO volunteer (user_id, project_id) 
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
    `;
    await db.query(query, [userId, projectId]);
};

const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM volunteer 
        WHERE user_id = $1 AND project_id = $2
    `;
    await db.query(query, [userId, projectId]);
};

const getVolunteerProjects = async (userId) => {
    const query = `
        SELECT p.project_id, p.title, p.date, p.location
        FROM project p
        JOIN volunteer v ON p.project_id = v.project_id
        WHERE v.user_id = $1
        ORDER BY p.date
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

const isVolunteer = async (userId, projectId) => {
    const query = `
        SELECT 1 FROM volunteer 
        WHERE user_id = $1 AND project_id = $2
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};

export { createUser, authenticateUser, getAllUsers, addVolunteer, removeVolunteer, getVolunteerProjects, isVolunteer };