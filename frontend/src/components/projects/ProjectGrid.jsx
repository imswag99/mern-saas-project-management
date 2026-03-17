import ProjectCard from "./ProjectCard";

const ProjectGrid = ({ projects }) => {
    if (!projects || projects.length === 0) {
        return (
            <div className="text-white/50 text-center mt-20">
                No projects yet
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-3 gap-6">
            {projects.map((p) => (
                <ProjectCard key={p._id} project={p} />
            ))}
        </div>
    );
};

export default ProjectGrid;
