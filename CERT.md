# Cert HTTPS
## 1. Generate a private key
## 2. Create a CSR ( Certificate signing request) using the private key
## 3. Generate the SSL certificate from CSR


# C1
```cmd
    mkdir cert
    cd cert
    openssl genrsa -out key.pem
    openssl req -new -key key.pem -out csr.pem
    VI /""/""/ pickurpage llp /""/""/nguyentientai@gmail.com/ ""
    openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem
```

# C2
```cmd
    sudo apt install mkcert
    mkcert -install
    mkcert -key-file key.pem -cert-file cert.pem example.local "*.example.local"
```
