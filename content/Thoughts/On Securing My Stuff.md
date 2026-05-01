---
date: 2025-04-24
updated: 2025-07-26
tags:
  - seed
  - cs/crypto
---
 For almost as long as I can remember, I have used one or two passwords for just about every account of mine. This was a TERRIBLE idea, and was worsened by the fact that these lone passwords were not very good to begin with.

 This had to change, and especially since I am a computer scientist, I should value online security and encryption more than anyone else.

---

## Hardware Keys

I am sure everyone is familiar with 2 or multi factor authentication by now. You sign in to your account with your password, and then after it asks you to put in a code from SMS or an authenticator app.

For most cases, this is really strong, but it has some weaknesses. For one, these codes are still vulnerable to phishing, and SMS/other MFA sources can never be guaranteed to be secure.

This is where hardware keys come in. Physical keys, while seemingly a bit obsolete in the modern world, offer unparalleled security and are usually required by the most security dependent organizations in the world.

Unless you yourself are physically inserting the key into a computer, there is no other way to get into your account through phishing or some other vulnerability. Not only that, but it simplifies the security pipeline, as it is as robust as inserting this device into your computer.

---

I ended up getting two **YubiKeys** for myself, which is considered to be the industry standard support all sorts of cryptography methods.

I use it in a variety of ways, but namely to replace those stupid 6 digit codes every service makes you find on your phone. However, this is not all security keys can do.

Another way would be to act as a passkey, which while a bit new and not well adopted, allow you to access a service without any password at all, only using the hardware key as the identifier(or some other biometric marker). This is a little weird of an idea, but if you think about it, it is a much bigger security vulnerability to have a password you know rather than one you don't.

But the big thing it has done for me beyond my online life is simplifying my RSA encryption pipeline. I really love encryption stuff, and use `pass` and `gpg` to handle all sorts of encryption work. The RSA algorithm is asymmetric(public key - private key), but using my YubiKey I can abstract over all those concepts and just insert my key when I want to decrypt one of my files.

The next big step is integrating properly with a password manager. While I did change all my passwords to each their own, I have it using the GNU `pass` command line app which is a little too crude for me. I would love the autofill integration into browsers, while also syncing in between all my devices.
