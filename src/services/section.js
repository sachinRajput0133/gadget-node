const Section = require('../models/Section');

const create = async (req) => {
  return await Section.create(req.body);
};

const updateSection = async (req) => {
  const section = await Section.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  return section;
};

const deleteSection = async (req) => {
  const section = await Section.findByIdAndDelete(req.params.id);
  return section;
};

const addArticleToSection = async (req) => {
  const section = await Section.findById(req.params.id);
  if (!section) {   
    throw new Error(`Section not found with id of ${req.params.id}`);
  }

  const article = await Article.findById(req.params.articleId);
  if (!article) {   
    throw new Error(`Article not found with id of ${req.params.articleId}`);
  }

  // Check if article already exists in section
  if (section.Article.includes(req.params.articleId)) {   
    throw new Error(`Article already exists in this section`);
  }

  section.Article.push(req.params.articleId);
  await section.save();
  return section;
};

const removeArticleFromSection = async (req) => {
  const section = await Section.findById(req.params.id);
  if (!section) {   
    throw new Error(`Section not found with id of ${req.params.id}`);
  }

  const article = await Article.findById(req.params.articleId);
  if (!article) {   
    throw new Error(`Article not found with id of ${req.params.articleId}`);
  }

  // Check if article exists in section
  if (!section.Article.includes(req.params.articleId)) {   
    throw new Error(`Article does not exist in this section`);
  }

  section.Article.pull(req.params.articleId);
  await section.save();
  return section;
};

module.exports = {
  create,
  updateSection,
  deleteSection,
  addArticleToSection,
  removeArticleFromSection
};