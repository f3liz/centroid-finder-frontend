describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001');
  });

  it('should display navbar links', () => {
    cy.get('[data-testid="nav-home"]').should('exist');
    cy.get('[data-testid="nav-videos"]').should('exist');
    cy.get('[data-testid="nav-jobs"]').should('exist');
  });

  it('should navigate to Videos page', () => {
    cy.get('[data-testid="nav-videos"]').click();
    cy.url().should('include', '/videos');
  });

  it('should navigate to Jobs page', () => {
    cy.get('[data-testid="nav-jobs"]').click();
    cy.url().should('include', '/jobs');
  });

  it('should navigate back to Home page', () => {
    cy.get('[data-testid="nav-home"]').click();
    cy.url().should('include', '/');
  });
});