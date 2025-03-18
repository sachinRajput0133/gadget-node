
const Article = require('../models/Article');
const dbService = require('../helpers/utils/dbService');
const { default: slugify } = require('slugify');
const articleList = async (query) => {
    return await dbService.getAllDocuments(Article, query);
    //   return await dbService.getAllDocuments(Article, query, {
    //     ...(query.page && query.limit ? { page: query?.page, 
    //       limit: query?.limit, 
    //       sort: query?.sort, 
    //       select: "name code stateId countryId countryNm stateNm canDel isActive isDefault seq",
    //       populate: query?.populate} : {pagination: true, sort: query?.sort, populate: query?.populate}),
    //   });

  
};
const articleDetail = async (req,res) => {
    const article = await Article.findById(req.params.id)
    .populate([
      { path: 'category', select: 'name slug' },
      { path: 'section', select: 'name slug' },
      { path: 'author', select: 'name' },
    //   { path: 'comments' }
    ]);

  return article;
};
const createArticle = async (req) => {
    // Create slug from title if not provided
//   if (!req.body.slug && req.body.title) {
//     req.body.slug = slugify(req.body.title, { lower: true, strict: true });
//   }
console.log("🚀 ~ create ~ req.body:", req.body)

  // Create article
  const article = await Article.create(req.body);
  return article;
};
const updateArticle = async (req) => {
    const article = await Article.findById(req.params.id);
    if (!article) {
        return util.failureResponse(`Article not found with id of ${req.params.id}`, res)
      }
    
      // Update slug if title is changed
      if (req.body.title && req.body.title !== article.title) {
        req.body.slug = slugify(req.body.title, { lower: true, strict: true });
      }
    
      // Update article
      return await Article.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
    
};

const deleteArticle = async (req) => {
    const article = await Article.findById(req.params.id);
    if (!article) {
        return util.failureResponse(`Article not found with id of ${req.params.id}`, res)
      }
  return  Article.findByIdAndDelete(req.params.id);
};
module.exports = {
  articleList,
  articleDetail,
  createArticle,
  updateArticle,
  deleteArticle
};