import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/common/data-table';
import { adminTagService } from '../../_services/admin-tag.service';
import type { ITag } from '@/interfaces/tag/tag.interface';
import { toast } from 'sonner';

const DEFAULT_LIMIT = 10;

const TagsPage = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [newTag, setNewTag] = useState('');

  const page = Number(searchParams.get('page') ?? 1);
  const limit = Number(searchParams.get('limit') ?? DEFAULT_LIMIT);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-tags', page, limit],
    queryFn: () => adminTagService.getAll({ page, limit }),
  });

  const addMutation = useMutation({
    mutationFn: (value: string) => adminTagService.create(value),
    onSuccess: () => {
      toast.success('Tag added successfully');
      setNewTag('');
      queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
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
      <h1 className="text-2xl font-bold mb-4">Manage Tags</h1>

      <div className="flex w-full max-w-sm items-center space-x-2 mb-6">
        <Input
          type="text"
          placeholder="New tag..."
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          disabled={addMutation.isPending}
        />
        <Button onClick={handleAddTag} disabled={addMutation.isPending}>
          {addMutation.isPending ? 'Adding...' : 'Add Tag'}
        </Button>
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
      />
    </div>
  );
};

export default TagsPage;
