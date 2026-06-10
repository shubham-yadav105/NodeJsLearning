require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Old routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// New Blog API routes
const postRoutes = require("./routes/postRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const tagRoutes = require("./routes/tagRoutes");
const commentRoutes = require("./routes/commentRoutes");

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/categories", categoryRoutes);
app.use("/tags", tagRoutes);
app.use("/comments", commentRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
