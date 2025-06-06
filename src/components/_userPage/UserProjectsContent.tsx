"use client";

import Link from "next/link";
import ProjectCard from "../cards/ProjectCard";
import LoaderSmall from "../displayElements/LoaderSmall";
import { useProjectsByUserId } from "@/hooks/dbData/project/useProject";

const UserProjectsContent = ({ userId }: { userId: string }) => {
  const { data: projects, isLoading, error } = useProjectsByUserId(userId);

  if (isLoading) return <LoaderSmall />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4 justify-items-center">
      {projects?.map((project, idx) => (
        <Link href={`/project/${project.id}`} key={idx}>
          <ProjectCard project={project.data} />
        </Link>
      ))}
    </div>
  );
};

export default UserProjectsContent;
