import httplib, urllib2, random, string, json
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
	if "plugins.txt" in user_pass_path[2] : user_pass_path[2] = user_pass_path[2].split("plugins.txt")[0]
	print user_pass_path[2]
	authfile.close()
except IOError as e:
	user_pass_path = populateAuth()
	user_pass_path[2] = getPluginsFile()

if len(user_pass_path) != 3:
	user_pass_path = populateAuth()
	user_pass_path[2] = getPluginsFile()

infile = open(user_pass_path[2]+"plugins.txt", 'r')
plugins = infile.read()
plugins = string.replace(plugins,"\"","\'").split('\n')
infile.close()

infile = open(user_pass_path[2]+"modlist.txt", 'r')
modlisttxt = infile.read()
modlisttxt = string.replace(modlisttxt,"\"","\'").split('\n')
infile.close()

infile = open(user_pass_path[2]+"skyrim.ini", 'r')
skyrimini = infile.read()
skyrimini = string.replace(skyrimini,"\"","\'").split('\n')
infile.close()

infile = open(user_pass_path[2]+"skyrimprefs.ini", 'r')
skyrimprefsini = infile.read()
skyrimprefsini = string.replace(skyrimprefsini,"\"","\'").split('\n')
infile.close()

pluginsToSend = '['
for i in plugins:
	if i != "" and i[0] != "#":
		pluginsToSend = pluginsToSend + "\\\"" + i + "\\\","
pluginsToSend = pluginsToSend[:-1]
pluginsToSend += "]"

print pluginsToSend

modlisttxtToSend = '['
for i in modlisttxt:
	if i != "" and i[0] != "#":
		modlisttxtToSend = modlisttxtToSend + "\\\"" + i + "\\\","
modlisttxtToSend = modlisttxtToSend[:-1]
modlisttxtToSend += "]"

print modlisttxtToSend

skyrimsToSend = '['
for i in skyrimini:
	if i != "" and i[0] != "#":
		skyrimsToSend = skyrimsToSend + "\\\"" + i + "\\\","
skyrimsToSend = skyrimsToSend[:-1]
skyrimsToSend += "]"

print skyrimsToSend

skyrimprefsToSend = '['
for i in skyrimprefsini:
	if i != "" and i[0] != "#":
		skyrimprefsToSend = skyrimprefsToSend + "\\\"" + i + "\\\","
skyrimprefsToSend = skyrimprefsToSend[:-1]
skyrimprefsToSend += "]"

fullParams = "{\"plugins\": \""+pluginsToSend+"\",\"modlisttxt\": \""+modlisttxtToSend+"\",\"skyrimini\": \""+skyrimsToSend+"\",\"skyrimprefsini\": \""+skyrimprefsToSend+"\", \"username\": \""+user_pass_path[0]+"\", \"password\": \""+user_pass_path[1]+"\"}"
#print fullParams

#fullParams = json.dumps(fullParams)
url = "http://127.0.0.1:3000/fullloadorder"

req = urllib2.Request(url, fullParams, {'Content-Type':'application/json'})
print 'Uploading to http://modwat.ch/' + user_pass_path[0] + '...'
f = urllib2.urlopen(req)
response = f.getcode()
print response
f.close()
#params = urllib.urlencode({'modlist': pluginsToSend, 'username': user_pass_path[0], 'password': user_pass_path[1]})
#headers = {"Content-type": "application/x-www-form-urlencoded", "Accept": "text/plain"}

#conn = httplib.HTTPConnection('localhost:3000')


#conn.request("POST", "/fullloadorder", params, headers)
#response = conn.getresponse()
#print response.status, response.reason
#data = response.read()
if(response == 200):
	print "Your load order was successfully uploaded!"
else:
	print "Something went wrong!\nError Code:",response
	raw_input("\nPress Enter To Continue")
