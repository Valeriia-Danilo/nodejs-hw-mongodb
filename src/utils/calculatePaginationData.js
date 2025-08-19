import createHttpError from "http-errors";

export const calculatePaginationData = (count, perPage, page) => {
  const totalPages = Math.ceil(count / perPage);
  const hasNextPage = Boolean(totalPages - page);
  const hasPreviousPage = page !== 1;

  if (totalPages === 0) {
    return {
      data: [],
      page: 1,
      perPage,
      totalItems: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    };
  };

    if (page < 1 || page > totalPages) {
      throw createHttpError(400, `Invalid page number. Must be between 1 and ${totalPages}`);
    };

    return {
      page,
      perPage,
      totalItems: count,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    };
  };
