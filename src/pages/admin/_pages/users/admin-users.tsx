import { useEffect, useMemo, useState } from "react";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Search, Filter, MoreVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { adminUserService } from "../../_services/admin-user.service";
import type { IUser, UserRole } from "@/interfaces/users/user.interface";

const DEFAULT_LIMIT = 10;

const AdminUsersPage = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? DEFAULT_LIMIT);
  const role = (searchParams.get("role") as UserRole) || undefined;
  const searchQuery = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(searchQuery);

  const { data, isLoading, isFetching, isPlaceholderData } = useQuery({
    queryKey: ["admin-users", page, limit, searchQuery, role],
    queryFn: () =>
      adminUserService.findUsers({
        page,
        limit,
        search: searchQuery || undefined,
        role,
      }),
    placeholderData: keepPreviousData,
    staleTime: 5_000,
  });

  const users: IUser[] = useMemo(() => data?.users ?? [], [data]);
  const hasMore = data?.hasMore ?? false;

  useEffect(() => {
    if (!isPlaceholderData && hasMore) {
      queryClient.prefetchQuery({
        queryKey: ["admin-users", page + 1, limit, searchQuery, role],
        queryFn: () =>
          adminUserService.findUsers({
            page: page + 1,
            limit,
            search: searchQuery || undefined,
            role,
          }),
      });
    }
  }, [page, limit, searchQuery, role, hasMore, isPlaceholderData, queryClient]);

  const applySearch = () => {
    setSearchParams({
      page: "1",
      limit: limit.toString(),
      search: searchInput,
      ...(role ? { role } : {}),
    });
  };

  const changePage = (newPage: number) => {
    setSearchParams({
      page: newPage.toString(),
      limit: limit.toString(),
      ...(searchQuery ? { search: searchQuery } : {}),
      ...(role ? { role } : {}),
    });
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearchParams({ page: "1", limit: limit.toString() });
  };

  return (
    <div className="p-6">
      <div className="flex gap-3 mb-6">
        <Input
          placeholder="Search users..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <Select
          value={role}
          onValueChange={(value) =>
            setSearchParams({
              page: "1",
              limit: limit.toString(),
              ...(value !== "all" ? { role: value } : {}),
              ...(searchQuery ? { search: searchQuery } : {}),
            })
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="physical">Physical</SelectItem>
            <SelectItem value="legal">Legal</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={applySearch}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>

        <Button variant="outline" onClick={clearFilters}>
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* TABLE */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  Loading...
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.email.value}</TableCell>
                  <TableCell>
                    <Badge>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt!).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => changePage(page - 1)}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink isActive>{page}</PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={() => changePage(page + 1)}
              className={!hasMore ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {isFetching && (
        <p className="text-xs text-muted-foreground mt-2">Updating...</p>
      )}
    </div>
  );
};

export default AdminUsersPage;
