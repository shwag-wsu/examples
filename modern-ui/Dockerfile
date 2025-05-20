FROM nginx:alpine

# Copy built UI from the dist folder into nginx's default public directory
COPY dist/ /usr/share/nginx/html

# Optional: Add custom NGINX config if needed
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]