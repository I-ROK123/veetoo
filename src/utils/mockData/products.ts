import { Product } from '../../types/store';

export const mockProducts: Product[] = [
  {
    id: 'prod1',
    name: 'Brookside Long Life Milk 500ml',
    sku: 'BS-LLM-500',
    category: 'Long Life Milk',
    description: 'Long life UHT milk with extended shelf life, 500ml packet',
    unitPrice: 65,
    quantityInStock: 250,
    reorderLevel: 50,
    imageUrl: 'https://images.pexels.com/photos/2419278/pexels-photo-2419278.jpeg',
    isActive: true
  },
  {
    id: 'prod2',
    name: 'Brookside Long Life Milk 1L',
    sku: 'BS-LLM-1000',
    category: 'Long Life Milk',
    description: 'Long life UHT milk with extended shelf life, 1 liter packet',
    unitPrice: 120,
    quantityInStock: 180,
    reorderLevel: 40,
    imageUrl: 'https://images.pexels.com/photos/4431989/pexels-photo-4431989.jpeg',
    isActive: true
  },
  {
    id: 'prod3',
    name: 'Brookside Fresh Milk 500ml',
    sku: 'BS-FM-500',
    category: 'Fresh Milk',
    description: 'Fresh pasteurized milk, 500ml packet',
    unitPrice: 55,
    quantityInStock: 120,
    reorderLevel: 30,
    imageUrl: 'https://images.pexels.com/photos/3602205/pexels-photo-3602205.jpeg',
    isActive: true
  },
  {
    id: 'prod4',
    name: 'Brookside Yoghurt Strawberry 250ml',
    sku: 'BS-YG-STR-250',
    category: 'Yoghurt',
    description: 'Strawberry flavored yoghurt, 250ml cup',
    unitPrice: 85,
    quantityInStock: 95,
    reorderLevel: 25,
    imageUrl: 'https://images.pexels.com/photos/1132558/pexels-photo-1132558.jpeg',
    isActive: true
  },
  {
    id: 'prod5',
    name: 'Brookside Yoghurt Vanilla 500ml',
    sku: 'BS-YG-VAN-500',
    category: 'Yoghurt',
    description: 'Vanilla flavored yoghurt, 500ml bottle',
    unitPrice: 150,
    quantityInStock: 20,
    reorderLevel: 30,
    imageUrl: 'https://images.pexels.com/photos/1132558/pexels-photo-1132558.jpeg',
    isActive: true
  },
  {
    id: 'prod6',
    name: 'Brookside Mala 300ml',
    sku: 'BS-ML-300',
    category: 'Fermented Milk',
    description: 'Traditional fermented milk, 300ml packet',
    unitPrice: 75,
    quantityInStock: 140,
    reorderLevel: 35,
    imageUrl: 'https://images.pexels.com/photos/4397920/pexels-photo-4397920.jpeg',
    isActive: true
  },
  {
    id: 'prod7',
    name: 'Brookside Butter 250g',
    sku: 'BS-BT-250',
    category: 'Butter',
    description: 'Premium quality butter, 250g block',
    unitPrice: 320,
    quantityInStock: 45,
    reorderLevel: 15,
    imageUrl: 'https://images.pexels.com/photos/236776/pexels-photo-236776.jpeg',
    isActive: true
  }
];