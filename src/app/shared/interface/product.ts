export interface Product {
    isInWishlist: boolean;
    sold: number;
    images: string[];
    subcategory: Subcategory[];
    ratingsQuantity: number;
    _id: string;
    title: string;
    slug: string;
    description: string;
    quantity: number;
    price: number;
    imageCover: string;
    category: Category;
    brand: Category;
    ratingsAverage: number;
    createdAt: string;
    updatedAt: string;
    id: string;
    count?:number;
    product ?: Product;
}



export interface Category {
    _id: string;
    name: string;
    slug: string;
    image: string;
}

export interface Subcategory {
    _id: string;
    name: string;
    slug: string;
    category: string;
}


export interface CartProduct{
    subcategory: Subcategory[];
    _id: string;
    title: string;
    quantity: number;
    imageCover: string;
    category: Category;
    brand: Category;
    ratingsAverage: number;
    id: string;
  }

  export interface cartData{
    count: number;
    _id: string;
    product: CartProduct ;
    price: number;
   
}


export interface OrderAdress {
    details: string;
    phone: string;
    city: string;
  }