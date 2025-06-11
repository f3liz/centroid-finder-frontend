describe('Jobs Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001/jobs');
  });

  it('should display a table with job data', () => {
    // Checking the table headers
    cy.contains('Job ID').should('exist');
    cy.contains('Video').should('exist');
    cy.contains('Color').should('exist');
    cy.contains('Threshold').should('exist');
    cy.contains('Status').should('exist');
    cy.contains('Result').should('exist');

    // Checking for at least one job row
    cy.get('[data-testid="job-row"]').should('have.length.at.least', 1);
  });

  it('should show a download link for completed jobs', () => {
    // Checking if any job row includes a download link
    cy.get('[data-testid="job-download-link"]')
      .should('have.length.at.least', 1)
      .first()
      .should('have.attr', 'href')
      .and('include', '.csv');
  });

  // it('should show "-" when job is not done', () => {
  //   // Checking that some jobs show a dash (non-downloadable)
  //   cy.get('[data-testid="job-no-download"]').should('exist');
  // });
});