const index = async (req, model, queryData, aggregateData, sort) => {
  try {
    const Model = require(`../models/${model}Model`);
    let limit = 21;
    let projects = { $project: { _id: 0 } };
    const count = await Model.aggregate([
      ...queryData,
      { $group: { _id: null, count: { $sum: 1 } } },
      projects,
    ]);
    if (count == 0) {
      return { docs: [] };
    }
    const totalDocs = count[0].count;
    if (totalDocs > 0) {
      if (req.query.all) {
        limit = totalDocs;
      } else if (req.query.limit) {
        if (req.query.limit <= totalDocs) {
          limit = Number(req.query.limit);
        } else {
          limit = totalDocs;
        }
      }
    }
    let data = [...queryData, { $sort: sort }];
    let totalPages = Math.ceil(totalDocs / limit);
    let page = 1; //default page = 1
    let pagingCounter = null;
    let hasPrevPage = false;
    let hasNextPage = false;
    let prevPage = null;
    let nextPage = null;
    if (req.query.fields) {
      const fields = req.query.fields.split(",");
      let objFields = {};
      fields.forEach((element) => {
        objFields[element] = 1;
      });
      projects = {
        ...projects,
        $project: objFields,
      };
      data = [...data, projects];
    }
    if (req.query.page && req.query.page != 1) {
      page = Number(req.query.page);
      data = [...data, { $skip: limit * (page - 1) }];
    }
    if (page > 1) {
      hasPrevPage = true;
      prevPage = page - 1;
    }
    if (totalPages > page) {
      hasNextPage = true;
      nextPage = page + 1;
    }
    data = [...data, { $limit: limit }, ...aggregateData];
    pagingCounter = (page - 1) * limit + 1;
    const result = await Model.aggregate(data);
    const paginateItem = {
      totalDocs,
      totalPages,
      limit,
      page,
      pagingCounter,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    };
    return { docs: result, ...paginateItem };
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = index;
