import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
}

const users: User[] = [
  {
    id: 1,
    firstName: "Kishore",
    lastName: "K",
    email: "kishore@gmail.com",
    phoneNumber: "9876543210",
    role: "ADMIN",
  },
  {
    id: 2,
    firstName: "Rahul",
    lastName: "Sharma",
    email: "rahul@gmail.com",
    phoneNumber: "9876543211",
    role: "USER",
  },
  {
    id: 3,
    firstName: "John",
    lastName: "David",
    email: "john@gmail.com",
    phoneNumber: "9876543212",
    role: "USER",
  },
  {
    id: 4,
    firstName: "Priya",
    lastName: "R",
    email: "priya@gmail.com",
    phoneNumber: "9876543213",
    role: "USER",
  },
  {
    id: 5,
    firstName: "Akash",
    lastName: "Singh",
    email: "akash@gmail.com",
    phoneNumber: "9876543214",
    role: "USER",
  },
  {
    id: 6,
    firstName: "Emily",
    lastName: "Johnson",
    email: "emily@gmail.com",
    phoneNumber: "9876543215",
    role: "USER",
  },
  {
    id: 7,
    firstName: "Mohammed",
    lastName: "Ali",
    email: "ali@gmail.com",
    phoneNumber: "9876543216",
    role: "USER",
  },
  {
    id: 8,
    firstName: "Sophia",
    lastName: "Brown",
    email: "sophia@gmail.com",
    phoneNumber: "9876543217",
    role: "USER",
  },
  {
    id: 9,
    firstName: "Arun",
    lastName: "Kumar",
    email: "arun@gmail.com",
    phoneNumber: "9876543218",
    role: "USER",
  },
  {
    id: 10,
    firstName: "Daniel",
    lastName: "Wilson",
    email: "daniel@gmail.com",
    phoneNumber: "9876543219",
    role: "USER",
  },
];

const UserList = () => {
  const [searchEmail, setSearchEmail] = useState("");
  const [userList] = useState<User[]>(users);
  const filteredUsers = userList.filter((user) =>
    user.email.toLowerCase().includes(searchEmail.toLowerCase()),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Search Users by Email</CardDescription>
      </CardHeader>
      <CardContent>
        <input
          type="text"
          placeholder="Search by Email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="mb-4 w-full rounded-md border p-3"
        />

        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>{user.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserList;
