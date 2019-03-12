
const articleDateTimeStamp = (timeArticle) => {
  const timeStampArticle = timeArticle.map(article => ({
    title: article.title,
    body: article.body,
    votes: article.votes || 0,
    topic: article.topic,
    author: article.author,
    created_at: new Date(article.created_at),
  }
  ));
  return timeStampArticle;
};

const createRef = articles => {
  return articles.reduce((refObj, { title, article_id }) => {
    return { ...refObj, [title]: article_id };
  }, {});
}

const createArticleIdLink = (commentRows, refObj) => {
  const formattedComments = commentRows.map(comment => ({
    author: comment.created_by,
    article_id: refObj[comment.belongs_to],
    votes: comment.votes || 0,
    created_at: new Date(comment.created_at),
    body: comment.body,
  }))
  return formattedComments;
}

module.exports = { articleDateTimeStamp, createRef, createArticleIdLink };


// const createRef = owners => {
//   return owners.reduce((refObj, { forename, owner_id }) => {
//     console.log(refObj)
//     return { ...refObj, [forename]: owner_id }
//   }, {});
// }
