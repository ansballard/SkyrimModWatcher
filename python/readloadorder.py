import httplib, urllib2, random, string, json
from Tkinter import *
from tkFileDialog import askopenfilename
from os.path import expanduser, isfile
home = expanduser("~")
game = "skyrim"

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
	user_pass_path[2] = user_pass_path[2].split("plugins.txt")[0]
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

#Incorrect format in auth.dat
if len(user_pass_path) != 3:
	user_pass_path = populateAuth()
	user_pass_path[2] = getPluginsFile()

if "plugins.txt" in user_pass_path[2] : user_pass_path[2] = user_pass_path[2].split("plugins.txt")[0]

#Read plugins.txt
try:
	infile = open(user_pass_path[2]+"plugins.txt", 'r')
	plugins = infile.read()
	plugins = string.replace(plugins,"\"","\'").split('\n')
	infile.close()
except IOError as e:
	print e.errno
	raw_input("Error reading plugins.txt, Press enter to quit")
	exit()

#Read modlist.txt
try:
	infile = open(user_pass_path[2]+"modlist.txt", 'r')
	modlisttxt = infile.read()
	modlisttxt = string.replace(modlisttxt,"\"","\'").split('\n')
	infile.close()
except IOError as e:
	raw_input("Error reading modlist.txt, continuing...")
	modlisttxt = ""

#Read 'game'.ini
try:
	infile = open(user_pass_path[2]+game+".ini", 'r')
	ini = infile.read()
	ini = string.replace(ini,"\"","\'").split('\n')
	infile.close()
except IOError as e:
	raw_input("Error reading "+game+".ini, continuing...")
	ini = ""

#Read 'game'prefs.ini
try:
	infile = open(user_pass_path[2]+game+"prefs.ini", 'r')
	prefsini = infile.read()
	prefsini = string.replace(prefsini,"\"","\'").split('\n')
	infile.close()
except IOError as e:
	raw_input("Error reading "+game+"prefs.ini, continuing...")
	prefsini = ""

#Build plugins.txt JSON
pluginsToSend = "["
for i in plugins:
	if i != "" and i[0] != "#":
		pluginsToSend = pluginsToSend + "\\\"" + i + "\\\","
pluginsToSend = pluginsToSend[:-1]
pluginsToSend += "]"

#Build modlist.txt JSON
if modlisttxt != "":
	modlisttxtToSend = "["
	for i in modlisttxt:
		if i != "" and i[0] != "#":
			modlisttxtToSend = modlisttxtToSend + "\\\"" + i + "\\\","
	modlisttxtToSend = modlisttxtToSend[:-1]
	modlisttxtToSend += "]"
else:
	modlisttxtToSend = "[]"

#Build 'game'.ini JSON
if ini != "":
	iniToSend = "["
	for i in ini:
		if i != "" and i[0] != "#":
			iniToSend = iniToSend + "\\\"" + i + "\\\","
	iniToSend = iniToSend[:-1]
	iniToSend += "]"
else:
	iniToSend = "[]"

#Build 'game'prefs.ini JSON
if prefsini != "":
	prefsiniToSend = "["
	for i in prefsini:
		if i != "" and i[0] != "#":
			prefsiniToSend = prefsiniToSend + "\\\"" + i + "\\\","
	prefsiniToSend = prefsiniToSend[:-1]
	prefsiniToSend += "]"
else:
	prefsiniToSend = "[]"

#Build full JSON, including all files, username, password
fullParams = "{\"plugins\": \""+pluginsToSend+"\",\"modlisttxt\": \""+modlisttxtToSend+"\",\""+game+"ini\": \""+iniToSend+"\",\""+game+"prefsini\": \""+prefsiniToSend+"\", \"username\": \""+user_pass_path[0]+"\", \"password\": \""+user_pass_path[1]+"\"}"

#url to post to
url = "http://modwat.ch/fullloadorder"

#Fancy urllib2 things
req = urllib2.Request(url, fullParams, {'Content-Type':'application/json'})
print 'Uploading to http://modwat.ch/' + user_pass_path[0] + '...'
f = urllib2.urlopen(req)
response = f.getcode()
print response
f.close()

#If response is OK, print happy message, else show error code and press enter to confirm
if(response == 200):
	print "Your load order was successfully uploaded!"
else:
	print "Something went wrong!\nError Code:",response
	raw_input("\nPress Enter To Continue")
