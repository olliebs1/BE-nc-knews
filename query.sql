\c nc_knews

SELECT * FROM articles
JOIN comments ON comments.article_id = articles.article_id;