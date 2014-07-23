import httplib, urllib, random, string
from os.path import expanduser, isfile
home = expanduser("~")

user_pass = []

def populateAuth():
	temp = raw_input("Enter a username for ModWatcher.com: ")
	newpass = ''.join(random.choice(string.lowercase) for i in range(32))
	temp += '\n' + newpass
	print temp
	user_pass = temp.split('\n')
	authfile = open('./auth.dat', 'w')
	authfile.write(user_pass[0] + '\n' + user_pass[1])
	authfile.close()
	return user_pass

# Get Auth from auth.dat
try:
	authfile = open('./auth.dat', 'r')
	user_pass = authfile.read().split('\n')
	authfile.close()
except IOError as e:
	user_pass = populateAuth()

# Reads mods that are installed, checked or not?
#infile = open(home+'\AppData\Local\Skyrim\loadorder.txt', 'r')

# Reads only checked mods in correct order?
infile = open(home+'\AppData\Local\Skyrim\plugins.txt', 'r')

mods = infile.read().split('\n')
infile.close()
modsToSend = ''
for i in mods:
	modsToSend = modsToSend + i + '@#$'
modsToSend = modsToSend[:-3]
params = urllib.urlencode({'modlist': modsToSend, 'username': user_pass[0], 'password': user_pass[1]})
#for i in params:
#	print i
headers = {"Content-type": "application/x-www-form-urlencoded", "Accept": "text/plain"}

#localURL = open('./localURL.private', 'r')
#conn = httplib.HTTPConnection(localURL.read() + ":3000")
#localURL.close()
conn = httplib.HTTPConnection('skyrimmodwatcher.jit.su')

print user_pass[0] + ' ' + user_pass[1]
conn.request("POST", "/loadorder", params, headers)
response = conn.getresponse()
print response.status, response.reason
data = response.read()
data
conn.close()
