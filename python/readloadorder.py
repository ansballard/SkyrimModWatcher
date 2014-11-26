import urllib2, random, string
from Tkinter import *
from tkFileDialog import askopenfilename
from os.path import expanduser
home = expanduser("~")
game = "skyrim"
version = "0.25b"

class Application(Frame):

	def setUserPassPath(self, user_pass_path):
		self.username = user_pass_path[0]
		self.unTextbox.insert(0,self.username)
		self.password = user_pass_path[1]
		self.pwTextbox.insert(0,self.password)
		self.MOpath = user_pass_path[2]
		self.fpTextbox.delete(0,END)
		self.fpTextbox.insert(0,self.MOpath)

	def getMOpath(self):
		root = Tk()
		root.withdraw()
		self.MOpath = askopenfilename(parent=root, initialdir= (self.MOpath))
		root.destroy()
		self.fpTextbox.delete(0,END)
		self.fpTextbox.insert(0,self.MOpath)

	def finish(self):
		self.username = self.unTextbox.get()
		self.password = self.pwTextbox.get()
		self.quit()

	def setNMMPaths(self):
		self.MOpath = "default"
		self.fpTextbox.delete(0,END)
		self.fpTextbox.insert(0,"Default file paths")

	def createWidgets(self):

		self.top_frame = Frame(self)
		self.bottom_frame = Frame(self)

		self.first_quarter = Frame(self.top_frame)
		self.second_quarter = Frame(self.top_frame)
		self.third_quarter = Frame(self.bottom_frame)
		self.fourth_quarter = Frame(self.bottom_frame)

		self.top_frame.pack(side="top", fill="x", expand=False)
		self.bottom_frame.pack(side="bottom", fill="both", expand=True)

		self.first_quarter.pack(side="top", fill="x", expand=False)
		self.second_quarter.pack(side="bottom", fill="both", expand=True)
		self.third_quarter.pack(side="top", fill="x", expand=False)
		self.fourth_quarter.pack(side="bottom", fill="both", expand=True)

		self.unLabel = Label(self.first_quarter, width=12)
		self.unLabel["text"] = "Username"
		self.unLabel.pack({"side":"left"})

		self.unTextbox = Entry(self.first_quarter, width=40)
		self.unTextbox.pack({"side":"left"})

		self.pwLabel = Label(self.second_quarter, width=12)
		self.pwLabel["text"] = "Password"
		self.pwLabel.pack({"side":"left"})

		self.pwTextbox = Entry(self.second_quarter, show='*', width=40)
		self.pwTextbox.pack({"side":"left"})

		self.fpLabel = Label(self.third_quarter, width=12)
		self.fpLabel["text"] = "Plugins.txt"
		self.fpLabel.pack({"side":"left"})

		self.fpTextbox = Entry(self.third_quarter, width=40)
		self.fpTextbox.insert(0,self.MOpath)
		self.fpTextbox.pack({"side":"right"})

		self.mo = Button(self.fourth_quarter, width=13)
		self.mo["text"] = "Using MO"
		self.mo["command"] = self.getMOpath
		self.mo.pack({"side": "left"})

		self.nmm = Button(self.fourth_quarter, width=13)
		self.nmm["text"] = "Using NMM"
		self.nmm["command"] = self.setNMMPaths
		self.nmm.pack({"side": "left"})

		self.done = Button(self.fourth_quarter, width=13)
		self.done["text"] = "Done!"
		self.done["command"] = self.finish
		self.done.pack({"side": "left"})

	def __init__(self, master=None):
		self.username = ""
		self.password = ""
		self.MOpath = "C:/Program Files/Mod Organizer"

		Frame.__init__(self, master)
		self.pack()
		self.createWidgets()

user_pass_path = ['','','']

moDefaultPath = "C:/Program Files/ModOrganizer/" # Mod Organizer Install
pluginsPath = home+"/AppData/Local/Skyrim/" # plugins.txt
nexusInisPath = home+"/Documents/my games/skyrim/" # skyrim.ini, skyrimprefs.ini

def GUI(isNew):
	root = Tk()
	app = Application(master=root)
	if isNew == 0:
		app.setUserPassPath(user_pass_path)
	app.master.title("Modwat.ch")
	app.mainloop()
	root.destroy()
	user_pass_path[0] = app.username
	user_pass_path[1] = app.password
	user_pass_path[2] = app.MOpath
	populateAuth()

def populateAuth():
	authfile = open('./auth.dat', 'w')
	authfile.write(user_pass_path[0] + '\n' + user_pass_path[1] + '\n' + user_pass_path[2])
	authfile.close()
	return user_pass_path

