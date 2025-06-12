// Local testing without mock data:

// describe('Jobs Page', () => {
//   beforeEach(() => {
//     cy.visit('http://localhost:3001/jobs');
//   });

//   it('should display a table with job data', () => {
//     // Checking the table headers
//     cy.contains('Job ID').should('exist');
//     cy.contains('Video').should('exist');
//     cy.contains('Color').should('exist');
//     cy.contains('Threshold').should('exist');
//     cy.contains('Status').should('exist');
//     cy.contains('Result').should('exist');

//     // Checking for at least one job row
//     cy.get('[data-testid="job-row"]').should('have.length.at.least', 1);
//   });

//   it('should show a download link for completed jobs', () => {
//     // Checking if any job row includes a download link
//     cy.get('[data-testid="job-download-link"]')
//       .should('have.length.at.least', 1)
//       .first()
//       .should('have.attr', 'href')
//       .and('include', '.csv');
//   });

//   // it('should show "-" when job is not done', () => {
//   //   // Checking that some jobs show a dash (non-downloadable)
//   //   cy.get('[data-testid="job-no-download"]').should('exist');
//   // });
// });

describe('Jobs Page', () => {
  beforeEach(() => {
    // Mocking the GET request to /jobs
    cy.intercept('GET', 'http://localhost:3000/jobs', {
      statusCode: 200,
      body: [
        {
          jobId: 'f1a1fac2-ab7f-4e10-9b09-e9ecb27a94b6',
          videoFileName: 'ensantina.mp4',
          targetColor: 'FF0000',
          threshold: 150,
          status: 'done',
          outputFileName: 'f1a1fac2-ab7f-4e10-9b09-e9ecb27a94b6/result.csv'
        },
        {
          jobId: 'd2f4af67-f192-409b-b197-c0c8f8b218c9',
          videoFileName: 'salamander.mp4',
          targetColor: '00FF00',
          threshold: 120,
          status: 'processing',
          outputFileName: 'd2f4af67-f192-409b-b197-c0c8f8b218c9/result.csv'
        }
      ]
    }).as('getJobs'); // Saving the mock data as 'getJobs'

    // Visiting the page after setting up the intercept
    cy.visit('http://localhost:3001/jobs');

    // Waiting for the API call to finish before running tests
    cy.wait('@getJobs');
  });

  it('should display a table with job data', () => {
    // Checking the table headers
    cy.contains('Job ID').should('exist');
    cy.contains('Video').should('exist');
    cy.contains('Color').should('exist');
    cy.contains('Threshold').should('exist');
    cy.contains('Status').should('exist');
    cy.contains('Result').should('exist');

    // Checking that 2 job rows are rendered from our mocked data
    cy.get('[data-testid="job-row"]').should('have.length', 2);

    // Checking the content of the first job row
    cy.get('[data-testid="job-id"]').eq(0).should('have.text', 'f1a1fac2-ab7f-4e10-9b09-e9ecb27a94b6');
    cy.get('[data-testid="job-video"]').eq(0).should('have.text', 'ensantina.mp4');
    cy.get('[data-testid="job-status"]').eq(0).should('contain.text', 'Done');

    // Checking the content of the second job row
    cy.get('[data-testid="job-id"]').eq(1).should('have.text', 'd2f4af67-f192-409b-b197-c0c8f8b218c9');
    cy.get('[data-testid="job-video"]').eq(1).should('have.text', 'salamander.mp4');
    cy.get('[data-testid="job-status"]').eq(1).should('contain.text', 'Processing');
  });

  it('should show a download link for completed jobs', () => {
    // Checking that the completed jobs include a download link
    cy.get('[data-testid="job-download-link"]').should('have.length', 1);

    // Making sure the download link for the completed job points to the correct 'result.csv' file
    cy.get('[data-testid="job-download-link"]')
      .first()
      .should('have.attr', 'href')
      .and('include', 'f1a1fac2-ab7f-4e10-9b09-e9ecb27a94b6/result.csv');
  });

  it('should show "-" for jobs not marked as done', () => {
    // Checking that non-completed jobs show a dash instead of a download link
    cy.get('[data-testid="job-no-download"]').should('have.length', 1);
    cy.get('[data-testid="job-no-download"]').first().should('have.text', '-');
  });
});