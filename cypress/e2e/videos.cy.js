describe('Videos Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001/videos');
  });

  it('should show list of available videos', () => {
    cy.contains('Available Videos:').should('exist');

    // Checking that at least one video link is rendered
    cy.get('[data-testid="video-link"]').should('have.length.at.least', 1);

    // Specifically checking for a file named "ensantina.mp4" in the list of videos
    cy.get('[data-filename="ensantina.mp4"]').should('exist');
  });

  // Checking that clicking "enstantina.mp4" goes to the correct preview route
  it('should navigate to preview page when ensatina.mp4 is clicked', () => {
    cy.get('[data-filename="ensantina.mp4"]').click();
    cy.url().should('include', '/preview/ensantina.mp4');
  });
});
