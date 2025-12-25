import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { sellerSchema } from '@/schemas/seller.schema';
import { type ISeller, sellerStatuses, type SellerStatus } from '@/interfaces/users/seller.interface';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { adminSellerService } from '@/pages/admin/_services/admin-seller.service';
import { toast } from 'sonner';
import * as yup from 'yup';

type FormValues = yup.InferType<typeof sellerSchema>;

interface EditSellerFormProps {
  seller: ISeller;
  onSuccess: () => void;
}

export const EditSellerForm = ({
  seller,
  onSuccess,
}: EditSellerFormProps) => {
  const form = useForm<FormValues>({
    resolver: yupResolver(sellerSchema),
    defaultValues: {
      status: seller.status,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await adminSellerService.updateSeller(seller._id, values);
      toast.success('Seller updated successfully');
      onSuccess();
    } catch (error) {
      toast.error('Error updating seller');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  {sellerStatuses.map((status: SellerStatus) => (
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
