---
title: "Signing & Encryption"
description: "Sign and encrypt mail in grommunio Web with S/MIME certificates or OpenPGP keys: setting up keys, sending protected mail and reading signed and encrypted messages."
sidebar:
  order: 68
---

A **digital signature** proves who sent a mail and that nobody changed it on the way. **Encryption** makes sure that only the recipients can read it. grommunio Web supports both common standards:

| | S/MIME | OpenPGP |
|---|---|---|
| **Based on** | certificates issued by a certificate authority | keys you create yourself |
| **Typical use** | companies and public authorities | individuals, developers, privacy-minded users |
| **Trust** | via the certificate authority | via fingerprints you verify yourself |
| **In grommunio Web** | certificate stored on the server, protected by a passphrase | keys created and used in your browser, stored passphrase-protected in your mailbox |

Both use the same pair of buttons in the mail editor: **Sign** and **Encrypt**.

![The compose toolbar with the Sign and Encrypt buttons on the right](/img/web/web_compose_pgp_toolbar.png)
 A mail can be protected with one of the two standards, not both at once.

:::note
S/MIME is available by default. OpenPGP is an optional plugin that your administrator must enable; you then switch it on under [Settings › Plugins](/web/settings/#plugins).
:::

## S/MIME

### Uploading your certificate

You receive your personal certificate from your IT department or a certificate authority, usually as a `.p12` or `.pfx` file with a passphrase.

1. Open **Settings › S/MIME**.
2. Under **Upload your certificate**, click **Select** and choose the file.
3. Enter the **Certificate passphrase**.
4. Click **Upload**.

![The S/MIME settings with a valid personal certificate, the upload area and the list of public and private certificates](/img/web/web_smime_settings.png)

The status line then reads *You have a valid certificate corresponding to your account*. The list **Public & Private certificates** shows your own certificate and the public certificates of your contacts. Use **Details** to inspect a certificate and **Remove** to delete one.

Under **Personal certificate** you can change the passphrase and choose the default encryption algorithm (AES-256-GCM recommended) and signing digest (SHA-256 recommended).

### Sending signed or encrypted mail

In a new mail, click **Sign**, **Encrypt** or both. The arrow next to each button lets you choose **S/MIME** or **OpenPGP** and offers the S/MIME options for this mail.

- **Signing** asks for your certificate passphrase when you send. If your administrator allows it, your browser can remember it for the session.
- **Encrypting** needs the public certificate of every recipient. grommunio Web collects certificates automatically from signed mails you receive and from the address book. If one is missing, grommunio Web tells you which recipients cannot receive encrypted mail.

:::tip
Send a signed mail to the people you want to exchange encrypted mail with, and ask them to do the same. This way you get each other's certificates.
:::

### Reading S/MIME mail

Signed and encrypted mails show a status line in the header, for example *Signature verified successfully* or *Message decrypted successfully*. For an encrypted mail you first click *Please click here to unlock your certificate* and enter your passphrase. Click the status line to see the details: who signed the mail, whether the certificate is valid and trusted, and which algorithms were used.

## OpenPGP

### Creating your key

1. Open **Settings › OpenPGP**.
2. Click **Generate key**.
3. Enter your **Name** and check the **Email** address.
4. Choose the **Algorithm** (RSA 3072, RSA 4096, Ed25519 or Curve25519) and when the key **Expires in**.
5. Enter a **Passphrase** of at least 12 characters twice. Choose a strong one you can remember; nobody can recover it for you.
6. Click **Generate**.

![The Generate OpenPGP key dialog with name, e-mail, algorithm, expiry and passphrase](/img/web/web_pgp_generate.png)

The key is generated in your browser. Afterwards grommunio Web shows your **revocation certificate**. Download it and keep it in a safe place: with it you can declare your key invalid if you ever lose it or the passphrase.

![The Revocation certificate — keep secure window with the certificate and a Download button](/img/web/web_pgp_revocation.png)

### Managing keys

![The OpenPGP settings with the key list, the buttons Generate key, Import key and Find public key, and the defaults for new messages](/img/web/web_pgp_keys.png)

- **Import key** imports a key from a `.asc` file or pasted text, for example your existing private key or the public key of a contact.
- **Find public key** looks up a public key on a key server by its full fingerprint.
- **Details / verify** shows a key and lets you **verify its fingerprint**. Compare the fingerprint with your contact over another channel, for example by phone, then tick *I verified this fingerprint*. Only verified keys are used for encryption.
- **Export public key** gives you your public key to pass on to others. Its menu also offers **Back up private key** (encrypted with your passphrase).
- **Private key** ▸ **Unlock in this browser** or **Change passphrase**. **Lock all** locks all unlocked keys again.
- **Delete** removes a key; you confirm by typing its fingerprint.
- **Default private key**, **Sign new messages by default** and **Encrypt new messages by default** set the defaults for new mail.
- **Manage keyservers** lists the key servers used for *Find public key*.

:::note
grommunio Web never uploads your keys to a key server. Your private key is stored in your mailbox only in passphrase-protected form, and signing, encryption and decryption happen in your browser.
:::

### Sending OpenPGP mail

1. Write your mail.
2. Click the arrow next to **Encrypt** (and/or **Sign**) and choose **OpenPGP**.

![The Encrypt menu with the options S/MIME and OpenPGP and the OpenPGP options](/img/web/web_compose_encrypt_menu.png)

3. Click **Send**. If you have several keys, grommunio Web asks which one to use:

![The Choose OpenPGP key dialog](/img/web/web_pgp_choose_key.png)

4. Enter your passphrase to unlock your private key:

![The Unlock OpenPGP private key dialog with the passphrase field](/img/web/web_pgp_unlock.png)

The key stays unlocked in this browser tab for a few minutes, so you don't have to enter the passphrase for every mail. It is locked again automatically, or when you close the tab.

To encrypt, grommunio Web needs a **verified** public key of every recipient. If one is missing or not verified, you are told which recipient is affected. Expand distribution lists into single recipients before encrypting.

:::caution
While encryption is selected, grommunio Web does not save automatic drafts, so that no unencrypted copy of your text is stored on the server. Save important texts yourself.
:::

### Reading OpenPGP mail

An encrypted mail shows *OpenPGP: Encrypted message — unlock your private key to read*:

![An encrypted mail in the reading pane with the line OpenPGP: Encrypted message — unlock your private key to read](/img/web/web_pgp_encrypted.png)

Click the line, enter your passphrase, and the mail is decrypted in your browser:

![A decrypted mail with the status OpenPGP: Message decrypted · Valid signature from a verified sender](/img/web/web_pgp_decrypted.png)

The status line tells you whether the signature is valid and whether the sender's key is verified, for example *Valid signature from a verified sender*, *Valid signature — sender fingerprint has not been verified* or *Signature could not be verified*. Click it for the details. Replying and forwarding work as usual; the decrypted text never leaves your browser.
