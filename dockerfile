FROM denoland/deno:1.39.2

#DENO_DEPLOYMENT_ID is required but in prod docker compose will inject it!
#ARG GIT_REVISION
#ENV DENO_DEPLOYMENT_ID=${GIT_REVISION}

WORKDIR /app

COPY . .

RUN deno cache main.ts

RUN deno task build

EXPOSE 3000

CMD ["run","-A","--unstable","main.ts"]

