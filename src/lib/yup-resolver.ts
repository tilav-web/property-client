import { get, set } from 'lodash';
import { Resolver, FieldValues, FieldErrors } from 'react-hook-form';
import * as Yup from 'yup';

type YupResolver = <TFieldValues extends FieldValues = FieldValues>(
  schema: Yup.ObjectSchema<TFieldValues>
) => Resolver<TFieldValues>;

export const yupResolver: YupResolver = (schema) => async (values) => {
  try {
    const result = await schema.validate(values, {
      abortEarly: false,
    });

    return {
      values: result,
      errors: {},
    };
  } catch (errors: any) {
    const reactHookFormErrors: FieldErrors<TFieldValues> = {};
    if (errors.inner) {
      for (const error of errors.inner) {
        if (error.path) {
          set(reactHookFormErrors, error.path, {
            type: error.type,
            message: error.message,
          });
        }
      }
    }

    return {
      values: {},
      errors: reactHookFormErrors,
    };
  }
};
