"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useState } from "react";

type UploadFile = {
  name: string;
  date: string;
};

export default function StudentPage() {
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  const [fileName, setFileName] = useState("");

  const handleUpload = () => {
    if (!fileName) return;
    setUploads([{ name: fileName, date: new Date().toLocaleString() }, ...uploads]);
    setFileName("");
  };

  return (
    <div className="container mx-auto py-10 px-6 space-y-8">
      <h1 className="text-3xl font-bold text-indigo-600">Student Dashboard</h1>
      <p className="text-gray-600">Upload Answer Sheets & View Results</p>

      {/* Upload Form */}
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-green-600" /> Upload Answer Sheet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            type="text"
            placeholder="Enter File Name (simulate upload)"
            className="w-full border rounded-md p-2"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
          <Button className="w-full" onClick={handleUpload}>
            Upload
          </Button>
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      {uploads.length > 0 && (
        <div className="space-y-4">
          {uploads.map((f, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{f.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Uploaded at: {f.date}</p>
                <Button variant="secondary" className="mt-2 w-full">
                  View Result (placeholder)
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
