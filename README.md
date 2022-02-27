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

### Configurando acesso SSH

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

~ ## Configurar ambiente da GitHub~

~ - Ainda logado no servidor copie a saída do comando ~

~ `cat ~/.ssh/id_rsa.pub`~

~e cole na aba Settings no *Deploy keys* do projeto~

