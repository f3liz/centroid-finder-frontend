describe('Preview Page', () => {
  beforeEach(() => {
    // Mocking the GET request to /thumbnail/ensantina.mp4
    cy.intercept('GET', 'http://localhost:3000/thumbnail/ensantina.mp4', {
      statusCode: 200,
      headers: { 'content-type': 'image/png' },
      body: new Blob(['fake-thumbnail-image'], { type: 'image/png' })
    }).as('getThumbnail'); // Saving the mock data as 'getThumbnail'

    // Visiting the page after setting up the intercept
    cy.visit('http://localhost:3001/preview/ensantina.mp4');

    // Waiting for the API call to finish before running tests
    cy.wait('@getThumbnail');
  });

  it('should display the filename and preview sections', () => {
    // Checking the filename is displayed correctly
    cy.contains('Preview').should('exist');
    cy.contains('Video being previewed:').should('exist');
    cy.contains('ensantina.mp4').should('exist');

    // Checking that both the preview areas show up on the page
    cy.contains('Original Frame').should('exist');
    cy.contains('Binarized Preview').should('exist');

    // Checking the thumbnail image and canvas both render
    cy.get('img').should('have.attr', 'src').and('include', 'blob:');
    cy.get('canvas').should('exist');
  });

  it('should start a job and show status when process button is clicked', () => {
    // Mocking the POST request to /process/ensantina.mp4
    cy.intercept('POST', 'http://localhost:3000/process/ensantina.mp4*', {
      statusCode: 200,
      body: { jobId: 'f1a1fac2-ab7f-4e10-9b09-e9ecb27a94b6' }
    }).as('startJob'); // Saving the mock data as 'startJob'

    // Mocking the GET request to /process/jobId/status to check job status
    cy.intercept(
      'GET',
      'http://localhost:3000/process/f1a1fac2-ab7f-4e10-9b09-e9ecb27a94b6/status',
      {
        statusCode: 200,
        body: {
          jobId: 'f1a1fac2-ab7f-4e10-9b09-e9ecb27a94b6',
          status: 'done',
          result: '/f1a1fac2-ab7f-4e10-9b09-e9ecb27a94b6/result.csv'
        }
      }
    ).as('getJobStatus'); // Saving the mock data as 'getJobStatus'

    // Clicking the process button to trigger the job
    cy.contains('Start Processing').click();

    // Making sure the job starts and polling completes
    cy.wait('@startJob');
    cy.wait('@getJobStatus');

    // Checking the job status shows "Done!" with a download link
    cy.contains('Done!').should('exist');

    // Updated: UI text says "Click here to download result.csv"
    cy.contains('Click here to download result.csv').should('exist');

    // Making sure the download link points to the correct result file
    cy.contains('a', 'download result.csv')
      .should('have.attr', 'href')
      .and('include', 'f1a1fac2-ab7f-4e10-9b09-e9ecb27a94b6/result.csv');
  });
});
