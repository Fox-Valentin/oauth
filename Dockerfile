FROM        nginx:latest
MAINTAINER  hanhongliang@juntu.com
COPY        dist/* /usr/share/nginx/html/
COPY        nginx/default.conf /etc/nginx/conf.d/default.conf
CMD         ["nginx", "-g", "daemon off;"]