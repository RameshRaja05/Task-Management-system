# OPENINAPP Backend Engineer Intern Assignment

This is a task management application. It has the JWT based authentication and allow users to manage their tasks and subtasks.

## Features
- User Authentication and Authorization
- customizable error handler 
- Cron job scheduler

## Getting Started

Follow these steps to set up and run the Node.js backend app locally:

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   ```

2. **Install Dependencies:**
   ```bash
   cd <project-directory>
   npm install or pnpm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and set up your environment variables. An example `.env` file might look like:
   You can find a env structure in `.env.example` file in root directory of this project.

4. **Run the Application:**
   To start a dev server
   ```bash
   npm run dev or pnpm run dev
   ```
   To start a application
   ```bash
   npm run serve or pnpm run serve
   ```

   The application should now be running on `http://localhost:3000` (or the port you specified in the `.env` file).

## Project Structure

The project follows a modular structure to keep the code organized. Here is an overview of the main directories:

- **`src/`**: Contains the source code of the application.
  - **`controllers/`**: Handles business logic.
  - **`models/`**: Defines data models and interacts with the database.
  - **`routes/`**: Defines API routes.
  - **`middlewares.js`**: Contains custom middlewares.
  - **`jobs/`**: contains cron scheduler jobs
  - **`util/`**: includes helper functions


## Technologies Used

- **Node.js**: JavaScript runtime for server-side development.
- **Express.js**: Web application framework for Node.js.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: MongoDB object modeling tool for Node.js.
- **dotenv**: Loads environment variables from a .env file.
- **Jest**: Testing framework for unit and integration tests.

## Contributing

If you would like to contribute to the project, please follow the [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any questions or concerns, please contact [rameshraja003801@gmail.com].

## More INFO
### Documentation Links

- [JWT Documentation](https://jwt.io/introduction/)
- [Express Documentation](https://expressjs.com/)
- [Twilio Documentation](https://www.twilio.com/docs/)

---
