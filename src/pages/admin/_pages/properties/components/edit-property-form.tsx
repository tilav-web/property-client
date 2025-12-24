import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { propertySchema } from "@/schemas/property.schema";
import { type IProperty } from "@/interfaces/property/property.interface";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { EnumPropertyStatus } from "@/enums/property-status.enum";
import { EnumPropertyCategory } from "@/enums/property-category.enum";
import { adminPropertyService } from "@/pages/admin/_services/admin-property.service";
import { toast } from "sonner";

interface EditPropertyFormProps {
  property: IProperty;
  onSuccess: () => void;
}

export const EditPropertyForm = ({
  property,
  onSuccess,
}: EditPropertyFormProps) => {
  const form = useForm({
    resolver: yupResolver(propertySchema),
    defaultValues: {
      title: (property.title as any).en,
      description: (property.description as any).en,
      address: (property.address as any).en,
      price: property.price,
      status: property.status,
      category: property.category,
      is_premium: property.is_premium,
      is_archived: property.is_archived,
    },
  });

  const onSubmit = async (values: any) => {
    const payload = {
      ...values,
      title: {
        en: values.title,
        ru: (property.title as any).ru,
        uz: (property.title as any).uz,
      },
      description: {
        en: values.description,
        ru: (property.description as any).ru,
        uz: (property.description as any).uz,
      },
      address: {
        en: values.address,
        ru: (property.address as any).ru,
        uz: (property.address as any).uz,
      },
    };
    try {
      await adminPropertyService.updateProperty(property._id, payload);
      toast.success("Property updated successfully");
      onSuccess();
    } catch (error) {
      toast.error("Error updating property");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(EnumPropertyStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(EnumPropertyCategory).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_premium"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Is Premium</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_archived"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Is Archived</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
