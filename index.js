'use strict'
import crypto from 'crypto'

const args = process.argv.slice(2)

if (args.length == 0) {
	console.log("Use --help")
	process.exit(0)
}

const flags_list = ['d']
const parameters_list = ['k', 'kf', 'iv', 'ivf', 't']
const parameters = new Map()
const flags = new Map()

// Check flags and parameters
for (let i = 0; i < args.length; i++) {
	let arg = args[i]
	if (arg.slice(0,2) == '--') { // Parameter
		let parameter = arg.slice(2)
		if (i != args.length - 1 && parameters_list.includes(parameter)) {
			parameters.set(parameter, args[i+1])
			i++;
		} else {
			console.error(`Error: Parameter ${arg} doesn't exist or has no value`)
			process.exit(2)
		}
	} else if (arg.slice(0,1) == '-') { // Flag
		let flag = arg.slice(1)
		if (flags_list.includes(flag)) {
			flags.set(flag, true)
		} else {
			console.error(`Error: Flag ${arg} is invalid`)
			process.exit(2)
		}
	}
}

const text_formats = ['utf8', 'hex', 'base64', 'utf-8']

const key_format = parameters.has('kf') ? parameters.get('kf') : 'hex'
if (!text_formats.includes(key_format)) {
	console.error(`Error: Parameter --kf is invalid: ${key_format}`)
	process.exit(2)
}

const key =  parameters.has('k') ? Buffer.from(parameters.get('k'), key_format) : crypto.randomBytes(32)
if (key.length != 32) {
	console.error(`Error: Key size is invalid: ${key.length}b (expected: 32b)`)
	process.exit(2)
}


const iv_format = parameters.has('ivf') ? parameters.get('ivf') : 'hex'
if (!text_formats.includes(iv_format)) {
	console.error(`Error: Parameter --ivf is invalid: ${iv_format}`)
	process.exit(2)
}

const iv = parameters.has('iv') ? Buffer.from(parameters.get('iv'), iv_format) : crypto.randomBytes(12)
if (iv.length != 12) {
	console.error(`Error: IV size is invalid: ${iv.length}b (expected: 12b)`)
	process.exit(2)
}

const plaintext_format = parameters.has('tf') ? parameters.get('tf') : 'utf8'
if (!text_formats.includes(plaintext_format)) {
	console.error(`Error: Parameter --tf is invalid: ${plaintext_format}`)
	process.exit(2)
}

const plaintext = parameters.has('t') ? parameters.get('t') : 0
if (plaintext === 0) {
	console.error(`Error: Parameter --t wasn't found, text is invalid`)
	process.exit(2)
}

const output_format = parameter.has('of') ? parameters.get('of') : 'hex'
if (!text_formats.includes(output_format)) {
	console.error(`Error: Parameter --of is invalid: ${output_format}`)
	process.exit(2)
}

if (!flags.has('d')) { // Encryption
	const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

	let encrypted = cipher.update(plaintext, plaintext_format === 0 ? 'utf8' : plaintext_format, 'hex')
	encrypted += cipher.final('hex')

	const authTag = cipher.getAuthTag()
	console.log('Encrypted: ', encrypted)
	console.log('AuthTag: ', authTag.toString('hex'))
	console.log('IV: ', iv.toString('hex'))
	console.log('Key: ', key.toString('hex'))
} else { // Decryption
	let decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
	decipher.setAuthTag(authTag)

	let decrypted = decipher.update(encrypted, 'hex', 'utf8')
	decrypted += decipher.final('utf8')
	console.log('Decrypted: ', decrypted)
}

