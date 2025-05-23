"use client";
import InputField from "@/components/displayElements/InputField";
import ImageSelector from "../displayElements/ImageSelector";

type Props = {
  project: ProjectToCreate;
  setProject: (p: ProjectToCreate) => void;
  setMainImageFile: (file: File) => void;
  setLogoFile: (file: File) => void;
};

const categories = [
  "Community",
  "NFTs",
  "DeFi",
  "Tech & AI",
  "Social Impact",
  "Gaming",
  "Other",
];

export default function Application1({
  project,
  setProject,
  setMainImageFile,
  setLogoFile,
}: Props) {
  const handleCategoryChange = (cat: string) => {
    setProject({ ...project, category: cat });
  };

  const handleImageSelection = (name: string, file: File) => {
    if (file.type.startsWith("image/")) {
      setProject({ ...project, [name]: URL.createObjectURL(file) });
      if (name === "mainImage") {
        setMainImageFile(file);
      } else if (name === "logo") {
        setLogoFile(file);
      }
    }
  };

  return (
    <form className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Main information</h2>
        <p className="text-gray-400 mb-4">
          Basic info to introduce your project.
        </p>
        <InputField
          label="Project name"
          value={project.name}
          onChange={(e) => setProject({ ...project, name: e.target.value })}
          required
        />
        <div className="mb-4">
          <label className="block text-white font-medium mb-2">
            Project category *
          </label>
          <p className="text-xs text-accent mb-2">
            Pick category that best describe your project.
          </p>
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  checked={project.category === cat}
                  onChange={() => handleCategoryChange(cat)}
                  className="accent-accent w-5 h-5 rounded-full"
                />
                <span className="text-white">{cat}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      {/* Uploads */}
      <label className="h4Style">Main Image *</label>
      <ImageSelector
        name="mainImage"
        handleSelection={(name, file) => handleImageSelection(name, file)}
        objectFit="cover"
        resolution="1200x1200"
        defaultImage={project.mainImage}
      />
      <label className="h4Style">Logo *</label>
      <ImageSelector
        name="logo"
        handleSelection={(name, file) => handleImageSelection(name, file)}
        objectFit="cover"
        resolution="1200x1200"
        defaultImage={project.logo}
      />
    </form>
  );
}
