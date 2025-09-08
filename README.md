# **Flashcard Web App - README**

## **📌 Project Overview**
This is a **Flashcard Web App** built with **MERN (MongoDB, Express, React, Node.js)** that helps users create, review, and progress through flashcards using the **Leitner System**. 

Users can **log in, create flashcards**, and categorize them by levels. Flashcards automatically adjust their review dates based on correctness, helping users retain information efficiently.

## **🛠️ Tech Stack**
- **Frontend:** React, Tailwind CSS, Axios
- **Backend:** Express.js, MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Token)
- **Database:** MongoDB (Mongoose Schema for Cards & Users)

---

## **🚀 Features**
✔ **User Authentication (JWT-based Sign-in & Sign-up)**  
✔ **Create, Update, and Delete Flashcards**  
✔ **Categorize Flashcards into Levels (Leitner System)**  
✔ **Dark Mode Toggle**  
✔ **Next Review Date Based on User's Answer**  
✔ **Protected Routes for User-specific Cards**  
✔ **Real-time Notifications for Due Cards**  

---

## **🛠️ Setup Instructions**

### **🔹 1. Clone the Repository**
```sh
git clone https://github.com/Amit-Kumar015/ALFREDTASK.git
cd ALFREDTASK
```

### **🔹 2. Backend Setup**
```sh
cd backend
npm install
```
- Create a `.env` file and add:
  ```env
  MONGO_URI=your_mongo_connection_string
  ACCESS_TOKEN_SECRET=your_secret_key
  ACCESS_TOKEN_EXPIRY=7d
  PORT=8000
  ```
- Start the backend server:
  ```sh
  npm start
  ```

### **🔹 3. Frontend Setup**
```sh
cd ../frontend
npm install
```
- Start the React app:
  ```sh
  npm start
  ```
---

## **🔐 Authentication (JWT) Implementation**
- **Signup & Login:** Users get a **JWT token** upon successful authentication.
- **Token Storage:** Token is saved in **localStorage**.
- **Protected Routes:** Users need a valid JWT to create/view flashcards.
- **Middleware (`verifyJWT.js`)** ensures only authorized users can access routes.

```js
const verifyJWT = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized - No Token Provided" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = { _id: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
```

---

## **📝 Thought Process & Architecture**

### **🔹 1. Flashcard System (Leitner System)**
- Cards are assigned **levels (1-5)**.
- If answered correctly, **level increases** (next review date delayed).
- If answered incorrectly, **level decreases** (review sooner).

### **🔹 2. Dark Mode Toggle Implementation**
- **Tailwind CSS** supports `dark:` mode.
- Dark mode toggle uses **localStorage** to remember the user's preference.
- Toggled via a button:
```js
const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
useEffect(() => {
  document.documentElement.classList.toggle("dark", darkMode);
  localStorage.setItem("theme", darkMode ? "dark" : "light");
}, [darkMode]);
```

### **🔹 3. Database Schema Design**
- **User Schema (`User.js`)** contains authentication details.
- **Card Schema (`Card.js`)** includes levels & review dates.
```js
const cardSchema = new Schema({
  level: { type: Number, required: true, default: 1 },
  question: { type: String, required: true, unique: true, trim: true },
  answer: { type: String, required: true, trim: true },
  nextReviewDate: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "User" }
});
```

### **🔹 4. Notification System for Due Cards**
- When a user logs in, the app checks for **flashcards due today**.
```js
const fetchFlashcards = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:8000/api/flashcards", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const now = new Date();
    const dueCards = response.data.data.filter((card) => new Date(card.nextReviewDate) <= now);
    setDueCount(dueCards.length);
  } catch (error) {
    console.error("Error fetching cards:", error);
  }
};
```

## **📜 License**
This project is **open-source** and available for contributions! 🚀

---

### **📬 Need Help?**
For issues or contributions, open an **issue** or **pull request** on GitHub.

Happy Learning! 🎓✨

