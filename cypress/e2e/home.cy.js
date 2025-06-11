describe('Home Page', () => {
  beforeEach(() => {
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