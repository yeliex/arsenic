const findByPagination = async function(query) {
  const { page = 0, size = 20 } = query.page || {};

  return {
    list: this.find({
      ...query,
      limit: Number(size),
      offset: Number(Number(page * size).toFixed(0))
    }),
    page: {
      page,
      size,
      total: await this.count({
        ...query,
        limit: null,
        offset: null
      })
    }
  };
};

exports.extendModel = (model) => {
  Object.defineProperties(model, {
    findByPagination: {
      value: findByPagination
    }
  });
};
