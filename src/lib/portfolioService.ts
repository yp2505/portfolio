export interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  github_url: string;
  tech: string[];
  status: 'completed' | 'in-progress';
}

export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image_url: string;
  verify_url: string;
}

export interface TechStack {
  id: number;
  name: string;
  logo_url: string;
  category: string;
}

export const fetchProjects = async (): Promise<Project[]> => {
  return [
    {
      id: 1,
      title: "Griot AI Platform",
      description: "Agentic AI orchestration platform for executing automated workflows, tools, and intelligent multi-agent tasks.",
      image_url: "",
      github_url: "https://github.com/yp2505/Groit-AI",
      tech: ["Python", "FastAPI", "React", "AI Agents", "TypeScript"],
      status: "completed",
    },
    {
      id: 2,
      title: "Working on new ML & Data Projects...",
      description: "Currently building intelligent machine learning systems and scalable data engineering pipelines. New projects arriving soon.",
      image_url: "",
      github_url: "https://github.com/yp2505",
      tech: ["Machine Learning", "Data Engineering", "Python"],
      status: "in-progress",
    },
  ];
};

export const fetchCertificates = async (): Promise<Certificate[]> => {
  return [
    {
      id: 1,
      title: "Certificates Coming Soon",
      issuer: "Currently pursuing ML & Data Engineering certifications",
      date: "2026",
      image_url: "",
      verify_url: "#",
    },
  ];
};

export const fetchTechStacks = async (): Promise<TechStack[]> => {
  return [
    { id: 1, name: "Python", logo_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", category: "language" },
    { id: 2, name: "TensorFlow", logo_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg", category: "ml" },
    { id: 3, name: "PyTorch", logo_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg", category: "ml" },
    { id: 4, name: "scikit-learn", logo_url: "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg", category: "ml" },
    { id: 5, name: "Pandas", logo_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg", category: "data" },
    { id: 6, name: "NumPy", logo_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg", category: "data" },
    { id: 7, name: "Apache Spark", logo_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachespark/apachespark-original.svg", category: "engineering" },
    { id: 8, name: "Apache Kafka", logo_url: "https://upload.wikimedia.org/wikipedia/commons/0/05/Apache_kafka.svg", category: "engineering" },
    { id: 9, name: "Airflow", logo_url: "https://upload.wikimedia.org/wikipedia/commons/d/de/AirflowLogo.png", category: "engineering" },
    { id: 10, name: "PostgreSQL", logo_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", category: "database" },
    { id: 11, name: "MongoDB", logo_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", category: "database" },
    { id: 12, name: "Docker", logo_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", category: "devops" },
    { id: 13, name: "AWS", logo_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg", category: "cloud" },
    { id: 14, name: "FastAPI", logo_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg", category: "api" },
    { id: 15, name: "Git", logo_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", category: "tools" },
    { id: 16, name: "Linux", logo_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg", category: "tools" },
  ];
};