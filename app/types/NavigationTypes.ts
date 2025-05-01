export type RootStackParamList = {
    PersonalDataForm: undefined;
    // Add other routes here
    ProductListScreen: undefined; // Added ProductList route
    ProductDetailScreen: { productId: string }; // Added ProductDetail route
    
  };