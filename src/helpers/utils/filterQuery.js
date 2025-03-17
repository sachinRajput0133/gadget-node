const   getFilterQuery = async (query) => {

    if (query.search && query.search !== "") {
        query["$or"] = query.searchColumns?.map(column => {
            return {
                [column]: {
                    $regex: query.search?.replace(/[-[\]{}()*+?.,\\/^$|#]/g, "\\$&").trim(),
                    $options: "i"
                }
            }
        })
    }
delete query.search;
delete query.searchColumns;
return query;
}

module.exports = {
    getFilterQuery
}