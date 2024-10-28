export interface Category{
  categoryId: number;
  categoryName: string;
  parentCategoryId : number;
  userId: number;
  children?: Category[];
  subcategories?:any;
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


export class placeOrderObject {
  SaleId: number;
  CustId: number;
  SaleDate: Date;
  TotalInvoiceAmount: number;
  Discount: number;
  PaymentNaration: string;
  DeliveryAddress1: string;
  DeliveryAddress2: string;
  DeliveryCity: string;
  DeliveryPinCode: string;
  DeliveryLandMark: string;

  constructor() {
    this.SaleId = 0;
    this.CustId = 0;
    this.SaleDate = new Date();
    this.TotalInvoiceAmount = 0;
    this.Discount = 0;
    this.PaymentNaration = '';
    this.DeliveryAddress1 = '';
    this.DeliveryAddress2 = '';
    this.DeliveryCity = '';
    this.DeliveryPinCode = '';
    this.DeliveryLandMark = '';
  }
}