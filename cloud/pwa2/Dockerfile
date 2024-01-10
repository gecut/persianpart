FROM node:20-alpine as builder

WORKDIR /app

ENV NODE_ENV production

RUN apk add --no-cache git

COPY . .

# # Reinstall to link internal packages
RUN yarn install --immutable 

# Build target package
ARG APP_NAME

RUN set -ex;\
    if [ -z "${APP_NAME}" ]; then\
      echo 'APP_NAME not defined'>&2;\
      exit 1;\
    fi;

RUN set -ex;\
    yarn run "${APP_NAME}":build --force=true --with-deps=true;\
    pwd; ls -lahF;

# ---

FROM nginx:stable-alpine as nginx

RUN rm -rfv /etc/nginx/conf.d/
RUN rm -rfv /etc/nginx/nginx.conf

COPY cloud/pwa2/nginx /etc/nginx/

ARG APP_NAME

COPY --from=builder dist/apps/${APP_NAME}/ /var/www/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
