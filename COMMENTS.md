<!-- Project Comments Go Here -->

- I fetched the applications at component Applications but we can use some state management tools such as Redux, Mobx to shared across different components. Also we can have http service layer if we want to scale up the application
- Added unit tests for components and the utils.
- Support error handling, if application fetch is failed, it would render ErrorMessage component
- Added slideInUp animation for new loaded SingleApplication
- The layout should be tablet and mobile friendly
- The backend API is loaded from dotenv. Have to create .env file for config the api url:

```
# Application Configuration
VITE_LOAN_APPLICATION_ENDPOINT=http://localhost:3001/api/applications
```
