const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const articleController = require("../controllers/articleController");

const router = express.Router();

// Admin: list all articles (any status)
router.get("/admin/all", auth("admin"), articleController.listAll);

// List published articles (paginated)
router.get("/", articleController.listPublished);

// Get single article by slug
router.get("/:slug", articleController.getArticle);

// Submit draft article (user)
router.post(
  "/",
  auth(),
  [
    body("title").isString().trim().isLength({ min: 5, max: 100 }),
    body("content").isString().trim().isLength({ min: 20 }),
  ],
  articleController.submitDraft
);

// Admin: approve/reject article
router.patch("/:id", auth("admin"), articleController.updateArticle);

// Admin: publish instantly
router.post(
  "/admin",
  auth("admin"),
  [
    body("title").isString().trim().isLength({ min: 5, max: 100 }),
    body("content").isString().trim().isLength({ min: 20 }),
  ],
  articleController.publishNow
);

// Admin: delete article
router.delete(
  "/:id",
  auth("admin"),
  require("../controllers/articleController").deleteArticle
);

module.exports = router;
