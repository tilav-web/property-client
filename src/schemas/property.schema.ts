import * as yup from 'yup';

export const propertySchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
  address: yup.string().required(),
  price: yup.number().required(),
  status: yup.string().required(),
  category: yup.string().required(),
  is_premium: yup.boolean().required(),
  is_archived: yup.boolean().required(),
});
