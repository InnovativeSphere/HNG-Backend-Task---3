

```markdown
# 🚀 HNG Backend Task — User Management API

This is a simple RESTful **User Management API** built with **Node.js**, **Express**, and **Sequelize ORM**.  
It performs basic CRUD operations for users (Create, Read, Update, Delete) and includes robust error handling, modular structure, and proper validation.

---

## 📂 Project Structure

```

backend-task/
├── controllers/
│   └── userController.js
├── models/
│   └── userModel.js
├── routes/
│   └── userRoutes.js
├── config/
│   └── db.js
├── server.js
├── package.json
├── .env
└── README.md

````

---

## 🧱 Features

✅ Create a new user  
✅ Get all users  
✅ Get a user by ID  
✅ Update user details  
✅ Delete a user  
✅ Handles errors gracefully with descriptive messages  
✅ Validates data and prevents duplicate entries  
✅ Uses Sequelize ORM for model definition and automatic schema sync  

---

## ⚙️ Tech Stack

- **Node.js** — Backend runtime  
- **Express.js** — Server framework  
- **Sequelize ORM** — Object Relational Mapper  
- **SQLite / PostgreSQL / MySQL** — Database (SQLite by default)  
- **dotenv** — Environment variable management  
- **Nodemon** — For development auto-restart  

---

## 🧩 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/backend-task.git
   cd backend-task
````

2. **Install dependencies**

   ```bash
   npm install express sequelize sqlite3 dotenv nodemon
   ```

3. **Environment variables**
   Create a `.env` file in the root directory:

   ```
   PORT=5000
   DATABASE_URL=sqlite:./database.sqlite
   ```

4. **Run the server**

   ```bash
   npm run dev
   ```

   Or manually:

   ```bash
   node server.js
   ```

---

## 🧠 API Endpoints

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| POST   | `/api/users`     | Create a new user |
| GET    | `/api/users`     | Get all users     |
| GET    | `/api/users/:id` | Get a single user |
| PUT    | `/api/users/:id` | Update a user     |
| DELETE | `/api/users/:id` | Delete a user     |

---

## 📋 Example User Schema

```js
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 25
}
```

---

## 🔒 Error Handling

* Returns `400` for invalid inputs
* Returns `404` if user not found
* Returns `500` for unexpected server errors
* Uses a centralized try/catch structure in each controller

Example error response:

```json
{
  "success": false,
  "message": "User not found"
}
```

---

## 🧑‍💻 Author

**Salim Sambo**
Backend Developer — HNG Internship 13

