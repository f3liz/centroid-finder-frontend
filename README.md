# Salamander Tracker – Frontend

This is the React/Next.js frontend for the Salamander Tracker app, a tool for submitting and previewing salamander observation videos. Users can:

- Upload videos for analysis
- View video thumbnails and preview frames
- Submit processing jobs to the backend
- Monitor job status and download results as CSV files


## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/salamander-frontend.git
   cd salamander-frontend
   ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Run the development server**

    ```bash
    npm run dev 
    ```

This app will be available at http://localhost:3001


## Running Tests

This project includes Cypress tests for integration testing.

```bash
npm run test
```

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework with server-side rendering and routing

- [React](https://react.dev/) - JavaScript library for building user interfaces

- [Material UI](https://mui.com/) - UI component library for styling

- [Cypress](https://www.cypress.io/) - End-to-end and Component testing framework

## API Integration

This frontend communicates with the Express backend for:

- /thumbnail/:filename – Grabbing video thumbnails

- /process – Submitting video files for processing

- /status/:jobId – Checking job status

- /results/:filename – Downloading CSV result files

- /jobs - Retrieving for all previous jobs

Make sure the backend is running at the expected URL (http://localhost:3000 or Docker port).

## Special Notes

- No login is required.

- The backend automatically clones and builds this repo as part of its Docker image (hosted on GHCR).

- The backend is needed to run this frontend completely.

## Related Repositories

- [Salamander Tracker - Backend + Java Batch Processor](https://github.com/f3liz/centroid-finder/tree/image)

## License

MIT License - see [LICENSE](./LICENSE) for details.