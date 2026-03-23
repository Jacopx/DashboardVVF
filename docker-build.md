docker buildx create --use --name multiplatform

docker buildx build --platform linux/amd64,linux/arm64 -t jacopx/dashboardvvf-backend:latest --push ./backend

docker buildx build --platform linux/amd64,linux/arm64 -t jacopx/dashboardvvf-frontend:latest --push ./frontend