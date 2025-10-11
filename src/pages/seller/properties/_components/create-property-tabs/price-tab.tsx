"use client"

import { Field, ErrorMessage, type FieldProps } from "formik"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign } from "lucide-react"

export default function PriceTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          Narx va Maydon
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Narx *
            </label>
            <Field as={Input} id="price" name="price" type="number" placeholder="0" />
            <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label htmlFor="price_type" className="block text-sm font-medium text-gray-700 mb-1">
              Narx Turi *
            </label>
            <Field name="price_type">
              {({ field, form }: FieldProps) => (
                <Select onValueChange={(value) => form.setFieldValue(field.name, value)} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Narx turi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">Sotuv</SelectItem>
                    <SelectItem value="rent">Ijaraga</SelectItem>
                    <SelectItem value="total_price">Umumiy narx</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </Field>
            <ErrorMessage name="price_type" component="div" className="text-red-500 text-sm mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
              Maydon (m²) *
            </label>
            <Field as={Input} id="area" name="area" type="number" placeholder="0" />
            <ErrorMessage name="area" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label htmlFor="payment_plans" className="block text-sm font-medium text-gray-700 mb-1">
              Toʻlov Rejalari
            </label>
            <Field as={Input} id="payment_plans" name="payment_plans" type="number" placeholder="0" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
