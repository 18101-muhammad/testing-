# EC2 Auto Deploy

This repository now includes a GitHub Actions workflow that deploys the app to one EC2 machine on every push to `main`.

## Do Not Do This

Do not place a private SSH key inside this repository or anywhere under the project folder.

Use a GitHub secret instead.

## Deployment Shape

- GitHub Actions builds a release archive from the repo.
- GitHub uploads the archive and the deploy script to EC2 over SSH.
- EC2 installs dependencies, builds the React app, updates Nginx static files, and restarts the Node API with PM2.
- SQLite and uploaded files stay on the EC2 machine in a shared data directory.

## GitHub Secrets

Create these repository secrets in GitHub:

- `EC2_HOST`: your EC2 public IP or DNS name
- `EC2_USERNAME`: `ec2-user`
- `EC2_SSH_KEY`: the private key content for the EC2 instance
- `EC2_PORT`: optional, usually `22`
- `DEPLOY_APP_SLUG`: optional, default `antique-shop`
- `DEPLOY_ROOT`: optional, default `/home/ec2-user/apps/antique-shop`

## One-Time EC2 Setup

SSH into the server and run:

```bash
sudo yum update -y
sudo yum install -y git nginx
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
sudo npm install -g pm2
sudo mkdir -p /home/ec2-user/apps/antique-shop/shared
sudo chown -R ec2-user:ec2-user /home/ec2-user/apps
```

Create the backend env file at `/home/ec2-user/apps/antique-shop/shared/server.env`:

```dotenv
PORT=5000
CLIENT_URL=http://13.60.13.146
JWT_SECRET=replace-this-with-a-long-random-value
WHATSAPP_NUMBER=replace-with-your-number
DATA_DIR=/home/ec2-user/apps/antique-shop/shared/data
```

Create the frontend build env file at `/home/ec2-user/apps/antique-shop/shared/client.env.production`:

```dotenv
REACT_APP_API_BASE_URL=/api
REACT_APP_MEDIA_BASE_URL=http://13.60.13.146
```

Install the Nginx site config:

```bash
sudo cp /home/ec2-user/deployments/<run-id>/deploy/nginx-antique-shop.conf /etc/nginx/conf.d/antique-shop.conf
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx
```

You can also copy the file from this repo manually:

- [deploy/nginx-antique-shop.conf](/C:/Users/mabdullah.EUROLINK-M3/Downloads/project/deploy/nginx-antique-shop.conf)

Enable PM2 startup once:

```bash
pm2 startup systemd -u ec2-user --hp /home/ec2-user
```

Run the command PM2 prints, then:

```bash
pm2 save
```

## First Deployment

After the secrets are created and the EC2 setup is done:

1. Push this repository to GitHub.
2. Push a commit to `main`.
3. GitHub Actions will deploy the current code to EC2.

## Notes

- This setup is for a single EC2 instance because the app uses SQLite.
- Keep `server.env`, `client.env.production`, the SQLite database, and uploads only on the server.
- If you later add a domain and HTTPS, update `CLIENT_URL`, `REACT_APP_MEDIA_BASE_URL`, and the Nginx config.
