"use client";

import React, { use } from "react";
import ProjectForm from "@/components/admin/ProjectForm";

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return <ProjectForm id={id} />;
}
