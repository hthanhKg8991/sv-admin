#Web Admin Siêu Việt
Node version 10-12
    
Install Package:

    npm install

Run Dev:

    npm start

Install serve

    npm install -g serve

Run Prod:

    npm run build
    npm run startserver hoặc serve -s build -l 8082 

# ***RUN BẰNG DOCKER***
***(NODE VERSION 14.15.0)***
**Required:**

- [x] Docker
- [x] ENV File
- [x] Install make of ubuntu
- [x] Traefik (Reverse proxy domain to port) [ Sieuviet Gitlab](https://gitlab.sieuviet.services/adminv2/docker/traefik) (Authorize needed)

1. Init docker create network
    ```
    Make init
    ```
2. Build container Docker
    ```
    Make build
    ```
3. Start container Docker
    ```
    Make start
    ```
4. Restart container Docker
    ```
    Make restart
    ```
5. Stop container Docker
    ```
    Make stop
    ```

Chào mừng 1.0.5
    


