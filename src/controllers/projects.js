// Import any needed model functions
import { getUpcomingProjects, getProjectDetails, getCategoriesByProjectId, createProject, updateProject } from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';
import { isVolunteer } from '../models/users.js';

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
}

const processNewProjectForm = async (req, res) => {
    // Extract form data from req.body
    const { title, description, location, date, organizationId } = req.body;

    try {
        // Create the new project in the database
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
}

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    const categories = await getCategoriesByProjectId(projectId);
    const title = project.title;

    let volunteerStatus = false;
    if (req.session && req.session.user) {
        volunteerStatus = await isVolunteer(req.session.user.user_id, projectId);
    }

    res.render('project', {
        title,
        project,
        categories,
        isVolunteer: volunteerStatus
    });
};

const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();
    const title = 'Edit Service Project';
    res.render('edit-project', { title, project, organizations });
};

const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const { title, description, location, date, organizationId } = req.body;
    await updateProject(projectId, title, description, location, date, organizationId);
    req.flash('success', 'Project updated successfully!');
    res.redirect(`/project/${projectId}`);
};

export {
    showProjectsPage,
    showProjectDetailsPage,
    projectValidation,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm
};