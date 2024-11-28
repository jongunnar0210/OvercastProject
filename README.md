# Subscription Tracker Project

This project is a simple subscription tracker application with a Flask backend and ReactJS frontend, using SQLite for data storage. It is containerized with Docker to streamline setup and deployment.

---

## Project Structure

```
Project Folder:
    - backend/
        - app.py (Flask backend application)
        - Dockerfile (Backend container setup)
        - requirements.txt (Python dependencies)
        - subscriptions.db (SQLite database file)
    - frontend/
        - Dockerfile (Frontend container setup)
        - node_modules/ (Frontend dependencies)
        - public/ (Static files for React app)
        - src/
            - App.js (React frontend application)
        - package-lock.json (Frontend dependency lock file)
        - package.json (React project dependencies)
    - docker-compose.yml (Orchestrates frontend and backend services)
    - README.md (Project documentation)
```

---

## Setup Instructions

This project uses Docker to simplify deployment. Ensure Docker and Docker Compose are installed on your machine before proceeding.

### 1. Build and Start the Services

1. Clone the repository and navigate to the project root.

   ```bash
   git clone <repository_url>
   cd <repository_root>
   ```

2. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

   This command:
   - Builds the frontend and backend containers.
   - Starts both services.

3. Access the application:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:5000](http://localhost:5000)

---

### 2. API Endpoints

**Backend API**:

The Flask backend provides the following endpoints:

- **GET /subscriptions**
  - Query Parameters: `days` (optional) - Filter subscriptions due in the next X days.
  - Response Example:
    ```json
    [
      {
        "id": 1,
        "service_name": "Netflix",
        "cost": 15.99,
        "renewal_date": "2024-12-01"
      }
    ]
    ```

- **POST /subscriptions**
  - Request Body:
    ```json
    {
      "service_name": "Spotify",
      "cost": 9.99,
      "renewal_date": "2024-12-15"
    }
    ```
  - Response Example:
    ```json
    {
      "message": "Subscription added successfully"
    }
    ```

---

### 3. Stopping the Containers

To stop the containers, run:
```bash
docker-compose down
```
This stops and removes the containers but preserves the SQLite database file.

---

### 4. Rebuilding the Containers

If you make changes to the code, rebuild the containers with:
```bash
docker-compose up --build
```

---

## Project Tasks

Add the following functionality to the application, in any way you see fit. The goal here is not necessarily to find the most elegant solution, but a functional one.

0. **Add Payment Status Tracking**
   - List all subscriptons in the database in the React frontend. The DB is probably empty, so you may need to add some subscriptions first.

1. **Add Payment Status Tracking**
   - Track payment status for each subscription (e.g., "Pending," "Completed," "Overdue").
   - Add a `payment_status` column to the database.
   - Update the React form to accept payment status input.
   - Create a new endpoint `GET /subscriptions/status` to filter subscriptions by payment status.

2. **Add Subscription Categories**
   - Enable categorization of subscriptions (e.g., "Streaming," "Utilities," "Fitness").
   - Add a `category` column to the database.
   - Update the React form with a dropdown menu for category selection.
   - Add a new endpoint `GET /subscriptions/category/<category>` to fetch subscriptions by category.

3. **Add Renewal Reminder Notifications**
   - Notify users of upcoming subscription renewals.
   - Add a `reminder_sent` column to the database to track sent reminders.
   - Add a new endpoint `GET /subscriptions/reminders` to fetch subscriptions with pending reminders.

4. **Provide Cost Analysis**
   - Allow users to view insights into their subscription spending.
   - Add a new endpoint `GET /subscriptions/summary` to return aggregated data such as:
     - Total monthly cost.
     - Total annual cost.
     - Cost breakdown by category.
   - Update the React frontend to display these insights in a summary dashboard.

5. **Add a Cancellation Feature**
   - Enable users to mark subscriptions as canceled.
   - Add a `canceled` column to the database (boolean).
   - Create a new endpoint `PUT /subscriptions/<id>/cancel` to mark a subscription as canceled.
   - Update the React app to include a "Cancel Subscription" button that makes the corresponding API call.

---

## Notes

- The backend uses SQLite, and the database (`subscriptions.db`) is auto-created in the backend container.
- Ensure the frontend fetch requests point to `http://backend:5000` when running inside Docker.
- The frontend container uses Nginx to serve the React application.

---

## Troubleshooting

### CORS Issues
If you encounter CORS errors when accessing the backend from the frontend, ensure the Flask-CORS library is installed and enabled:

```bash
pip install flask-cors
```
In `app.py`, include:
```python
from flask_cors import CORS
CORS(app)
```

### Port Conflicts
If the default ports (3000 for frontend, 5000 for backend) are in use, modify the `docker-compose.yml` file:
```yaml
frontend:
  ports:
    - "<custom_port>:80"

backend:
  ports:
    - "<custom_port>:5000"
```

You will also have to reflect that change in the `constants.js` file:

```javascript
export const BACKEND_HOST = 'http://127.0.0.1:custom_port';
```

Rebuild and restart the containers.

---

Happy coding!

