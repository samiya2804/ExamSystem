
import { NextResponse } from "next/server";
import { exec } from "child_process";
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';


const PYTHON_SCRIPT_PATH = "C:\\Users\\Samiya\\OneDrive\\Documents\\extract\\extract_pdf.py";



export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('pdfFile') as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }


  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const tempDir = path.join(process.cwd(), 'temp_uploads'); 
  const tempFilePath = path.join(tempDir, `${uuidv4()}.pdf`);

  try {
   
    await fs.mkdir(tempDir, { recursive: true });
    await fs.writeFile(tempFilePath, buffer);

   
    const { stdout, stderr } = await new Promise<{ stdout: string, stderr: string }>((resolve, reject) => {
   
      const command = `python "${PYTHON_SCRIPT_PATH}" "${tempFilePath}"`;
      
      exec(command, { encoding: 'utf8' }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Exec error: ${error.message}`);
          reject(new Error("Python execution failed. Check server logs and verify the Python path."));
          return;
        }
        resolve({ stdout, stderr });
      });
    });

   
    if (stderr.trim()) {
      console.error("Python script stderr:", stderr.trim());
 
      try {
        const errorJson = JSON.parse(stderr.trim());
        return NextResponse.json(errorJson, { status: 500 });
      } catch {
        return NextResponse.json({ error: `Python script error: ${stderr.trim()}` }, { status: 500 });
      }
    }

    
    const extractedData = JSON.parse(stdout.trim());
    return NextResponse.json(extractedData);

  } catch (error) {
    console.error("PDF Processing Error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "An unknown error occurred." }, { status: 500 });
  } finally {
   
    await fs.rm(tempFilePath, { force: true }).catch(err => console.error("Cleanup error:", err));
  }
}