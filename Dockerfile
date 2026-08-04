# Ultra-lightweight production Nginx container for CoachFlow
FROM nginx:alpine

# Copy static website files into Nginx html directory
COPY . /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
