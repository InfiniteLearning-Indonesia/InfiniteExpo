import React from "react";
import ProjectDetailsClient from "./ProjectDetailsClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/lib/api/project.api";

export const revalidate = 600; // Enable Next.js ISR (10 minutes revalidation)

async function getProject(id: string): Promise<Project | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api-exhibition.infinitelearningstudent.id";
    const res = await fetch(`${apiUrl}/api/projects/${id}`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch project details: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error("Error in getProject server fetch:", err);
    throw err;
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { id } = await params;
  
  try {
    const project = await getProject(id);
    if (!project) {
      return (
        <div className="min-h-screen flex flex-col bg-background text-foreground justify-between">
          <Navbar />
          <div className="flex-grow flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <h3 className="text-lg font-bold mb-1">Project Not Found</h3>
            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
              The project you are looking for does not exist or may have been deleted.
            </p>
            <Link
              href="/projects"
              className="px-5 py-2.5 rounded-full border border-border/60 bg-secondary/35 font-semibold text-xs hover:bg-secondary/60 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Gallery
            </Link>
          </div>
          <Footer />
        </div>
      );
    }

    return <ProjectDetailsClient initialProject={project} />;
  } catch (err: any) {
    console.error("Failed to load project details on server:", err);
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground justify-between">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h3 className="text-lg font-bold mb-1">Failed to Load Project</h3>
          <p className="text-xs text-muted-foreground mb-6 leading-relaxed font-normal">
            Unable to connect to the server. Please verify the backend is running and reachable.
          </p>
          <Link
            href="/projects"
            className="px-5 py-2.5 rounded-full border border-border/60 bg-secondary/35 font-semibold text-xs hover:bg-secondary/60 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Gallery
          </Link>
        </div>
        <Footer />
      </div>
    );
  }
}
