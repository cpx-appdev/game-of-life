# This is a default site configuration which will simply return 404, preventing
# chance access to any other virtualhost.

server {
        listen 80 default_server;
        listen [::]:80 default_server;

        location / {
                root /app;
        }

        # You may need this to prevent return 404 recursion.
        location = /404.html {
                internal;
        }
}