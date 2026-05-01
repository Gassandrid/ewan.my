---
date: 2024-08-09
updated: 2026-01-15T17:10:42-05:00
class:
  - note
tags:
  - cs/software
  - cs/crypto
  - generated
  - resource/programming/cli
source:
related:
  - "[[Age]]"
---
GnuPG (GPG), short for **GNU Privacy Guard**, is a free and open-source implementation of the OpenPGP standard, enabling users to encrypt and sign data and communications. GPG is widely used for secure email communication, file encryption, and digital signatures, ensuring the confidentiality and authenticity of data.

---

## Features

1. **Encryption and Decryption:**
    - GPG allows users to encrypt data so that only the intended recipient with the correct private key can decrypt it.
    - It supports both symmetric (single-key) and asymmetric (public/private key) encryption.
2. **Digital Signatures:**
    - Users can sign messages and files to provide proof of authenticity and integrity.
    - Signatures can be verified by others using the corresponding public key, ensuring that the data has not been tampered with.
3. **Key Management:**
    - GPG provides robust tools for generating, importing, exporting, and managing public and private keys.
    - It supports creating revocation certificates, allowing users to revoke their keys if they are compromised.

### Basic Usage

1. **Generating a Key Pair:**
    `gpg --full-generate-key`
2. **Encrypting a File:**
    `gpg --output file.txt.gpg --encrypt --recipient recipient@example.com file.txt`
    - `--output` specifies the output file.
    - `--encrypt` tells GPG to encrypt the file.
    - `--recipient` specifies the recipient's email or key ID.
3. **Decrypting a File:**
    `gpg --output file.txt --decrypt file.txt.gpg`
4. **Signing a File:**
    `gpg --output file.sig --sign file.txt`
    `gpg --clearsign file.txt`
5. **Verifying a Signature:**
    `gpg --verify file.sig file.txt`

### Key Management

1. **Importing a Public Key:**
    If you receive someone's public key, you can import it into your keyring:
    `gpg --import publickey.asc`
2. **Exporting a Public Key:**
    `gpg --output publickey.asc --export --armor your-email@example.com`
3. **Listing Keys:**
    `gpg --list-keys`
    `gpg --list-secret-keys`
4. **Revoking a Key:**
    `gpg --import revocation-cert.asc`
