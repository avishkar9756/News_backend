const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

const NEWS_API_KEY = process.env.API_KEY;

app.post("/api/news", async (req, res) => {
  const { searchText, selectedCategories } = req.body;
  let url = "https://eventregistry.org/api/v1/article/getArticles";

  const requestbody = {
    action: "getArticles",
    keyword: searchText,
    categoryUri: selectedCategories,
    lang: ["eng"],
    articlesPage: 1,
    articlesCount: 100,
    articlesSortBy: "date",
    articlesSortByAsc: false,
    articlesArticleBodyLen: -1,
    resultType: "articles",
    dataType: ["news", "pr"],
    apiKey: NEWS_API_KEY,
    forceMaxDataTimeWindow: 31,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestbody),
    });
    const data = await response.json();
    const articles = data.articles.results.map((article) => ({
      title: article.title,
      summary: article.body.split(" ").slice(0, 60).join(" "),
    }));
    return res.json(articles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news articles" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
