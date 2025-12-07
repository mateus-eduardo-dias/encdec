'use strict'
import crypto from 'crypto'

const args = process.argv.slice(2)

if (args.length == 0) {
	console.log("Use --help")
	process.exit(0)
}

const flags_list = ['d']
const parameters_list = ['k', 'kf', 'iv', 'ivf', 'i', 'if', 'o', 'of', 'at', 'atf']
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
const key_provided = parameters.has('k')
const key =  key_provided ? Buffer.from(parameters.get('k'), key_format) : crypto.randomBytes(32)
if (key.length != 32) {
	console.error(`Error: Key size is invalid: ${key.length}b (expected: 32b)`)
	process.exit(2)
}


const iv_format = parameters.has('ivf') ? parameters.get('ivf') : 'hex'
if (!text_formats.includes(iv_format)) {
	console.error(`Error: Parameter --ivf is invalid: ${iv_format}`)
	process.exit(2)
}
const iv_provided = parameters.has('iv')
const iv = iv_provided ? Buffer.from(parameters.get('iv'), iv_format) : crypto.randomBytes(12)
if (iv.length != 12) {
	console.error(`Error: IV size is invalid: ${iv.length}b (expected: 12b)`)
	process.exit(2)
}

const input_format = parameters.has('if') ? parameters.get('if') : flags.has('d') ? 'hex' : 'utf8'
if (!text_formats.includes(input_format)) {
	console.error(`Error: Parameter --if is invalid: ${input_format}`)
	process.exit(2)
}
const input = parameters.has('i') ? parameters.get('i') : 0
if (input === 0) {
	console.error(`Error: Input text not found (Use --i TEXT)`)
	process.exit(2)
}

const output_format = parameters.has('of') ? parameters.get('of') : flags.has('d') ? 'utf8' : 'hex'
if (!text_formats.includes(output_format)) {
	console.error(`Error: Parameter --of is invalid: ${output_format}`)
	process.exit(2)
}

const authTag_format = parameters.has('atf') ? parameters.get('atf') : 'hex'
if (!text_formats.includes(authTag_format)) {
	console.error(`Error: Parameter --atf is invalid: ${authTag_format}`)
	process.exit(2)
}

if (!flags.has('d')) { // Encryption
	const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

	let encrypted = cipher.update(input, input_format, output_format)
	encrypted += cipher.final(output_format)

	const authTag = cipher.getAuthTag()
	console.log('Encrypted: ', encrypted, ` (${output_format})`)
	console.log('AuthTag: ', authTag.toString(authTag_format), ` (${authTag_format})`)
	console.log('IV: ', iv.toString(iv_format), ` (${iv_format})`)
	console.log('Key: ', key.toString(key_format), ` (${key_format})`)
} else { // Decryption
	const authTag = parameters.has('at') ? Buffer.from(parameters.get('at'), authTag_format) : 0
	if (authTag === 0 || authTag.length != 16) {
		console.error(`Error: Parameter --at is invalid or doesn't have 16 bytes`)
		process.exit(2)
	} else if (!key_provided || !iv_provided) {
		console.error(`Error: Missing key or iv for decryption`)
		process.exit(2)
	}
	
	let decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
	decipher.setAuthTag(authTag)

	let decrypted = decipher.update(input, input_format, output_format)
	decrypted += decipher.final(output_format)
	console.log('Decrypted: ', decrypted, ` (${output_format})`)
}

