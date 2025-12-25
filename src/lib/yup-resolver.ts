import { set } from 'lodash';
import type { Resolver, FieldValues, FieldErrors, ResolverResult } from 'react-hook-form'; // Import ResolverResult
import * as Yup from 'yup';

export const yupResolver = <TFieldValues extends FieldValues = FieldValues>(
  schema: Yup.ObjectSchema<TFieldValues>
): Resolver<TFieldValues> => async (values) => {
  try {
    const result = await schema.validate(values, {
      abortEarly: false,
    });

    // Explicitly type the successful return
    return {
      values: result as TFieldValues, // Ensure values match TFieldValues
      errors: {},
    } as ResolverResult<TFieldValues>; // Cast to ResolverResult
  } catch (yupErrors: any) {
    const reactHookFormErrors: FieldErrors<TFieldValues> = {};

    if (yupErrors.inner) {
      yupErrors.inner.forEach((error: Yup.ValidationError) => {
        if (error.path) {
          set(reactHookFormErrors, error.path, {
            type: error.type,
            message: error.message,
          });
        }
      });
    }

    // Explicitly type the error return
    return {
      values: {}, // As per react-hook-form's ResolverResult for errors, return an empty object
      errors: reactHookFormErrors,
    } as ResolverResult<TFieldValues>; // Cast to ResolverResult
  }
};
