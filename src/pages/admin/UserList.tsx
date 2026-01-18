import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  Shield,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader } from "@/components/ui/loader";
import api from "@/lib/api";
import type { UserListResponse, MessageResponse } from "@/types";

export default function UserList() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "users", { page }],
    queryFn: async () => {
      const { data } = await api.get<UserListResponse>(
        `/users/admin/users?page=${page}&limit=10`,
      );
      return data;
    },
  });

  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await api.delete<MessageResponse>(
        `/users/admin/user/${userId}`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User deleted successfully");
    },
  });

  const handleDelete = (userId: string, userName: string) => {
    if (confirm(`Are you sure you want to delete "${userName}"?`)) {
      deleteUser(userId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive">Failed to load users</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Users - Admin - SkyCart</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Users
          </h1>
          <p className="text-muted-foreground">
            Manage user accounts ({data?.total || 0} total)
          </p>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium">User</th>
                    <th className="text-left p-4 font-medium">Email</th>
                    <th className="text-left p-4 font-medium">Role</th>
                    <th className="text-left p-4 font-medium">Joined</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.users.map((user) => (
                    <tr key={user.id} className="border-b last:border-0">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                              {user.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              ID: {user.id.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {user.email}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : "secondary"
                          }
                        >
                          {user.role === "admin" && (
                            <Shield className="h-3 w-3 mr-1" />
                          )}
                          {user.role}
                        </Badge>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {user.created_at
                          ? format(new Date(user.created_at), "MMM d, yyyy")
                          : "N/A"}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Link to={`/admin/user/${user.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(user.id, user.name)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data && data.pages > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {data.pages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === data.pages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
