\c nc_knews

SELECT comments FROM articles
JOIN comments ON comments.article_id = articles.article_id
WHERE articles.article_id = 16;