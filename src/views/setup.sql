-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    description     TEXT        NOT NULL,
    contact_email   VARCHAR(255) NOT NULL,
    logo_filename   VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);

-- ========================================
-- Service Projects Table
-- ========================================
CREATE TABLE project (
    project_id      SERIAL PRIMARY KEY,
    organization_id INT NOT NULL REFERENCES organization(organization_id),
    title           VARCHAR(255) NOT NULL,
    description     TEXT NOT NULL,
    location        VARCHAR(255) NOT NULL,
    date            DATE NOT NULL
);

-- ========================================
-- Insert sample data: Service Projects
-- ========================================
INSERT INTO project (organization_id, title, description, location, date)
VALUES
-- BrightFuture Builders (org 1)
(1, 'Community Garden Build', 'Build raised garden beds for the local community center.', 'Downtown Community Center', '2025-06-01'),
(1, 'School Playground Repair', 'Repair and repaint playground equipment at Lincoln Elementary.', 'Lincoln Elementary School', '2025-06-15'),
(1, 'Homeless Shelter Renovation', 'Renovate the main hall of the local homeless shelter.', 'City Homeless Shelter', '2025-07-04'),
(1, 'Park Bench Installation', 'Install new benches throughout Riverside Park.', 'Riverside Park', '2025-07-20'),
(1, 'Library Mural Project', 'Paint a community mural on the exterior of the public library.', 'Public Library', '2025-08-10'),

-- GreenHarvest Growers (org 2)
(2, 'Urban Farm Planting Day', 'Plant seasonal vegetables at the urban farm.', 'Eastside Urban Farm', '2025-06-05'),
(2, 'Composting Workshop', 'Teach community members how to compost at home.', 'Neighborhood Community Hall', '2025-06-22'),
(2, 'Farmers Market Volunteer', 'Help set up and run the weekly farmers market.', 'Central Farmers Market', '2025-07-12'),
(2, 'School Garden Education', 'Teach kids about growing food at the school garden.', 'Jefferson Middle School', '2025-07-28'),
(2, 'Harvest Festival Prep', 'Prepare and organize the annual harvest festival.', 'City Park Pavilion', '2025-09-01'),

-- UnityServe Volunteers (org 3)
(3, 'Food Bank Sort & Pack', 'Sort and pack donated food items at the local food bank.', 'Westside Food Bank', '2025-06-08'),
(3, 'Senior Center Visit', 'Spend time with seniors and assist with activities.', 'Sunset Senior Center', '2025-06-25'),
(3, 'Clothing Drive', 'Collect and sort donated clothing for families in need.', 'Unity Community Church', '2025-07-10'),
(3, 'Neighborhood Cleanup', 'Pick up litter and beautify the Northside neighborhood.', 'Northside Neighborhood', '2025-07-30'),
(3, 'Back to School Supply Drive', 'Collect and distribute school supplies to local students.', 'Downtown Community Center', '2025-08-20');