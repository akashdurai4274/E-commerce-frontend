import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Settings,
  Key,
  Package,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/store/hooks";

export default function Profile() {
  const user = useUser();

  if (!user) return null;

  return (
    <>
      <Helmet>
        <title>My Profile - SkyCart</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl">
                    {user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                  >
                    {user.role === "admin" ? (
                      <>
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </>
                    ) : (
                      "Customer"
                    )}
                  </Badge>
                </div>
              </div>

              <Separator className="mb-6" />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>

                {user.created_at && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Member since
                      </p>
                      <p className="font-medium">
                        {format(new Date(user.created_at), "MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/profile/update" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
                <Link to="/password/update" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </Link>
                <Link to="/orders" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    My Orders
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
