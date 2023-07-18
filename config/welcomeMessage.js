const welcomeMessage = `
<!DOCTYPE html>
<html>
<head>
  <title>Welcome to the Appointment Management API</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      color: #333;
      margin: 0;
      padding: 20px;
    }

    h1 {
      color: #555;
      margin-bottom: 20px;
    }

    h2 {
      color: #888;
      margin-bottom: 10px;
    }

    h3 {
      color: #666;
      margin-bottom: 10px;
    }

    p {
      margin-bottom: 10px;
    }

    ul {
      list-style-type: none;
      padding-left: 20px;
    }

    code {
      font-family: Consolas, monospace;
      background-color: #f9f9f9;
      padding: 2px 4px;
      color: #555;
    }
  </style>
</head>
<body>
  <h1>Welcome to the Appointment Management API!</h1>
  <p>This API allows you to manage appointments and users.</p>
  
  <h2>API Endpoints:</h2>
  <ul>
    <li><code>/api/appointments</code>: Endpoint for managing appointments</li>
    <li><code>/api/users</code>: Endpoint for managing users</li>
    <li><code>/api/auth</code>: Endpoint for user authentication and refresh-token</li>
  </ul>

  <h3>Appointments Routes:</h3>
  <ul>
    <li><code>POST /api/appointments/:userId</code>: Create a new appointment</li>
    <li><code>GET /api/appointments/:id</code>: Get an appointment by ID</li>
    <li><code>PUT /api/appointments/:id</code>: Update an appointment by ID (Admin or Moderator access required)</li>
    <li><code>DELETE /api/appointments/:id</code>: Delete an appointment by ID (Admin access required)</li>
    <li><code>GET /api/appointments</code>: Get all appointments (Admin or Moderator access required)</li>
    <li><code>GET /api/appointments/user/:userId</code>: Get appointments by user ID</li>
    <li><code>GET /api/appointments/semaine</code>: Get appointments by week</li>
  </ul>

  <h3>Users Routes:</h3>
  <ul>
    <li><code>POST /api/users</code>: Create a new user</li>
    <li><code>GET /api/users/:id</code>: Get a user by ID</li>
    <li><code>GET /api/users</code>: Get all users (Admin access required)</li>
    <li><code>PUT /api/users/:id</code>: Update a user by ID (Admin access required)</li>
    <li><code>DELETE /api/users/:id</code>: Delete a user by ID (Admin access required)</li>
  </ul>

  <h3>Authentication Routes:</h3>
  <ul>
    <li><code>POST /api/auth/signin</code>: User signin</li>
    <li><code>POST /api/auth/refreshtoken</code>: Refresh access token</li>
  </ul>

  <p>Please refer to the API documentation for more information on how to use each endpoint.</p>

  <p>Thank you for using the Appointment Management API!</p>
</body>
</html>
`;

export default welcomeMessage;
