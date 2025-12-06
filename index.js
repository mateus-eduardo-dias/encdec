import crypto from 'crypto'

const args = process.argv.slice(2)

const key = crypto.randomBytes(32)
const iv = crypto.randomBytes(16)

const associatedData = Buffer.from('test')

const plaintext = args[0]

const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
cipher.setAAD(associatedData)

let encrypted = cipher.update(plaintext, 'utf8', 'hex')
encrypted += cipher.final('hex')

const authTag = cipher.getAuthTag()

console.log('Encrypted: ', encrypted)
console.log('Auth Tag: ', authTag.toString('hex'))
