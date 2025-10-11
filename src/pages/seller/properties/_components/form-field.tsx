"use client";
import { Field, ErrorMessage, type FieldProps } from "formik";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormFieldProps {
  name: string;
  label: string;
  type?: "text" | "number" | "textarea" | "select";
  options?: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  onChange?: (value: string) => void; // onChange prop qo'shildi
}

export default function FormField({
  name,
  label,
  type = "text",
  options,
  required,
  disabled,
  placeholder,
  onChange,
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && "*"}
      </label>
      {type === "select" ? (
        <Field name={name}>
          {({ field, form }: FieldProps) => (
            <Select
              onValueChange={(value) => {
                form.setFieldValue(field.name, value);
                if (onChange) onChange(value); // onChange ishlatiladi
              }}
              value={field.value}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder || `Select ${label}`} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Field>
      ) : (
        <Field
          as={type === "textarea" ? Textarea : Input}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder || label}
          disabled={disabled}
        />
      )}
      <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
    </div>
  );
}