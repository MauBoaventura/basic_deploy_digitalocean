# Configurar ambiente da DigitalOcean com Nodejs

- Automate deploy to DigitalOcean with GitHub Actions

[Connection GitHub Actions by SSH](https://medium.com/@chathula/how-to-set-up-a-ci-cd-pipeline-for-a-node-js-app-with-github-actions-2073201b0df6) 

[Install Docker on Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04-pt)

## Configurar droplet da DigitalOcean
- Antes de tudo é necessário criar um droplet no marketplace da DigitalOcean pondo NodeJs 
- Configurar chave SSH da sua maquina local na criação do droplet
- Se conectar via ssh com comando 'ssh root@SERVER.IP'

### Criar um novo usuário
- Acesse a maquina com :

    `ssh root@SERVER.IP`

- Após entrar na maquina com o usuário root, faça:
- 
    `adduser <username>`

    `usermod -a -G sudo <username>`

    Depois abra o arquivo `/etc/passwd` e onde tem um "x" após o username, basta apagar **apenas o x**

#### Configurando acesso SSH

Em seguida execute os comandos:

- `su - username`

- `mkdir .ssh`

- `chmod 700 .ssh/`

- `vim ~/.ssh/authorized_keys`

    Agora cole a sua chave pública que fica em  `.../.ssh/id_rsa.pub` no *authorized_keys* para ter acesso ao novo usuário com conexão ssh.

- `chmod 600 ~/.ssh/*`

### Adicional

Agora para acessar usa-se : `ssh username@SERVER.IP `

- Instala-se o git : `sudo apt-get install git`
- Roda o comando : `ssh-keygen`
## Instalar o Docker e Docker-compose
 Como já existem milhoes de tutoriais de como instalar o docker, siga a [documentação oficial docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04-pt) e [documentação oficial docker-compose](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04-pt).
 
 É importante dar permissão para o novo usuário poder rodar o comando `docker`

## Configurar os arquivod Dockerfile e docker-compose.yml
- É necessário criar em seu projeto um arquivo docker-compose.yml para configurar a orquestrção dos containers, que nesse caso é só mais um serviço node rodando na porta `3001`.
```yml
version: '3.4'

services:
  basicdeploydigitalocean:
    image: basicdeploydigitalocean
    build:
      context: .
      dockerfile: ./Dockerfile
    environment:
      NODE_ENV: production
    ports:
      - 3001:3001

```

- E é preciso tambem criar um arquivo Dockerfile que irá dizer como o container se comportará

```Dockerfile
FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3001
RUN chown -R node /usr/src/app
USER node
CMD ["node", "index.js"]
```

## Configurar GitHub Actions para deploy

Vá em `https://github.com/<usuarioGitHub>/<repositorio>/settings/secrets/actions` e configure as seguintes chaves:
| **Name**     | **Value**                                                |
|--------------|----------------------------------------------------------|
| SSH_HOST     | Endereço IP do servidor da DigitalOcean                  |
| SSH_KEY      | A chave ssh da sua maquina que tenha acesso ao servidor* |
| SSH_PORT     | 22                                                       |
| SSH_USERNAME | Usuário criado para acesso ao servidor                   |

*no caso a chave privada da sua máquina `~/.ssh/id_rsa`.

![image](https://user-images.githubusercontent.com/18109053/155901912-4aa78977-a243-49ba-8bb1-93b26566a444.png)


- Finalizado isso vá no seu repositorio clique em *Actions*
![image](https://user-images.githubusercontent.com/18109053/155900124-a8f9495b-0616-40bc-ab8a-07ed77a6cad0.png)


- Como o projeto é em node podemos usar esse como modelo
![image](https://user-images.githubusercontent.com/18109053/155900227-a00edc43-52b7-42dd-a1c5-6098e85079e1.png)

Assim será criado um arquivo `.yml` no caminho `.github/workflows/`
![image](https://user-images.githubusercontent.com/18109053/155900286-c6fe1c8a-3af4-498e-9559-2ba959749fd7.png)

nesse você deve colar o seguinte código:

```yml
name: Node Github CI

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: SSH and deploy node app
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SSH_HOST }}
        username: ${{ secrets.SSH_USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          whoami
          mkdir ~/containers 
          cd ~/containers
          git clone git@github.com:<usuarioGitHub>/<repositorio>.git
          cd <repositorio>
          git pull origin main
          docker-compose down --rmi all
          docker-compose up -d --no-deps --build
  ```
Assim finalizamos a configuração do Pipeline. 
Sempre que a branch _main_ sofrer alteração o pipeline será executado  

