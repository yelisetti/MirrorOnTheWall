# Smart Mirror

[

This project was inspired by [HomeMirror](https://github.com/HannahMitt/HomeMirror) and Michael Teeuw's [Magic Mirror](http://michaelteeuw.nl/tagged/magicmirror). It uses [annyang](https://github.com/TalAter/annyang) for voice interactivity, [electron](http://electron.atom.io/) to make it cross platform, and integrates with Philips Hue. It is my own take on what a "smart mirror" can be.

### Getting Started
#### Hardware Components
- Raspberry Pi 2**
- USB Microphone (Or Webcam w/ microphone)
- Monitor (with the bezel removed)
- Mirror Pane (aka Observation Glass)
- Philips Hue


#### Installation
In order to get started I suggest a clean install of Raspbian. You can snag a fresh copy of Jessie (recommended, it's the future) or Wheezy from the [Raspbian Download Page](https://www.raspberrypi.org/downloads/raspbian/).

You'll also need to install Node (v4.0.0+) which now comes bundled with npm.
```
wget https://nodejs.org/dist/v4.0.0/node-v4.0.0-linux-armv7l.tar.gz 
tar -xvf node-v4.0.0-linux-armv7l.tar.gz 
cd node-v4.0.0-linux-armv7l
```
Copy to /usr/local
```
sudo cp -R * /usr/local/
```

##### Getting the code
Next up you'll want to clone this repository into your user's home folder on your Pi:
```
cd ~
git clone https://github.com/yelisetti/MirrorOnTheWall.git
```

##### Configuring the mirror
You'll need to fill in two things into `js/config.js`:

1. A [Forecast API key](https://developer.forecast.io/) (don't worry it's free)
2. Philips Hue Bridge IP address with a configured user. Details about how to set this up in the [Philips Hue Developer Documentation](http://www.developers.meethue.com/documentation/getting-started)
3. [Optional] An array of iCal addresses (from your Google or Outlook calendar for example)

The format of your config should look something like this:
```
var FORCAST_API_KEY = "a6s5dg39j78qj38sjs91je9djadfa1e";
var HUE_BASE = "http://192.168.1.99/api/as9234ho0dfhoq01f2as3yh4m0/";
var PERSONAL_CALENDAR = ["https://calendar.google.com/calendar/ical/SOMESTUFF/basic.ics",
"https://outlook.office365.com/owa/calendar/SOMESTUFF/reachcalendar.ics"];
```
##### Configuring the Pi
In order to rotate your monitor you'll need to add the following line to `/boot/config.txt`
```
display_rotate=1
```
You can also set this value to '3' to have a flipped vertical orientation.

In order to disable the screensaver you'll want to comment out (with a '#') the `@xscreensaver` and `@lxpanel` lines in `/etc/xdg/lxsession/LXDE/autostart`. You'll also want to add the following lines to that same file
```
@xset s off
@xset -dpms
@xset s noblank
```

##### Install dependencies and run
Before we can run the thing we've got to install the projects dependencies. From the root of the `smart-mirror` directory run:
```
npm install
```

This will take a minute, it has to download [electron-prebuilt](https://github.com/mafintosh/electron-prebuilt). Once that is done you can launch the mirror with
```
npm start
```

### Author
[Vishal Yelisetti]
** Special thanks to Evan Cohen for the great head start on the project

