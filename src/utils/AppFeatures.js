export class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginate() {
    let { page, size } = this.queryString;
    if (page <= 0 || !page) page = 1;
    if (size <= 0 || !size) size = 50;
    const skip = size * (page - 1);
    this.query.skip(skip).limit(size);
    return this;
  }

  filter() {
    let filterObj = { ...this.queryString };
    let excludedQuery = ['page', 'sort', 'fields', 'keyword'];
    excludedQuery.forEach((query) => {
      delete filterObj[query];
    })
    filterObj = JSON.stringify(filterObj).replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
    filterObj = JSON.parse(filterObj);
    this.query.find(filterObj);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      let sortedBy = this.queryString.sort.split(',').join(' ');
      this.query.sort(sortedBy);
    }
    return this;
  }

  search() {
    if (this.queryString.keyword) {
      this.query.find({
        $or: [
          { name: { $regex: `${this.queryString.keyword}`, $options: 'i' } },
          { description: { $regex: this.queryString.keyword, $options: 'i' } },
        ]
      });
    }
    return this;
  }

  fields() {
    if (this.queryString.fields) {
      let fields = this.queryString.fields.split(',').join(' ');
      this.query.select(fields);
    }
    return this;
  }
}