# ENCDEC
## A CLI tool made for encryption and decryption of texts.

This project is a tool used to encrypt and decrypt texts using AES-256-GCM.

### Key Features
- Encryption and decryption of texts
- Supports manual Initialization Vectors
- Compatible with utf8, base64 and hex formats


### Instalation

This tool can be installed manually or by using Docker.

#### Manual (Recommended for Linux)

1. Download the latest version of [Node.js](https://nodejs.org)

2. Download the [latest release](https://github.com/mateus-eduardo-dias/encdec/releases) of ENCDEC<br>

3. Move the executable to /usr/local/bin
```bash
sudo cp ./encdec /usr/local/bin/
```

4. Run the executable
```bash
encdec [arguments]
```

#### Using Docker (Recommended for Windows or MacOS)

1. Get the Docker Image <br>
```bash
docker pull mateuseduardodias/encdec:1.0
```

2. Run the Docker Image <br>
```bash
docker run --rm mateuseduardodias/encdec:1.0 [arguments]
```
See about [arguments] in Usage section

### Usage

A AES-256-GCM returns a cipher text based on values like Initialization Vector, Authentication Tags, Keys, etc...
Results may be different

#### Encrypting:
```bash
encdec --i hello
```
Returns:
```
Encrypted:  e85f56d656  (hex)
AuthTag:  6d96e4e7604cda3beffb6e7ce6295d7f  (hex)
IV:  666bde321fe2adee984fdb79  (hex)
Key:  ff7d1e84b9169fe2ce045d263156c66119df56ba3beda2da781d8c23ae8757ea  (hex)
```
<br>

#### Decrypting
```bash
encdec -d --i e85f56d656 --at 6d96e4e7604cda3beffb6e7ce6295d7f --k ff7d1e84b9169fe2ce045d263156c66119df56ba3beda2da781d8c23ae8757ea --iv 666bde321fe2adee984fdb79
```
Returns:
```
Decrypted:  hello  (utf8)
```
<br>

#### Encrypting with custom key:
```bash
encdec --i hello --k ff7d1e84b9169fe2ce045d263156c66119df56ba3beda2da781d8c23ae8757ea
```
Returns:
```
Encrypted:  635e510424  (hex)
AuthTag:  b447334dadb728d45a6a95ede181646c  (hex)
IV:  d646e926650ef874bf8215fe  (hex)
Key:  ff7d1e84b9169fe2ce045d263156c66119df56ba3beda2da781d8c23ae8757ea  (hex)
```
<br>

#### Encrypting with custom key and format
```bash
encdec --i hello --k abcdefghijklmnopqrstuvwxyzabcdef --kf utf8
```
Returns:
```
Encrypted:  eb42dafd4e  (hex)
AuthTag:  53ef036a5ea1d2f49cccebe1954bfdd8  (hex)
IV:  bd60004accc5880ddd91a19d  (hex)
Key:  abcdefghijklmnopqrstuvwxyzabcdef  (utf8)
```
<br>

#### Encrypting with custom IV and format (not recommended)
```bash
encdec --i hello --iv abcdefghijkl --ivf utf8
```
Returns:
```
Encrypted:  1500b21d3a  (hex)
AuthTag:  a099a935e31d09c4e9e650944fd8be52  (hex)
IV:  abcdefghijkl  (utf8)
Key:  a5bd9633d17b9a4dda72dbd6b9d156562ada5f49045a854f14b95581a7ffc316  (hex)
```
<br>

#### Encrypting with custom input format
```bash
encdec --i 5fa42b8a --if hex
```
Returns:
```
Encrypted:  db542649  (hex)
AuthTag:  f4fc827185a05fe6bab3f26584b258f8  (hex)
IV:  d9f090289adaf000a2b5fb75  (hex)
Key:  6f90677dea46aeb1af5987efe3a921c4263fedc01a4aed91203a1ea8ad41b562  (hex)
```

### Flags

A flag is identified by having a single slash before its name (`-`). There's only one flag in ENCDEC (more coming out soon)

- -d: decryption flag, used for decrypting texts/words

### Parameters

A parameter is identified by having a double slash before its name (`--`) and for having a value coming after.

- --i INPUT: input parameter, defines a <u>INPUT</u> value (plaintext/ciphertext) - Required for every encryption/decryption operation
- --if FORMAT: input format parameter, defines the <u>FORMAT</u> of the <u>INPUT</u> value
	+ DEFAULT: utf8 (encryption) / hex (decryption)
	+ REQUIREMENTS: --i parameter

- --k KEY: key parameter, defines a <u>KEY</u> value for encryption/decryption
	+ DEFAULT:  [RANDOM]
	+ SIZE: 32 bytes (256 bits)
- --kf FORMAT: key format parameter, defines the <u>FORMAT</u> of the <u>KEY</u> value
	+ DEFAULT: hex
	+ REQUIREMENTS: --k parameter
- --at AUTH_TAG: auth tag parameter, defines a <u>AUTH_TAG</u> value for decryption - Required for decryption only
- --atf FORMAT: auth tag format parameter, defines the <u>FORMAT</u> of the <u>AUTH_TAG</u> value
	+ DEFAULT: hex
	+ REQUIREMENTS: --at parameter
- --of FORMAT: output format parameter, defines the <u>FORMAT</u> of the output value
	+ DEFAULT: hex (encryption) / utf8 (decryption)
- --iv IV: iv parameter, defines a <u>IV</u> value (initialization vector) for encryption/decryption
	+ SIZE: 12 bytes (96 bits)
- --ivf FORMAT: iv format parameter, defines the <u>FORMAT</u> of the <u>IV</u> value
	+ DEFAULT: hex
	+ REQUIREMENTS: --iv parameter

### Formats

ENCDEC supports 3 formats for now (more coming soon)

- utf8 / utf-8: Unicode format [8 bits for ASCII characters + 24 bits for other characters]
	- SIZE: 1-4 bytes per character
- hex: Hexadecimal Format [0-9 A-F]
	+ SIZE: 2 characters per byte
- base64: Base 64 Format [A-Z a-z 0-9 + / (= for padding)]

### Contribuitors

Mateus Eduardo [mateuseduqueiroz@proton.me](mailto:mateuseduqueiroz@proton.me)