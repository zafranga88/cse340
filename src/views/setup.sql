-- Organization Table
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    description     TEXT        NOT NULL,
    contact_email   VARCHAR(255) NOT NULL,
    logo_filename   VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- Project Table
CREATE TABLE project (
    project_id      SERIAL PRIMARY KEY,
    organization_id INT NOT NULL REFERENCES organization(organization_id),
    title           VARCHAR(255) NOT NULL,
    description     TEXT NOT NULL,
    location        VARCHAR(255) NOT NULL,
    date            DATE NOT NULL
);

INSERT INTO project (organization_id, title, description, location, date)
VALUES
(1, 'Community Garden Build', 'Build raised garden beds for the local community center.', 'Downtown Community Center', '2026-06-01'),
(1, 'School Playground Repair', 'Repair and repaint playground equipment at Lincoln Elementary.', 'Lincoln Elementary School', '2026-06-15'),
(1, 'Homeless Shelter Renovation', 'Renovate the main hall of the local homeless shelter.', 'City Homeless Shelter', '2026-07-04'),
(1, 'Park Bench Installation', 'Install new benches throughout Riverside Park.', 'Riverside Park', '2026-07-20'),
(1, 'Library Mural Project', 'Paint a community mural on the exterior of the public library.', 'Public Library', '2026-08-10'),
(2, 'Urban Farm Planting Day', 'Plant seasonal vegetables at the urban farm.', 'Eastside Urban Farm', '2026-06-05'),
(2, 'Composting Workshop', 'Teach community members how to compost at home.', 'Neighborhood Community Hall', '2026-06-22'),
(2, 'Farmers Market Volunteer', 'Help set up and run the weekly farmers market.', 'Central Farmers Market', '2026-07-12'),
(2, 'School Garden Education', 'Teach kids about growing food at the school garden.', 'Jefferson Middle School', '2026-07-28'),
(2, 'Harvest Festival Prep', 'Prepare and organize the annual harvest festival.', 'City Park Pavilion', '2026-09-01'),
(3, 'Food Bank Sort & Pack', 'Sort and pack donated food items at the local food bank.', 'Westside Food Bank', '2026-06-08'),
(3, 'Senior Center Visit', 'Spend time with seniors and assist with activities.', 'Sunset Senior Center', '2026-06-25'),
(3, 'Clothing Drive', 'Collect and sort donated clothing for families in need.', 'Unity Community Church', '2026-07-10'),
(3, 'Neighborhood Cleanup', 'Pick up litter and beautify the Northside neighborhood.', 'Northside Neighborhood', '2026-07-30'),
(3, 'Back to School Supply Drive', 'Collect and distribute school supplies to local students.', 'Downtown Community Center', '2026-08-20');

-- Category Table
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name        VARCHAR(150) NOT NULL
);

INSERT INTO category (name)
VALUES
('Construction & Renovation'),
('Environment & Sustainability'),
('Food & Hunger'),
('Education & Youth'),
('Community Support');

-- Project-Category Junction Table
CREATE TABLE project_category (
    project_id  INT NOT NULL REFERENCES project(project_id),
    category_id INT NOT NULL REFERENCES category(category_id),
    PRIMARY KEY (project_id, category_id)
);

INSERT INTO project_category (project_id, category_id)
VALUES
(1, 1), (1, 2),
(2, 1), (2, 4),
(3, 1), (3, 5),
(4, 1), (4, 2),
(5, 1), (5, 4),
(6, 2), (6, 3),
(7, 2), (7, 4),
(8, 3), (8, 5),
(9, 3), (9, 4),
(10, 2), (10, 3),
(11, 3), (11, 5),
(12, 4), (12, 5),
(13, 5),
(14, 2), (14, 5),
(15, 4), (15, 5);

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

INSERT INTO roles (role_name, role_description) VALUES 
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

UPDATE users SET role_id = (SELECT role_id FROM roles WHERE role_name = 'admin') WHERE email = 'admin@example.com';