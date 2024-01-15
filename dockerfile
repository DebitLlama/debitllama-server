FROM denoland/deno:1.39.2

ARG GIT_REVISION
ENV DENO_DEPLOYMENT_ID=${GIT_REVISION}


WORKDIR /app

COPY . .

RUN deno cache main.ts

EXPOSE 3000

CMD ["run","-A","--unstable","main.ts"]

