import * as yup from 'yup';
import { categories } from '@/interfaces/types/category.type';
import { propertyStatuses } from '@/interfaces/types/property.status.type';

export const propertySchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
  address: yup.string().required(),
  price: yup.number().required(),
  status: yup.string().oneOf(propertyStatuses).required(), // Validate against defined statuses
  category: yup.string().oneOf(categories).required(),     // Validate against defined categories
  is_premium: yup.boolean().required(),
  is_archived: yup.boolean().required(),
});
