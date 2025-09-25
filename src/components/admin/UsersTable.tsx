"use client";

import { useState } from "react";
import { Edit3, Trash2, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const demoUsers = [
  { id: "U001", name: "Dr. Mohammad Iqbal", email: "sarah.johnson@university.edu", role: "Faculty", status: "Active", lastLogin: "1h ago" },
  { id: "U002", name: "Rohit Kumar", email: "rohit.kumar@college.edu", role: "Student", status: "Active", lastLogin: "2h ago" },
  { id: "U003", name: "Aisha Khan", email: "aisha.khan@college.edu", role: "Student", status: "Inactive", lastLogin: "2d ago" },
  { id: "U004", name: "Prof. Samiya Saqi", email: "mark.lee@university.edu", role: "Faculty", status: "Active", lastLogin: "3h ago" },
];

export default function UsersTable() {
  const [users, setUsers] = useState(demoUsers);
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [editUser, setEditUser] = useState<any>(null);

  // Delete user
  const handleDelete = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  // Save edited user
  const handleSave = () => {
    setUsers(users.map((u) => (u.id === editUser.id ? editUser : u)));
    setEditUser(null);
  };

  // Filter + Search
  const filteredUsers = users.filter((u) => {
    return (
      (filterRole === "All" || u.role === filterRole) &&
      (filterStatus === "All" || u.status === filterStatus) &&
      (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="space-y-4">
      {/* Filters & Search */}
      <div className="flex flex-wrap gap-4 items-center">
        <Input
          placeholder="Search by name or email..."
          className="w-60"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Select onValueChange={(val) => setFilterRole(val)} defaultValue="All">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Roles</SelectItem>
            <SelectItem value="Faculty">Faculty</SelectItem>
            <SelectItem value="Student">Student</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(val) => setFilterStatus(val)} defaultValue="All">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-sm text-slate-500">
            <tr>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Last Login</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="bg-white">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{u.name}</div>
                      <div className="text-sm text-slate-500">{u.email}</div>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4 text-sm text-slate-700">{u.role}</td>

                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      u.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>

                <td className="py-4 px-4 text-sm text-slate-600">{u.lastLogin}</td>

                <td className="py-4 px-4 text-right">
                  <div className="inline-flex items-center gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          className="text-slate-500 hover:text-slate-700"
                          onClick={() => setEditUser(u)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </DialogTrigger>
                      {editUser && editUser.id === u.id && (
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <Input
                              value={editUser.name}
                              onChange={(e) =>
                                setEditUser({ ...editUser, name: e.target.value })
                              }
                              placeholder="Name"
                            />
                            <Input
                              value={editUser.email}
                              onChange={(e) =>
                                setEditUser({ ...editUser, email: e.target.value })
                              }
                              placeholder="Email"
                            />
                            <Select
                              value={editUser.role}
                              onValueChange={(val) =>
                                setEditUser({ ...editUser, role: val })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Faculty">Faculty</SelectItem>
                                <SelectItem value="Student">Student</SelectItem>
                              </SelectContent>
                            </Select>
                            <Select
                              value={editUser.status}
                              onValueChange={(val) =>
                                setEditUser({ ...editUser, status: val })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleSave}>Save</Button>
                          </DialogFooter>
                        </DialogContent>
                      )}
                    </Dialog>
                    <button
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(u.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
