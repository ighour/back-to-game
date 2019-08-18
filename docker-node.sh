docker run -it -u \
$(id -u ${USER}):$(id -g ${USER}) \
--rm --name node \
-v "$PWD":/usr/src/app \
-w /usr/src/app \
-p 8080:8080 \
node /bin/bash