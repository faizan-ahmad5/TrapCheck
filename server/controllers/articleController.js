// Admin: list all articles (any status)
exports.listAll = async (req, res) => {
  try {
    const articles = await Article.find().populate("author", "name email");
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
const Article = require("../models/Article");
const { validationResult, body } = require("express-validator");

// Submit draft article (user)
exports.submitDraft = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { title, content } = req.body;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const article = new Article({
      author: req.user._id,
      title,
      slug,
      content,
      status: "pending",
    });
    await article.save();
    res.status(201).json({ message: "Draft submitted", article });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get published articles (paginated)
exports.listPublished = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const articles = await Article.find({ status: "published" })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author", "name");
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get single article by slug
exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      status: "published",
    }).populate("author", "name");
    if (!article) return res.status(404).json({ error: "Article not found" });
    // TODO: Sanitize markdown before sending
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Admin: approve/reject article
exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });
    article.status = req.body.status || article.status;
    article.updatedAt = new Date();
    await article.save();
    res.json({ message: "Article updated", article });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Admin: publish instantly
exports.publishNow = async (req, res) => {
  try {
    const { title, content } = req.body;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const article = new Article({
      author: req.user._id,
      title,
      slug,
      content,
      status: "published",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await article.save();
    res.status(201).json({ message: "Article published", article });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
