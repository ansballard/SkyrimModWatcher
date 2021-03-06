import urllib2, string
from Tkinter import *
from tkFileDialog import askopenfilename
from os.path import expanduser

from win32com.shell import shell, shellcon

# variable for all params
user_pass_path = ['','','']

class Application(Frame):

	def getScriptVersion(self):
		# Get current script version
		try:
			req = urllib2.Request(self.url+"/scriptVersion")
			f = urllib2.urlopen(req)
			response = f.read()
			f.close()
			if response == self.version:
				self.vText.set("Modwat.ch is up to date")
			else:
				self.vText.set("There is a new version of Modwat.ch")
		except urllib2.HTTPError, e:
			errorCode = e.code
			errorText = e.read()
			print "Error Message: ",errorText
		except urllib2.URLError, e:
			self.vText.set("HTTP error, check your connection and restart")

	def populateAuth(self):
		authfile = open('./auth.dat', 'w')
		authfile.write(self.username + '\n' + self.password + '\n' + self.MOpath)
		authfile.close()

	def readFiles(self):
		filesRead = 1
		#Read plugins.txt
		try:
			if self.MOpath == 'default':
				infile = open(self.pluginsPath+"plugins.txt", 'r')
			else:
				infile = open(self.MOpath+"plugins.txt", 'r')
			self.plugins = infile.read()
			self.plugins = string.replace(self.plugins,"\\","\\\\")
			self.plugins = string.replace(self.plugins,"\"","\\\"").split('\n')
			infile.close()
		except IOError as e:
			print e.errno
			filesRead = 0
			exit()

		#Read modlist.txt
		try:
			if self.MOpath == 'default':
				self.modlist = ""
			else:
				infile = open(self.MOpath+"modlist.txt", 'r')
				self.modlist = infile.read()
				self.modlist = string.replace(self.modlist,"\\","\\\\")
				self.modlist = string.replace(self.modlist,"\"","\\\"").split('\n')
				infile.close()
		except IOError as e:
			filesRead = 0
			self.modlist = ""

		#Read 'game'.ini
		try:
			if self.MOpath == 'default':
				infile = open(self.nexusInisPath+self.game.get()+".ini", 'r')
			else:
				infile = open(self.MOpath+self.game.get()+".ini", 'r')
			self.ini = infile.read()
			self.ini = string.replace(self.ini,"\\","\\\\")
			self.ini = string.replace(self.ini,"\"","\\\"").split('\n')
			infile.close()
		except IOError as e:
			filesRead = 0
			self.ini = ""

		#Read 'game'prefs.ini
		try:
			if self.MOpath == 'default':
				infile = open(self.nexusInisPath+self.game.get()+".ini", 'r')
			else:
				infile = open(self.MOpath+self.game.get()+"prefs.ini", 'r')
			self.prefsini = infile.read()
			self.prefsini = string.replace(self.prefsini,"\\","\\\\")
			self.prefsini = string.replace(self.prefsini,"\"","\\\"").split('\n')
			infile.close()
		except IOError as e:
			filesRead = 0
			self.prefsini = ""

		if(filesRead == 0):
			self.vText.set('One or more files could not be read')

	def buildJSON(self):
		#Build plugins.txt JSON
		pluginsToSend = "["
		for i in self.plugins:
			if i != "" and i[0] != "#":
				pluginsToSend = pluginsToSend + "{\"name\":\"" + i + "\"},"
		pluginsToSend = pluginsToSend[:-1]
		pluginsToSend += "]"

		#Build modlist.txt JSON
		if self.modlist != "":
			modlistToSend = "["
			for i in self.modlist:
				if i != "" and i[0] != "#":
					modlistToSend = modlistToSend + "{\"name\":\"" + i + "\"},"
			modlistToSend = modlistToSend[:-1]
			modlistToSend += "]"
		else:
			modlistToSend = "[]"

		#Build 'game'.ini JSON
		if self.ini != "":
			iniToSend = "["
			for i in self.ini:
				if i != "" and i[0] != "#":
					iniToSend = iniToSend + "{\"name\":\"" + i + "\"},"
			iniToSend = iniToSend[:-1]
			iniToSend += "]"
		else:
			iniToSend = "[]"

		#Build 'game'prefs.ini JSON
		if self.prefsini != "":
			prefsiniToSend = "["
			for i in self.prefsini:
				if i != "" and i[0] != "#":
					prefsiniToSend = prefsiniToSend + "{\"name\":\"" + i + "\"},"
			prefsiniToSend = prefsiniToSend[:-1]
			prefsiniToSend += "]"
		else:
			prefsiniToSend = "[]"

		#Build full JSON, including all files, username, password
		fullParams = "{\"plugins\": "+pluginsToSend+",\"modlist\": "+modlistToSend+",\"ini\": "+iniToSend+",\"prefsini\": "+prefsiniToSend+", \"username\": \""+self.username+"\", \"password\": \""+self.password+"\",\"game\":\""+self.game.get()+"\", \"enb\": \"\", \"tags\": []}"
		return fullParams

	def postLoadOrder(self, fullParams):
		try:
			#Fancy urllib2 things
			req = urllib2.Request(self.url+"/loadorder", fullParams, {'Content-Type':'application/json'})
			f = urllib2.urlopen(req)
			response = f.getcode()
			f.close()

			#If response is OK, print happy message, else show error code and press enter to confirm
			if(response == 200):
				self.vText.set("Your load order was successfully uploaded!")
			else:
				self.vText.set("Something went wrong!\nError Code: " + response)
		except urllib2.HTTPError, e:
			errorCode = e.code
			errorText = e.read()
			print "Error during upload. Error Code: ",errorCode
			print "Error Message: ",errorText
		except urllib2.URLError, e:
			self.vText.set("HTTP error, check your connection and restart")

	def setUserPassPath(self):
		self.unTextbox.delete(0,END)
		self.unTextbox.insert(0,self.username)
		self.pwTextbox.delete(0,END)
		self.pwTextbox.insert(0,self.password)
		self.fpTextbox.delete(0,END)
		self.fpTextbox.insert(0,self.MOpath)

	def getAuthData(self):
		try:
			authfile = open('./auth.dat', 'r')
			user_pass_path = authfile.read().split('\n')
			self.username = user_pass_path[0]
			self.password = user_pass_path[1]
			self.MOpath = user_pass_path[2]
			authfile.close()
			self.setUserPassPath()
		except:
			authfile = open('./auth.dat', 'w')
			authfile.close()

	def getMOpath(self):
		root = Tk()
		root.withdraw()
		self.MOpath = askopenfilename(parent=root, initialdir= (self.MOpath))
		self.MOpath = self.MOpath.split("plugins.txt")[0]
		root.destroy()
		self.fpTextbox.delete(0,END)
		self.fpTextbox.insert(0,self.MOpath)

	def upload(self):
		self.username = self.unTextbox.get()
		self.password = self.pwTextbox.get()
		self.populateAuth()
		self.readFiles()
		self.postLoadOrder(self.buildJSON())

	def postNewPass(self):
		params = "{\"oldPassword\":\""+self.oldText.get()+"\", \"newPassword\":\""+self.newText.get()+"\"}"
		req = urllib2.Request(self.url+"/"+self.username+"/newpass", params, {'Content-Type':'application/json'})
		print 'Changing password to ' + self.newText.get() + '...'
		f = urllib2.urlopen(req)
		response = f.getcode()
		f.close()
		if response == 200:
			print 'Success! Your new password is',self.newText.get()
			self.password = self.newText.get()
			self.populateAuth()
			self.pwTextbox.delete(0,END)
			self.pwTextbox.insert(0,self.password)
		elif response == 403:
			print "Password Incorrect"
		else:
			print "Couldn't Change Password, reverting to",self.password
		self.cp.destroy()

	def changePass(self):
		self.cp = Toplevel(self)

		self.oldFrame = Frame(self.cp)
		self.bottomFrame = Frame(self.cp)

		self.newFrame = Frame(self.bottomFrame)
		self.submitFrame = Frame(self.bottomFrame)

		self.oldFrame.pack(side="top", fill="x", expand=False)
		self.bottomFrame.pack(side="bottom", fill="both", expand=True)

		self.newFrame.pack(side="top", fill="x", expand=False)
		self.submitFrame.pack(side="bottom", fill="both", expand=True)

		self.oldLabel = Label(self.oldFrame, width=13)
		self.oldLabel.pack(side="left")
		self.oldLabel["text"] = "Old Password"
		self.oldText = Entry(self.oldFrame, width=20)
		self.oldText.pack(side="left")
		self.oldText.insert(0,self.password)

		self.newLabel = Label(self.newFrame, width=13)
		self.newLabel.pack(side="left")
		self.newLabel["text"] = "Change Password"
		self.newText = Entry(self.newFrame, width=20)
		self.newText.pack(side="left")

		self.submitNewPass = Button(self.submitFrame, width=10)
		self.submitNewPass["text"] = "Submit"
		self.submitNewPass["command"] = self.postNewPass
		self.submitNewPass.pack({"side": "left"})

	def setNMMPaths(self):
		self.MOpath = "default"
		self.fpTextbox.delete(0,END)
		self.fpTextbox.insert(0,"Default file paths")

	def setVersionMessage(self, versionBool):
		if versionBool == 1:
			self.vText.set("Modwat.ch is up to date")
		else:
			self.vText.set("There is a new version of Modwat.ch")

	def createWidgets(self):

		self.top_frame = Frame(self)
		self.bottom_frame = Frame(self)

		self.first_quarter = Frame(self.top_frame)
		self.second_quarter = Frame(self.top_frame)
		self.third_quarter = Frame(self.bottom_frame)
		self.fourth_quarter = Frame(self.bottom_frame)

		self.version_frame = Frame(self.first_quarter)

		self.top_frame.pack(side="top", fill="x", expand=False)
		self.bottom_frame.pack(side="bottom", fill="both", expand=True)

		self.first_quarter.pack(side="top", fill="x", expand=False)
		self.second_quarter.pack(side="bottom", fill="both", expand=True)
		self.third_quarter.pack(side="top", fill="x", expand=False)
		self.fourth_quarter.pack(side="bottom", fill="both", expand=True)

		self.version_frame.pack(side="top", fill="x", expand=False)

		self.vLabel = Label(self.version_frame, textvariable=self.vText, width=60)
		self.vLabel.pack({"side":"left"})

		self.unLabel = Label(self.first_quarter, width=12)
		self.unLabel["text"] = "Username"
		self.unLabel.pack({"side":"left"})

		self.unTextbox = Entry(self.first_quarter, width=60)
		self.unTextbox.pack({"side":"left"})

		self.pwLabel = Label(self.second_quarter, width=12)
		self.pwLabel["text"] = "Password"
		self.pwLabel.pack({"side":"left"})

		self.pwTextbox = Entry(self.second_quarter, width=60)
		self.pwTextbox.pack({"side":"left"})

		self.fpLabel = Label(self.third_quarter, width=12)
		self.fpLabel["text"] = "Plugins.txt"
		self.fpLabel.pack({"side":"left"})

		self.fpTextbox = Entry(self.third_quarter, width=60)
		self.fpTextbox.insert(0,self.MOpath)
		self.fpTextbox.pack({"side":"left"})

		self.mo = Button(self.fourth_quarter, width=10)
		self.mo["text"] = "Using MO"
		self.mo["command"] = self.getMOpath
		self.mo.pack({"side": "left"})

		self.nmm = Button(self.fourth_quarter, width=10)
		self.nmm["text"] = "Using NMM"
		self.nmm["command"] = self.setNMMPaths
		self.nmm.pack({"side": "left"})

		self.cpass = Button(self.fourth_quarter, width=12)
		self.cpass["text"] = "New Password"
		self.cpass["command"] = self.changePass
		self.cpass.pack({"side": "left"})

		self.gDrop = OptionMenu(self.fourth_quarter, self.game, *self.gameList)
		self.gDrop.pack({"side": "left"})

		self.done = Button(self.fourth_quarter, width=10)
		self.done["text"] = "Upload!"
		self.done["command"] = self.upload
		self.done.pack({"side": "left"})



	def __init__(self, master=None):
		df = shell.SHGetDesktopFolder()
		pidl = df.ParseDisplayName(0, None, "::{450d8fba-ad25-11d0-98a8-0800361b1103}")[1]
		self.mydocs = shell.SHGetPathFromIDList(pidl)
		self.username = ""
		self.password = ""
		self.gameList = ['skyrim', 'fallout', 'oblivion', 'Morrowind']
		self.game = StringVar()
		self.game.set('skyrim')
		self.vText = StringVar()
		self.home = expanduser("~")
		self.MOpath = "C:/Program Files/Mod Organizer"
		self.pluginsPath = self.home+"/AppData/Local/"+self.game.get()+"/" # plugins.txt
		self.nexusInisPath = self.mydocs+"/my games/"+self.game.get()+"/" # ini, prefsini

		self.plugins = ""
		self.modlist = ""
		self.ini = ""
		self.prefsini = ""
		
		self.version = "0.26b"
		self.url = "http://localhost:3000"

		Frame.__init__(self, master)
		self.pack()
		self.createWidgets()

		self.getAuthData()
		self.getScriptVersion()

def GUI():
	root = Tk()
	app = Application(master=root)
	app.master.title("Modwat.ch")
	app.mainloop()
	root.destroy()

GUI()