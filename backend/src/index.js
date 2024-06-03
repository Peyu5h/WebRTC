import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

app.get("/getUsers", async (req, res) => {
  const users = await prisma.User.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      posts: true,
      comments: true,
    },
  });
  res.json(users);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.User.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid)
    return res.status(400).json({ message: "Invalid password" });

  res.json({ message: "Login successful", user });
});

app.get("/getUser/:id", async (req, res) => {
  const { id } = req.params;
  const users = await prisma.User.findMany({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
      name: true,
      email: true,
      posts: true,
      comments: true,
    },
  });
  res.json(users);
});

app.post("/addUser", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.User.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    res.json({ message: "User added successfully", user });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.post("/createPost/:authorId", async (req, res) => {
  try {
    const { title, content } = req.body;
    const { authorId } = req.params;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: Number(authorId),
      },
    });
    res.json({ message: "Posted successfully", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/getPosts/:authorId", async (req, res) => {
  try {
    const { authorId } = req.params;
    const posts = await prisma.Post.findMany({
      where: {
        authorId: Number(authorId),
      },
    });

    if (posts.length == 0) return res.json({ message: "No posts found" });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.post("addComment", async (req, res) => {
  try {
    const { content, postId, authorId } = req.body;

    const comment = await prisma.Comment.create({
      data: {
        content,
        postId: Number(postId),
        authorId: Number(authorId),
      },
    });
    res.json({ message: "Comment added successfully", comment });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.get("/getComments/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await prisma.Comment.findMany({
      where: {
        postId: Number(postId),
      },
    });

    if (comments.length == 0) return res.json({ message: "No comments found" });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

import http from "http";
import { Server } from "socket.io";
import { ExpressPeerServer } from "peer";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use("/peerjs", peerServer);

io.on("connection", (socket) => {
  console.log("A client connected");

  socket.on("message", (data) => {
    console.log(`Received message from ${socket.id}`, data);
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
