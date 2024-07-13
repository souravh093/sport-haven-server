import { FilterQuery, Query } from 'mongoose';

// make query builder for searching filtering sorting pagination and other
class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // search method
  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query };

    // Filtering
    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];

    excludeFields.forEach((el) => delete queryObj[el]);

    // Apply price filter if min and max are provided
    if (Object.prototype.hasOwnProperty.call(queryObj, 'price')) {
      const priceFilter = queryObj['price'] as { min: number; max: number };
      if (priceFilter.min !== undefined && priceFilter.max !== undefined) {
        this.modelQuery = this.modelQuery.find({
          price: { $gte: priceFilter.min, $lte: priceFilter.max },
        } as FilterQuery<T>);
      }
      delete queryObj['price'];
    }

    // Apply rating filter if provided
    if (Object.prototype.hasOwnProperty.call(queryObj, 'rating')) {
      const ratingFilter = queryObj['rating'] as number;
      if (ratingFilter !== undefined && ratingFilter > 0) {
        this.modelQuery = this.modelQuery.find({
          rating: ratingFilter,
        } as FilterQuery<T>);
      }
      delete queryObj['rating'];
    }

    // Apply other remaining filters
    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    return this;
  }

  // sorting method
  sort() {
    const sortDirection = this.query.sort === 'asc' ? 'price' : '-price';

    this.modelQuery = this.modelQuery.sort(sortDirection);

    return this;
  }

  // pagination method
  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  // field method
  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }
  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
