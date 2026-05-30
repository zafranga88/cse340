// Import any needed model functions
import { getAllCategories, getCategoryById, getProjectsByCategoryId, updateCategoryAssignments, createCategory, updateCategory } from '../models/categories.js';
import { getProjectDetails, getCategoriesByProjectId } from '../models/projects.js';
import { body, validationResult } from 'express-validator';


// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;

    const category = await getCategoryById(categoryId);

    const projects = await getProjectsByCategoryId(categoryId);

    res.render('category', {
        title: category.name,
        category,
        projects
    });
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    
    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

const categoryValidation = [
    body('name').trim().notEmpty().withMessage('Category name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters')
];

const showNewCategoryForm = async (req, res) => {
    res.render('new-category', { title: 'Add New Category' });
};

const processNewCategoryForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(e => req.flash('error', e.msg));
        return res.redirect('/new-category');
    }
    const categoryId = await createCategory(req.body.name);
    req.flash('success', 'Category created successfully!');
    res.redirect(`/category/${categoryId}`);
};

const showEditCategoryForm = async (req, res) => {
    const category = await getCategoryById(req.params.id);
    res.render('edit-category', { title: 'Edit Category', category });
};

const processEditCategoryForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(e => req.flash('error', e.msg));
        return res.redirect(`/edit-category/${req.params.id}`);
    }
    await updateCategory(req.params.id, req.body.name);
    req.flash('success', 'Category updated successfully!');
    res.redirect(`/category/${req.params.id}`);
};

// Export any controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
};