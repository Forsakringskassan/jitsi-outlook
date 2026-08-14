# Jitsi Outlook Plugin

This none root image provides a lightweight jitsi-outlook plugin implementation.\
The image builds on nginx and have been hardened using gixy standards.

**To add more manifests and configs use a volume mount or build from source!**

## 🚀 Quick Start

Run the container using the command below. Make sure to replace the placeholder values with your actual configuration.

```bash
docker run -d \
  -p 8080:8080 \
  -e NGINX_HOST="localhost" \
  -e NGINX_PORT="8080" \
  --name jitsi-outlook \
  ghcr.io/forsakringskassan/jitis-outlook:latest
```

## ⚙️ Environment Variables

Configure the container behavior using these variables:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NGINX_HOST` | **Required.** Hostname where the service is running. | `localhost` |
| `NGINX_PORT` | **Required.** Port running the service. | `8080` |

## 📦 Ports

* `8080`: The application serves traffic on this port by default.

## 💾 Volume mounts

To include extra manifests or config files mount these to /data and a script will copy them to the correct folders.

| Mount | Mount point |
| :--- | :--- |
| manifests/ | /data/manifests |
| configs/ | /data/configs |
| assets/ | /data/assets |

## ⚓ Helm
Comming soon!
