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
      if (ratingFilter !== undefined) {
        if (ratingFilter === 1) {
          this.modelQuery = this.modelQuery.find({
            rating: { $lte: 1 },
          } as FilterQuery<T>);
        } else if (ratingFilter > 1 && ratingFilter <= 2) {
          // For ratings 2 through 5, find products with a rating less than or equal to the provided rating
          this.modelQuery = this.modelQuery.find({
            rating: { $lte: 2, $gt: 1 },
          } as FilterQuery<T>);
        } else if (ratingFilter > 2 && ratingFilter <= 3) {
          this.modelQuery = this.modelQuery.find({
            rating: { $lte: 3, $gt: 2 },
          } as FilterQuery<T>);
        } else if (ratingFilter > 3 && ratingFilter <= 4) {
          this.modelQuery = this.modelQuery.find({
            rating: { $lte: 4, $gt: 3 },
          } as FilterQuery<T>);
        } else if (ratingFilter > 4 && ratingFilter <= 5) {
          this.modelQuery = this.modelQuery.find({
            rating: { $lte: 5, $gt: 4 },
          } as FilterQuery<T>);
        }
      }
      delete queryObj['rating'];
    }

    // Apply other remaining filters
    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    return this;
  }

  sort() {
    let sortDirection = '-createdAt';
    if (this.query.sort) {
      sortDirection = this.query.sort === 'asc' ? 'price' : '-price';
    }

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
