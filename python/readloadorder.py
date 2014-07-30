import httplib, urllib, random, string
from Tkinter import *
from tkFileDialog import askopenfilename
from os.path import expanduser, isfile
home = expanduser("~")

user_pass_path = []

def populateAuth():
	temp = raw_input("Enter a username for ModWatcher.com: ")
	newpass = ''.join(random.choice(string.lowercase) for i in range(32))
	temp += '\n' + newpass + '\n'
	user_pass_path = temp.split('\n')
	authfile = open('./auth.dat', 'w')
	authfile.write(user_pass_path[0] + '\n' + user_pass_path[1])
	authfile.close()
	return user_pass_path

def getPluginsFile():
	raw_input("Find your plugins.txt. It will either be in \"C:\Users\username\AppData\Local\Skyrim\" \nor your Mod Organizer profile directory. Press Enter to search:")
	root = Tk()
	root.withdraw()
	filename = askopenfilename(parent=root, initialdir= (home+"\AppData\Local\Skyrim"))
	root.destroy()
	authfile = open('./auth.dat', 'a')
	authfile.write('\n' + filename)
	return filename

# Get Auth from auth.dat
try:
	authfile = open('./auth.dat', 'r')
	user_pass_path = authfile.read().split('\n')
	authfile.close()
except IOError as e:
	user_pass_path = populateAuth()
	user_pass_path[2] = getPluginsFile()

if len(user_pass_path) != 3:
	user_pass_path = populateAuth()
	user_pass_path[2] = getPluginsFile()

infile = open(user_pass_path[2], 'r')

mods = infile.read().split('\n')
infile.close()
modsToSend = '['
for i in mods:
	if i != "" and i[0] != "#":
		modsToSend = modsToSend + "\"" + i + "\","
modsToSend = modsToSend[:-1]
modsToSend += "]"
params = urllib.urlencode({'modlist': modsToSend, 'username': user_pass_path[0], 'password': user_pass_path[1]})
headers = {"Content-type": "application/x-www-form-urlencoded", "Accept": "text/plain"}

conn = httplib.HTTPConnection('skyrimmodwatcher.jit.su')

print 'Uploading to http://skyrimmodwatcher.jit.su/' + user_pass_path[0] + '...'
conn.request("POST", "/loadorder", params, headers)
response = conn.getresponse()
print response.status, response.reason
data = response.read()
if(response.status == 200):
	print 'Your load order was successfully uploaded!'
else:
	print "Something went wrong!\nError Code: "+response.status+"\nReason: "+response.reason
data
conn.close()
