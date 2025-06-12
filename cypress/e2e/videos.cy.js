// Local testing without mock data:

// describe('Videos Page', () => {
//   beforeEach(() => {
//     cy.visit('http://localhost:3001/videos');
//   });

//   it('should show list of available videos', () => {
//     cy.contains('Available Videos').should('exist');

//     // Checking that at least one video link is rendered
//     cy.get('[data-testid="video-link"]').should('have.length.at.least', 1);

//     // Specifically checking for a file named "ensantina.mp4" in the list of videos
//     cy.get('[data-filename="ensantina.mp4"]').should('exist');
//   });

//   // Checking that clicking "ensantina.mp4" goes to the correct preview route
//   it('should navigate to preview page when ensantina.mp4 is clicked', () => {
//     cy.get('[data-filename="ensantina.mp4"]').click();
//     cy.url().should('include', '/preview/ensantina.mp4');
//   });
// });

describe('Videos Page', () => {
  beforeEach(() => {
    // Mocking the GET request for /api/videos and getting the videos
    cy.intercept('GET', 'http://localhost:3000/api/videos', {
      statusCode: 200,
      body: ['ensantina.mp4', 'salamander.mp4'],
    }).as('getVideos'); // Saving the mock data as 'getVideos'

    // Visiting the page after setting up the intercept
    cy.visit('http://localhost:3001/videos');

    // Waiting for the API call to finish before running tests
    cy.wait('@getVideos');
  });

  it('should show list of available videos', () => {
    cy.contains('Available Videos').should('exist');

    // Checking that the mocked data is rendered correctly on the page
    cy.get('[data-testid="video-link"]').should('have.length', 2);
    cy.get('[data-filename="ensantina.mp4"]').should('exist');
    cy.get('[data-filename="salamander.mp4"]').should('exist');
  });

  // Checking that clicking "salamnder.mp4" goes to the correct preview route
  it('should navigate to preview page when ensantina.mp4 is clicked', () => {
    cy.get('[data-filename="salamander.mp4"]').click();
    cy.url().should('include', '/preview/salamander.mp4');
  });
});