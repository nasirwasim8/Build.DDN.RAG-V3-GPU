module.exports = {
  apps: [
    {
      name: "ddn-vss-backend",
      script: "/home/nwasim/projects/Build.DDN.Semantic_Search/backend/venv/bin/uvicorn",
      args: "main:app --host 0.0.0.0 --port 8001 --workers 2",
      cwd: "/home/nwasim/projects/Build.DDN.Semantic_Search/backend",
      interpreter: "none",
      env: { PYTHONUNBUFFERED: "1" },
      env_file: "/home/nwasim/projects/Build.DDN.Semantic_Search/backend/.env",
      autorestart: true, max_restarts: 10,
    },
  ],
};
