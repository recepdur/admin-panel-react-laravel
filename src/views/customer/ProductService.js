export class ProductService {
  getProducts() {
    return fetch('assests/demo/data/products.json')
      .then((res) => res.json())
      .then((d) => d.data)
  }
}
