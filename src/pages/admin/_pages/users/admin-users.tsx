import { useEffect, useMemo, useState } from "react";
import {
  keepPreviousData,
  useMutation,
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

import { Search, Filter, MoreVertical, Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { GrantPremiumDialog } from "./components/grant-premium-dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { adminUserService } from "../../_services/admin-user.service";
import type { IUser, UserRole } from "@/interfaces/users/user.interface";
import { EditUserForm } from "./components/edit-user-form";

const DEFAULT_LIMIT = 10;

const AdminUsersPage = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? DEFAULT_LIMIT);
  const role = (searchParams.get("role") as UserRole) || undefined;
  const searchQuery = searchParams.get("search") || "";
  const isPremiumParam = searchParams.get("isPremium");
  const isPremium = isPremiumParam === "true" ? true : isPremiumParam === "false" ? false : undefined;

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isPremiumDialogOpen, setIsPremiumDialogOpen] = useState(false);
  const [premiumTargetUser, setPremiumTargetUser] = useState<IUser | null>(null);

  const quickGrant = useMutation({
    mutationFn: (id: string) => adminUserService.grantPremium(id, 30),
    onSuccess: (res) => {
      const until = new Date(res.premiumUntil).toLocaleDateString();
      toast.success(`1 oylik premium berildi — ${until} gacha`);
      void queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => toast.error("Premium berishda xatolik"),
  });

  const { data, isLoading, isFetching, isPlaceholderData } = useQuery({
    queryKey: ["admin-users", page, limit, searchQuery, role, isPremium],
    queryFn: () =>
      adminUserService.findUsers({
        page,
        limit,
        search: searchQuery || undefined,
        role,
        isPremium,
      }),
    placeholderData: keepPreviousData,
    staleTime: 5_000,
  });

  const users: IUser[] = useMemo(() => data?.users ?? [], [data]);
  const hasMore = data?.hasMore ?? false;

  useEffect(() => {
    if (!isPlaceholderData && hasMore) {
      queryClient.prefetchQuery({
        queryKey: ["admin-users", page + 1, limit, searchQuery, role, isPremium],
        queryFn: () =>
          adminUserService.findUsers({
            page: page + 1,
            limit,
            search: searchQuery || undefined,
            role,
            isPremium,
          }),
      });
    }
  }, [page, limit, searchQuery, role, hasMore, isPlaceholderData, queryClient]);

  const buildParams = (overrides: Record<string, string | undefined>) => {
    const base: Record<string, string> = { page: "1", limit: limit.toString() };
    const merged = { search: searchQuery, role, isPremium: isPremiumParam ?? undefined, ...overrides };
    for (const [k, v] of Object.entries(merged)) {
      if (v !== undefined && v !== "" && v !== "all") base[k] = v;
    }
    return base;
  };

  const applySearch = () => {
    setSearchParams(buildParams({ search: searchInput }));
  };

  const changePage = (newPage: number) => {
    setSearchParams(buildParams({ page: newPage.toString() }));
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearchParams({ page: "1", limit: limit.toString() });
  };

  const handleEditClick = (user: IUser) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
    setSelectedUser(null);
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
          value={role ?? "all"}
          onValueChange={(value) =>
            setSearchParams(buildParams({ role: value }))
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barcha rollar</SelectItem>
            <SelectItem value="physical">Physical</SelectItem>
            <SelectItem value="legal">Legal</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={isPremiumParam ?? "all"}
          onValueChange={(value) =>
            setSearchParams(buildParams({ isPremium: value }))
          }
        >
          <SelectTrigger className="w-[160px]">
            <Crown className="h-3.5 w-3.5 mr-1 text-amber-500" />
            <SelectValue placeholder="Premium" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barcha foydalanuvchilar</SelectItem>
            <SelectItem value="true">
              <span className="flex items-center gap-1">
                <Crown className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
                Premium faol
              </span>
            </SelectItem>
            <SelectItem value="false">Premium yo'q</SelectItem>
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
              <TableHead>Premium</TableHead>
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
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {user.first_name || user.last_name
                          ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
                          : "—"}
                      </span>
                      <span className="text-xs text-muted-foreground">{user.email.value}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    {user.premiumUntil && new Date(user.premiumUntil).getTime() > Date.now() ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                        <Crown className="h-3 w-3 fill-amber-500 text-amber-500" />
                        {new Date(user.premiumUntil).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt!).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                        disabled={quickGrant.isPending && quickGrant.variables === user._id}
                        onClick={() => quickGrant.mutate(user._id)}
                      >
                        {quickGrant.isPending && quickGrant.variables === user._id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Crown className="h-3.5 w-3.5 mr-1 fill-amber-500" />
                        )}
                        1 oy
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-7 w-7">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(user)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setPremiumTargetUser(user);
                              setIsPremiumDialogOpen(true);
                            }}
                          >
                            <Crown className="mr-2 h-4 w-4 text-amber-600" />
                            Premium (boshqa muddat)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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

      {selectedUser && (
        <EditUserForm
          user={selectedUser}
          isOpen={isEditDialogOpen}
          onClose={handleEditClose}
          onSuccess={handleEditSuccess}
        />
      )}

      <GrantPremiumDialog
        user={premiumTargetUser}
        open={isPremiumDialogOpen}
        onOpenChange={(open) => {
          setIsPremiumDialogOpen(open);
          if (!open) setPremiumTargetUser(null);
        }}
      />
    </div>
  );
};

export default AdminUsersPage;
