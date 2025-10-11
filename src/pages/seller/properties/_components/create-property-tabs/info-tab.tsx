"use client"

import { Field, ErrorMessage, type FieldProps } from "formik"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Home } from "lucide-react"

interface InfoTabProps {
  values: {
    description: string
  }
}

export default function InfoTab({ values }: InfoTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Asosiy Maʼlumotlar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Sarlavha *
          </label>
          <Field as={Input} id="title" name="title" placeholder="Masalan: Yangi qurilayotgan loyiha markazda..." />
          <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Tavsif *
          </label>
          <Field
            as={Textarea}
            id="description"
            name="description"
            rows={3}
            placeholder="Mulkning batafsil tavsifini yozing..."
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{values.description.length}/140</span>
            <ErrorMessage name="description" component="span" className="text-red-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Kategoriya *
            </label>
            <Field name="category">
              {({ field, form }: FieldProps) => (
                <Select onValueChange={(value) => form.setFieldValue(field.name, value)} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategoriya tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Kvartira</SelectItem>
                    <SelectItem value="house">Uy</SelectItem>
                    <SelectItem value="commercial">Tijorat</SelectItem>
                    <SelectItem value="land">Yer uchastkasi</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </Field>
            <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label htmlFor="construction_status" className="block text-sm font-medium text-gray-700 mb-1">
              Qurilish Holati
            </label>
            <Field name="construction_status">
              {({ field, form }: FieldProps) => (
                <Select onValueChange={(value) => form.setFieldValue(field.name, value)} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Holatni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ready">Tayyor</SelectItem>
                    <SelectItem value="under_construction">Qurilmoqda</SelectItem>
                    <SelectItem value="planned">Rejalashtirilgan</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </Field>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
