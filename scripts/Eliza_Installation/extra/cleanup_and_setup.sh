# Navigate to project directory
cd /mnt/LLM/eve_predict

# Clean up existing node_modules and lock files
rm -rf node_modules
rm -rf ./**/node_modules
rm -f pnpm-lock.yaml
rm -f package-lock.json
rm -f yarn.lock

# Set proper permissions for the project directory
sudo chown -R $USER:$USER .
sudo chmod -R 755 .

# Reinstall pnpm globally with proper permissions
sudo npm install -g pnpm

# Clear pnpm store and cache
pnpm store prune
pnpm cache clean

# Fresh install with proper permissions
pnpm install --force