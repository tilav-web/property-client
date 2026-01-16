import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef, type SortingState } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/common/data-table';
import { adminTagService } from '../../_services/admin-tag.service';
import type { ITag } from '@/interfaces/tag/tag.interface';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/use-debounce';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

const DEFAULT_LIMIT = 10;

const TagsPage = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [newTag, setNewTag] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const page = Number(searchParams.get('page') ?? 1);
  const limit = Number(searchParams.get('limit') ?? DEFAULT_LIMIT);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-tags', page, limit, debouncedSearch],
    queryFn: () =>
      adminTagService.getAll({ page, limit, q: debouncedSearch }),
  });

  const addMutation = useMutation({
    mutationFn: (value: string) => adminTagService.create(value),
    onSuccess: () => {
      toast.success('Tag added successfully');
      setNewTag('');
      queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error('Failed to add tag');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminTagService.remove(id),
    onSuccess: () => {
      toast.success('Tag deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
    },
    onError: () => {
      toast.error('Failed to delete tag');
    },
  });

  const handleAddTag = () => {
    if (!newTag.trim()) {
      toast.error('Tag value cannot be empty');
      return;
    }
    addMutation.mutate(newTag);
  };

  const changePage = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), limit: limit.toString() });
  };

  const columns: ColumnDef<ITag>[] = useMemo(
    () => [
      {
        accessorKey: '_id',
        header: 'ID',
      },
      {
        accessorKey: 'value',
        header: 'Value',
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteMutation.mutate(row.original._id)}
            disabled={deleteMutation.isPending}
          >
            Delete
          </Button>
        ),
      },
    ],
    [deleteMutation],
  );

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Tags</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Tag</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Tag</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                id="new-tag"
                placeholder="New tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                disabled={addMutation.isPending}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddTag} disabled={addMutation.isPending}>
                {addMutation.isPending ? 'Adding...' : 'Add Tag'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Filter tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        page={page}
        limit={limit}
        total={data?.total || 0}
        hasMore={(data?.page ?? 1) < (data?.totalPages ?? 1)}
        setPage={changePage}
        sorting={sorting}
        onSortingChange={setSorting}
      />
    </div>
  );
};

export default TagsPage;
