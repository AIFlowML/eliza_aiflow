# Eve Predict Server Setup Documentation

## Server Information
- Domain: evepredict.com
- Server Location: India
- IP Address: 145.223.19.53

## Initial Setup

### Directory Structure
```bash
# Create application directory
sudo mkdir -p /var/www/eve_predict
sudo chown -R $USER:www-data /var/www/eve_predict
sudo chmod -R 755 /var/www/eve_predict
```

## Repository Setup

### Clone and Branch Configuration
```bash
# Navigate to application directory
cd /var/www/eve_predict

# Clone repository directly into current directory
git clone https://github.com/AIFlowML/eliza_aiflow.git .

# Switch to the add-slack-plugin branch
git checkout add-slack-plugin

# Create and switch to the development branch
git checkout -b eve-predict-webapp
```

### Repository Details
- Repository: https://github.com/AIFlowML/eliza_aiflow.git
- Base Branch: add-slack-plugin
- Development Branch: eve-predict-webapp
- Location: /var/www/eve_predict

### Branch Strategy
- `add-slack-plugin`: Base branch containing the initial setup
- `eve-predict-webapp`: Development branch for customizations and new features
- All new changes will be made in the `eve-predict-webapp` branch
- Original code remains preserved in the `add-slack-plugin` branch

## Nginx Configuration

### Installation
```bash
sudo apt-get install nginx -y
```

### Site Configuration
Created configuration file at `/etc/nginx/sites-available/evepredict.com` with the following content:

```nginx
server {
    listen 80;
    listen [::]:80;
    
    server_name evepredict.com www.evepredict.com;
    
    root /var/www/eve_predict;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Additional security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
}
```

### Enable Site Configuration
```bash
sudo ln -s /etc/nginx/sites-available/evepredict.com /etc/nginx/sites-enabled/
```

## SSL Certificate Setup

### Install Certbot
```bash
sudo apt-get install certbot python3-certbot-nginx -y
```

### Obtain SSL Certificate
```bash
sudo certbot --nginx \
    -d evepredict.com \
    -d www.evepredict.com \
    --email ilessio.aimaster@gmail.com \
    --agree-tos \
    --non-interactive
```

### SSL Certificate Details
- Certificate Location: `/etc/letsencrypt/live/evepredict.com/fullchain.pem`
- Private Key Location: `/etc/letsencrypt/live/evepredict.com/privkey.pem`
- Expiration Date: March 16, 2025
- Auto-renewal: Enabled (via Certbot's automated task)
- Registered Email: ilessio.aimaster@gmail.com

## Post-Installation Steps
```bash
# Test Nginx configuration
sudo nginx -t

# Restart Nginx to apply changes
sudo systemctl restart nginx
```

## Access Points
- HTTP: http://evepredict.com
- HTTPS: https://evepredict.com
- WWW: https://www.evepredict.com

## Maintenance Notes
1. SSL certificates will auto-renew approximately 30 days before expiration
2. Certbot will send notifications to ilessio.aimaster@gmail.com for any certificate-related issues
3. The application is configured to run on port 3000
4. Nginx is set up to proxy all requests to the Node.js application

## Security Features
1. HTTPS enabled with automatic redirection from HTTP
2. Modern security headers configured
3. Regular certificate auto-renewal
4. Proper file permissions set on application directory
