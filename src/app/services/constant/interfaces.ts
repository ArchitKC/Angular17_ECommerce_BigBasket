export interface Category{
  categoryId: number;
  categoryName: string;
  parentCategoryId : number;
  userId: number;
  children?: Category[];
}


export class categoryObject {
  categoryId: number;
  categoryName: string;
  parentCategoryId: number;

  constructor() {
    this.categoryId = 0;
    this.categoryName = '';
    this.parentCategoryId = 0;
  }
}

export interface product{
  productId: number;
  productSku: string;
  productName: string;
  productPrice: null;
  productShortName: string;
  productDescription: string;
  createdDate: Date;
  deliveryTimeSpan: string;
  categoryId: null;
  productImageUrl: string;
}

export class productObject {
  productId: number;
  productSku: string;
  productName: string;
  productPrice: null;
  productShortName: string;
  productDescription: string;
  createdDate: Date;
  deliveryTimeSpan: string;
  categoryId: null;
  productImageUrl: string;

  constructor() {
    this.productId = 0;
    this.productSku = '';
    this.productName = '';
    this.productPrice = null;
    this.productShortName = '';
    this.productDescription = '';
    this.createdDate = new Date();
    this.deliveryTimeSpan = '';
    this.categoryId = null;
    this.productImageUrl = '';
  }
}