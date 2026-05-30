import instance from '../apis/app.js';

class ProductService {
  list = (workspaceId, chatbotId) =>
    instance.get(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/products`);

  create = (workspaceId, chatbotId, productData) =>
    instance.post(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/products`, productData);

  bulkCreate = (workspaceId, chatbotId, products) =>
    instance.post(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/products/bulk`, { products });

  sync = (workspaceId, chatbotId) =>
    instance.post(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/products/sync`);

  search = (workspaceId, chatbotId, query) =>
    instance.get(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/products/search`, {
      params: { q: query }
    });
}

const Product = new ProductService();
export default Product;
