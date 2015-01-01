[![Build Status](https://travis-ci.org/ansballard/SkyrimModWatcher.svg?branch=master)](https://travis-ci.org/ansballard/SkyrimModWatcher)

http://modwat.ch

http://nexusmods.com/skyrim/mods/56640

TO BUILD
========

The only missing files are in /node_modules and /config. You can fill out /node_modules via `npm install` in the root directory of the project (possibly `sudo npm install`, consult your physician). /config needs a file called db.js, which contains the connection information for the mongodb database. The file without credentials, using a mongolab account, looks like:

```
module.exports = {

	'url' : 'mongodb://<username>:<password>@<url>/<database name>'

};
```

Using a different service or local dev should be easy to find in a bsic mongoose tutorial.

After both of those, you should have a functional project that you can run with `node app.js` when in the root directory of the project. Navigating to `localhost:3000` will show you the web page.

GRUNT
=====

The current grunt file is only for minifying and watching for changes while developing, I haven't thrown in any testing (bad dev). `grunt` will minify all the css, frontend js, and backend js. You can minify te images with `grunt imagemin` but they're already minified and I'm not planning on adding more images, so it shouldn't be needed. When developing, run `grunt watch` to minify as you go, it will watch for changes in `/src/*` and output them to their respective directories.

BUILDING THE EXE
================

I compile the python script in /python/ using https://github.com/pyinstaller/pyinstaller/wiki.
After downloading the latest version for Python 2.X, you can compile the exe yourself via 
```
python /path/to/pyinstaller.py --onefile --windowed /path/to/readloadorder.py
```
That should build the exe and put it somewhere in your pyinstaller directory.
