import { ItemRepository } from '../repositories/item.repository';

export class ItemService {
  private itemRepo: ItemRepository;

  constructor() {
    this.itemRepo = new ItemRepository();
  }

  async getAllItems() {
    return await this.itemRepo.findAll();
  }

  async createItem(itemData: any) {
    if (itemData.sku) {
      itemData.sku = itemData.sku.toString().replace(/[^A-Z0-9]/g, '').toUpperCase();
      if (!itemData.sku) {
        throw new Error('SKU must contain at least one alphanumeric character');
      }
    }

    if (itemData.category_id) itemData.category_id = parseInt(itemData.category_id);
    if (itemData.reorder_level) itemData.reorder_level = parseInt(itemData.reorder_level);
    if (itemData.safety_stock) itemData.safety_stock = parseInt(itemData.safety_stock);
    if (itemData.lead_time_days) itemData.lead_time_days = parseInt(itemData.lead_time_days);

    return await this.itemRepo.create(itemData);
  }

  async getItemById(id: number) {
    const item = await this.itemRepo.findById(id);
    if (!item) throw new Error('Item not found');
    return item;
  }
}
