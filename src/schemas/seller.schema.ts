import * as yup from 'yup';
import { sellerStatuses } from '@/interfaces/users/seller.interface';

export const sellerSchema = yup.object().shape({
  status: yup.string().oneOf(sellerStatuses).required(),
});