def getPluginsFile():
	usingMO = raw_input("Are you using Mod Organizer? (Y/N): ")
	if usingMO == 'Y' or usingMO == 'y':
		raw_input("Navigate to your Mod Organizer install directory >> profiles >> your profile >> double click plugins.txt")
		root = Tk()
		root.withdraw()
		filename = askopenfilename(parent=root, initialdir= (moDefaultPath))
		user_pass_path[2] = user_pass_path[2].split("plugins.txt")[0]
		root.destroy()
		authfile = open('./auth.dat', 'a')
		authfile.write('\n' + filename)
	else:
		filename = 'default'
		authfile = open('./auth.dat', 'a')
		authfile.write('\n' + filename)
	return filename

# Get current script version
try:
	req = urllib2.Request("http://modwat.ch/scriptVersion")
	f = urllib2.urlopen(req)
	response = f.read()
	f.close()
	if response == version:
		print "Script is up to date"
	else:
		print "A new version of this script is available"
except urllib2.HTTPError, e:
	errorCode = e.code
	errorText = e.read()
	print "Error Message: ",errorText
	raw_input("Press Enter to Quit\n")

# Get Auth from auth.dat
try:
	authfile = open('./auth.dat', 'r')
	user_pass_path = authfile.read().split('\n')
	authfile.close()
	GUI(0)
except IOError as e:
	GUI(1)

#Incorrect format in auth.dat
if user_pass_path[2] == '':
	GUI(1)

if "plugins.txt" in user_pass_path[2] : user_pass_path[2] = user_pass_path[2].split("plugins.txt")[0]

#Read plugins.txt
try:
	if user_pass_path[2] == 'default':
		infile = open(pluginsPath+"plugins.txt", 'r')
	else:
		infile = open(user_pass_path[2]+"plugins.txt", 'r')
	plugins = infile.read()
	plugins = string.replace(plugins,"\\","\\\\")
	plugins = string.replace(plugins,"\"","\'").split('\n')
	infile.close()
except IOError as e:
	print e.errno
	raw_input("Error reading plugins.txt. Is "+user_pass_path[2]+" the correct path?")
	exit()

#Read modlist.txt
try:
	if user_pass_path[2] == 'default':
		modlisttxt = ""
	else:
		infile = open(user_pass_path[2]+"modlist.txt", 'r')
		modlisttxt = infile.read()
		modlisttxt = string.replace(modlisttxt,"\\","\\\\")
		modlisttxt = string.replace(modlisttxt,"\"","\'").split('\n')
		infile.close()
except IOError as e:
	raw_input("Error reading modlist.txt. Is "+user_pass_path[2]+" the correct path?")
	modlisttxt = ""

#Read 'game'.ini
try:
	if user_pass_path[2] == 'default':
		infile = open(nexusInisPath+game+".ini", 'r')
	else:
		infile = open(user_pass_path[2]+game+".ini", 'r')
	ini = infile.read()
	ini = string.replace(ini,"\\","\\\\")
	ini = string.replace(ini,"\"","\'").split('\n')
	infile.close()
except IOError as e:
	raw_input("Error reading "+game+".ini. Is "+user_pass_path[2]+" the correct path?")
	ini = ""

#Read 'game'prefs.ini
try:
	if user_pass_path[2] == 'default':
		infile = open(nexusInisPath+game+".ini", 'r')
	else:
		infile = open(user_pass_path[2]+game+"prefs.ini", 'r')
	prefsini = infile.read()
	prefsini = string.replace(prefsini,"\\","\\\\")
	prefsini = string.replace(prefsini,"\"","\'").split('\n')
	infile.close()
except IOError as e:
	raw_input("Error reading "+game+"prefs.ini. Is "+user_pass_path[2]+" the correct path?")
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

try:
	#Fancy urllib2 things
	req = urllib2.Request(url, fullParams, {'Content-Type':'application/json'})
	print 'Uploading to http://modwat.ch/' + user_pass_path[0] + '...'
	f = urllib2.urlopen(req)
	response = f.getcode()
	f.close()

	#If response is OK, print happy message, else show error code and press enter to confirm
	if(response == 200):
		print "Your load order was successfully uploaded!"
		raw_input("Press Enter to Finish\n")
	else:
		print "Something went wrong!\nError Code:",response
		raw_input("\nPress Enter To Finish")
except urllib2.HTTPError, e:
	errorCode = e.code
	errorText = e.read()
	print "Error during upload. Error Code: ",errorCode
	print "Error Message: ",errorText
	raw_input("Press Enter to Quit\n")
