# Smart Mirror

This project was inspired by Michael Teeuw's [Magic Mirror](http://michaelteeuw.nl/tagged/magicmirror).

### Getting Started
#### Hardware Components
- Raspberry Pi 2**
- USB Microphone (Or Webcam w/ microphone)
- Monitor (with the bezel removed)
- Mirror Pane (aka Observation Glass)
- Philips Hue

```
#### Installation
In order to get started I suggest a clean install of Raspbian. You can snag a fresh copy of Jessie (recommended, it's the future) or Wheezy from the [Raspbian Download Page](https://www.raspberrypi.org/downloads/raspbian/).

Install npm and copy to /usr/local
```

##### Getting the code
Next up you'll want to clone this repository into your user's home folder on your Pi:
```
cd ~
git clone https://github.com/yelisetti/MirrorOnTheWall.git
```

##### Configuring the Pi
In order to rotate your monitor you'll need to add the following line to `/boot/config.txt`
```
display_rotate=1
```

#### Install Chromium Speech Keys
In order to talk into the mick, you will need Chromium speech keys which can be found here:
```
http://www.chromium.org/developers/how-tos/api-keys
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

