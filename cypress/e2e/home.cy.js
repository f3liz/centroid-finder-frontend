describe('Home Page', () => {
  beforeEach(() => {
    // Mock the /videos API so the Videos page does not crash in CI
    cy.intercept('GET', 'http://localhost:3000/videos', {
      statusCode: 200,
      body: ["sample1.mp4", "sample2.mp4"] // simple mock list
    }).as('getVideos');

    // Mock the /jobs endpoint so Jobs page doesn't throw errors
    cy.intercept('GET', 'http://localhost:3000/jobs', {
      statusCode: 200,
      body: []
    }).as('getJobs');

    // Visit the homepage after setting up mocks
    cy.visit('http://localhost:3001');
  });

  // Checking that all three navbar links are displaying
  it('should display navbar links', () => {
    cy.get('[data-testid="nav-home"]').should('exist');
    cy.get('[data-testid="nav-videos"]').should('exist');
    cy.get('[data-testid="nav-jobs"]').should('exist');
  });

  // Checking that the videos navbar link goes to /videos
  it('should navigate to Videos page', () => {
    cy.get('[data-testid="nav-videos"]').click();
    cy.url().should('include', '/videos');
  });

  // Checking that the jobs navbar link goes to /jobs
  it('should navigate to Jobs page', () => {
    cy.get('[data-testid="nav-jobs"]').click();
    cy.url().should('include', '/jobs');
  });

  // Checking that the home navbar link goes to /
  it('should navigate back to Home page', () => {
    cy.get('[data-testid="nav-home"]').click();
    cy.url().should('include', '/');
  });
});
