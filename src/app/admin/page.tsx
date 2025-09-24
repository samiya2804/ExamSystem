// app/admin/page.tsx
"use client";

import Sidebar from "@/components/admin/Sidebar";
import StatsCard from "@/components/admin/StatsCard";
import UsersTable from "@/components/admin/UsersTable";
import ExamMonitor from "@/components/admin/ExamMonitor";
import ChartsPanel from "@/components/admin/ChartsPanel";
import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-8">
          {/* header */}
          <div className="flex items-start justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Comprehensive system oversight and management
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/addFaculty"
                className="px-3 py-2 bg-white border rounded-md text-slate-700 hover:shadow"
              >
                Add Faculty
              </Link>
              <Link
                href="/admin/addSubject"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700"
              >
                Add Subject
              </Link>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Users"
              value="2,847"
              subtitle="Active students and faculty"
              trend="+12.5%"
              icon="users"
            />
            <StatsCard
              title="Active Exams"
              value="23"
              subtitle="Currently running examinations"
              trend="+3"
              icon="file"
            />
            <StatsCard
              title="Platform Usage"
              value="94.2%"
              subtitle="System uptime this month"
              trend="+2.1%"
              icon="pulse"
            />
            <StatsCard
              title="Storage Used"
              value="67.8%"
              subtitle="Of total allocated storage"
              trend="-5.2%"
              icon="database"
            />
          </div>

          {/* User Management + Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* User Management (table) */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-medium text-slate-900">
                      User Management
                    </h2>
                    <p className="text-sm text-slate-500">
                      Manage faculty and student accounts
                    </p>
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <input className="px-3 py-2 border rounded-md" placeholder="Search users..." />
                    <select className="px-3 py-2 border rounded-md">
                      <option>All Roles</option>
                      <option>Student</option>
                      <option>Faculty</option>
                    </select>
                    <select className="px-3 py-2 border rounded-md">
                      <option>All Status</option>
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div> */}
                </div>

                <UsersTable />
              </div>

              {/* Exam Monitor */}
              <ExamMonitor />
            </div>

            {/* Right column charts */}
            <div className="space-y-6">
              <ChartsPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
