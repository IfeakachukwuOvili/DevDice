# DevDice

DevDice is a full-stack web application designed to help developers practice coding challenges, manage their progress, and provide an admin interface for challenge management. The project was built as a learning platform and as a demonstration of modern web development best practices.

---

## Features

- **User Authentication:** Sign up, log in, and manage your profile securely.
- **Password Reset:** Users can reset their password directly from the app.
- **Challenge Management:** Users can view, attempt, and track coding challenges.
- **Admin Panel:** Admins can add, edit, and delete challenges.
- **Theme Support:** Light and dark mode toggle.
- **Responsive Design:** Works well on desktop and mobile devices.

---

## Tech Stack

### **Frontend**
- **React** (with TypeScript)
- **React Router** for navigation
- **Axios** for HTTP requests
- **Tailwind CSS** for styling

### **Backend**
- **Node.js** with **Express**
- **Prisma ORM** for database access
- **SQLite** (easy local development)
- **bcrypt** for password hashing
- **JWT** for authentication (if enabled)

---

## Project Structure

```
devdice/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── App.tsx
│   └── package.json
└── README.md
```

---

##  Getting Started

### **1. Clone the repository**
```sh
git clone https://github.com/IfeakachukwuOvili/DevDice.git
cd devdice
```

### **2. Setup the backend**
```sh
cd backend
npm install
npx prisma migrate dev --name init
npm run dev
```

### **3. Setup the frontend**
```sh
cd ../frontend
npm install
npm run dev
```

### **4. Environment Variables**

- Backend: Create a `.env` file in `/backend` for your database and (optionally) email credentials.
- Frontend: For any public environment variables, use the `VITE_` prefix if using Vite.

---

## Challenges Faced & Solutions

### **1. Password Reset Flow**
- **Challenge:** Implementing a secure password reset flow was initially complex, especially with token management and email sending.
- **Solution:** For simplicity and learning, we opted for a direct password reset using email and new password, skipping email verification for now.

### **2. Prisma Schema Drift**
- **Challenge:** Schema drift between Prisma migrations and the actual database caused errors.
- **Solution:** Learned to use `npx prisma migrate reset` and `npx prisma generate` to keep the schema and types in sync.

### **3. Admin Access Security**
- **Challenge:** Ensuring only authorized users could access the admin panel.
- **Solution:** Used a secret key modal for admin access, storing `isAdmin` in localStorage for session management.

### **4. TypeScript Type Issues**
- **Challenge:** Type errors when updating models and controllers.
- **Solution:** Regenerated Prisma client after schema changes and ensured correct type imports.

### **5. UI/UX Consistency**
- **Challenge:** Keeping the UI consistent and responsive across pages.
- **Solution:** Used Tailwind CSS utility classes and React component patterns for a clean, modern look.

---

##  How to Use

- **Sign up** as a user.
- **Reset your password** if needed.
- **Request admin access** using the secret key (provided by the project owner {within the code lol}).
- **Admins** can add, edit, or delete challenges from the admin panel.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

##  License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

- [React](https://react.dev/)
- [Express](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Node.js](https://nodejs.org/)

---

**DevDice** was built as a learning project to explore full-stack development, authentication, and modern UI/UX practices.  
Thank you for checking it out!
