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

if len(user_pass) != 2:
	user_pass = populateAuth()

infile = open(home+'\AppData\Local\Skyrim\loadorder.txt', 'r')

mods = infile.read().split('\n')
infile.close()
modsToSend = '['
for i in mods:
	if i != "":
		modsToSend = modsToSend + "\"" + i + "\","
modsToSend = modsToSend[:-1]
modsToSend += "]"
params = urllib.urlencode({'modlist': modsToSend, 'username': user_pass[0], 'password': user_pass[1]})
headers = {"Content-type": "application/x-www-form-urlencoded", "Accept": "text/plain"}

conn = httplib.HTTPConnection('localhost:3000')

print user_pass[0] + ' ' + user_pass[1]
conn.request("POST", "/loadorder", params, headers)
response = conn.getresponse()
print response.status, response.reason
data = response.read()
data
conn.close()
