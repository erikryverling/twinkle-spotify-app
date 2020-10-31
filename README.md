What the ...?
-------------
*Twinkle lets you star the current playing song in Spotify with a single click.*

![Twinkle screenshot](https://s3.amazonaws.com/erik-r-yverling/images/twinkle-screenshot.png)

This is great for saving that fine tune you are listening to without breaking your attention while coding or 
doing some other focused activity. 
Twinkle uses the [Spotify Apps API](https://developer.spotify.com/technologies/apps) to star songs and WebSockets 
to communicate key presses. This makes it platform independent and not depending on the Spotify GUI components.

Twinkle consists three parts:

#### Broadcast server ####
The broadcast server is a simple WebSocket server that will send all incoming messages to all connected clients.


#### Spotify app ####
The Spotify app is a WebSocket client that runs in the Spotify Web browser container and will star the current 
playing song when receiving a request message using the Spotify App JavaScript API.


#### Client ####
The client is a simple WebSocket client that will send a star request message and depending on the results, 
play a success or fail sound.



Installation
------------
### Prerequisite ###
* [Python 2](http://www.python.org/download/releases/2.7)
* [AutoBahn Python](http://autobahn.ws/python)

#### Windows ####
A quick and dirty way to install the above dependencies is to download and run the following Windows installers:
* [python-2.7.5.msi](http://www.python.org/ftp/python/2.7.5/python-2.7.5.msi)
* [zope.interface-4.0.5.win32-py2.7.exe](https://pypi.python.org/packages/2.7/z/zope.interface/zope.interface-4.0.5.win32-py2.7.exe#md5=0fe8cccbbc244a23bbce79ba133f0405)
* [Twisted-13.1.0.win32-py2.7.msi](https://www.google.se/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&ved=0CC0QFjAA&url=http%3A%2F%2Fpypi.python.org%2Fpackages%2F2.7%2FT%2FTwisted%2FTwisted-13.1.0.win32-py2.7.msi&ei=DdYdUoS9CcmD4gTF_4GoAQ&usg=AFQjCNHKf1RJCoQnRzbNOKlZk4Uac22Scg&sig2=MjdyaKvQRJuXakUF1AmpaA&bvm=bv.51156542,d.bGE)
* [autobahn-0.5.14.win32.exe](https://pypi.python.org/packages/any/a/autobahn/autobahn-0.5.14.win32.exe#md5=5ff8480157999e204247f65c017f5d2f)


### Broadcast server ###
Clone the *twinkle-broadcast-server* in a preferred folder using the command

    $ git clone https://github.com/erikryverling/twinkle-broadcast-server.git


#### Arch Linux ####
On Arch you could just install the [ery-twinkle-broadcast-server-git](https://aur.archlinux.org/packages/ery-twinkle-broadcast-server-git) AUR package.
Using [aurget](https://aur.archlinux.org/packages/aurget/), it's as easy as
    
    $ aurget -S ery-twinkle-broadcast-server-git

The broadcast server is installed as a [systemd](https://wiki.archlinux.org/index.php/Systemd) service so you could have it start at boot using the command

    $ sudo systemctl enable twinkle-broadcast-server


#### Windows ####

If you want to run the broadcast server on boot and hidden (witch you probably want)
you could create a Scheduled Tasks for the `twinkle-broadcast-server.bat` and run it using the `invisible.vb` 
script as described in this [Super User entry](http://superuser.com/questions/62525/run-a-completly-hidden-batch-file).


### Spotify app ###
1. First you need to make your Spotify account a developer account.
Do this by clicking [here](https://developer.spotify.com/technologies/apps/#developer-account).
2. Create a folder named *Spotify* in your home folder (or *My Documents* on Windows).
3. Clone the *twinkle-spotify-app* in the newly created Spotify folder using the command

        $ git clone https://github.com/erikryverling/twinkle-spotify-app.git


### Client ###
Clone the *twinkle-client* in a preferred folder using the command

    $ git clone https://github.com/erikryverling/twinkle-client.git


#### Arch Linux ####
On Arch you could just install the [ery-twinkle-client-git](https://aur.archlinux.org/packages/ery-twinkle-client-git) AUR package.
Using [aurget](https://aur.archlinux.org/packages/aurget/), it's as easy as
    
    $ aurget -S ery-twinkle-client-git
    
Then you should assign the `twinkle` command (symlinked to the `twinkle.sh` script) to a keyboard key using a utility of your choice 
(such as the [xdotool](http://www.semicomplete.com/projects/xdotool)). 
If your running Xfce you could use the `xfce4-keyboard-settings` command.


#### Windows ####
Assigning the `twinkle-client.bat` script to a keyboard key is a bit tricky on Windows, but one way is to
create a shortcut to the bat-file in the *All programs* folder in the Start menu or on the Desktop and then 
right click on the shortcut and choose *Properties*. Then in the *Shortcut key* field enter a shortcut of 
your choice. 
You probably also want to set *Run* to *Minimized* to avoid an annoying terminal window popping up each 
time you press the shortcut key.



Usage
-----
### Broadcast server ###
The broadcast server has the following set of options

    twinkle-broadcast-server [--url=<url to web socket server>] [-h|--help]

#### Arch Linux ####
You could use the normal `systemctl` commands to control the service, such as

    $ sudo systemctl start twinkle-broadcast-server
    $ sudo systemctl stop twinkle-broadcast-server

### Spotify app ###
To start the Spotify app enter the following command in the Spotify search box

    spotify:app:twinkle

If you want to provide a custom URL you could provide them as arguments like this

    spotify:app:twinkle:<scheme>:<host>:<port>

The app will indicate which URL it's connected to and the connection status.

Spotify will unfortunately not save *'development apps'* between sessions (even if you add it to favorites).
This means that you have to enter the above command each time you start Spotify.

The Twinkle Spotify app must also have focus (within the Spotify window) otherwise, Spotify will terminate it. 
You can of course minimize the whole Spotify window or tab to another window after opening the Twinkle app.


### Client ###
The client has the following set of options

    twinkle [--url=<url to web socket server>] [-m|--mute-sound] [-h|--help]
    
    
    
The future and beyond
---------------------
I've tried to designed Twinkle to be modular and extensible. 
For instance, the broadcast server could easily be replaced with another implementation that works in the same way.  
You could also easily make your own client by just sending the message `twinkle:star` to the URL that the Spotify app 
is listening to. Have a look at
 [the code](https://github.com/erikryverling/twinkle-client/blob/master/twinkle-client/client.py) for details
