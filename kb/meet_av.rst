..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2025 grommunio GmbH

Troubleshooting Meet, Audio/Video
=================================

System audio output (Linux)
---------------------------

The system may offer multiple output devices, the presence of which may be
unexpected. Be aware of HDMI channels offered by the operating system even if
the physical HDMI and DisplayPort jacks have nothing plugged in.

An example from the *pavucontrol* program (with PipeWire backend):

.. image:: _static/img/pavucontrol-output.png

The default device may even shift on its own when e.g. Bluetooth output devices
are turned on/off. Verify that the desired output devices are not muted and
that you have a suitable device selected as the default output device. The
volume meters in pavucontrol can be used to diagnose where audio output is
going to.

pavucontrol does not necessarily show all the knobs, so if need be, have a look
at the alsamixer command-line program as well. This needs to be invoked with a
-c argument to choose a physical soundcard, e.g. ``alsamixer -c 0``, else it
may open a virtual ALSA device that is part of the modern pipewire pipeline.

.. image:: _static/img/alsamixer-output.png


System audio input (Linux)
--------------------------

The system may offer multiple input devices even out-of-the-box with nothing
else connected. In the following sample screenshot of pavucontrol, the system
is shown to have two input devices. One of those appears to be for a
headset/microphone connected via the analog jack, while the other is the
microphone that is located by the laptop's integrated webcam.

The fact that both input devices are labeled nearly identical is anything but
ideal, but enlarging the window helps. Verify that the desired input devices
are not muted and that you have a suitable device selected as the default input
device. The volume meter for each device can also be used to diagnose where
audio input is picked up. alsamixer can again be used as a cross-check for
extra knobs.

.. image:: _static/img/pavucontrol-input.png

.. image:: _static/img/alsamixer-input.png


Bluetooth devices
-----------------

In the A2DP profile, Bluetooth devices are unable to provide microphone
functionality. This requires use of HFP/HSP (Headset profile/Hands-free
profile, not High Fidelity Playback) instead.

.. image:: _static/img/pavucontrol-config.png

Depending on the capabilities and configurationof the operating system
software, the mode may be automatically switched from A2DP to HFP/HSP when
recording software tries to make use of microphone functionality.

Once the device is in HFP/HSP mode, it will show up under Input Devices. When
the device leaves HFP/HSP mode, pavucontrol does not automatically remove the
elements from the UI until a restart.

In HFP/HSP profiles, only two codecs are offered, both of which are
terrible choices: mSBC (16 kHz mono) and CVSDM (8 kHz mono).

Under PipeWire/PulseAudio, it is possible to make the browser and
other programs use different hardware devices for input and output.
By using the webcam microphone for input, a Bluetooth device can run
with the A2DP profile.


System audio (Android)
----------------------

The system settings offer multiple volume sliders.

* When applications *only* output audio/video, “Media volume” is used.
* When both output and input is requested however, “In-call volume” is used.
* There is at least one known case of an Android bug wherein *none* of the
  sliders have any effect when the output device is the built-in speaker.

.. image:: _static/img/android-sound1.png

Ensure that the application has permissions to camera and/or microphone.

.. image:: _static/img/android-sound2.png
.. image:: _static/img/android-sound3.png


Granting AV capture (Firefox)
-----------------------------

Depending on browser settings, pages may be blocked from asking for audio/video
captures. Go to the browser settings > “Privacy & Security” (left-hand-side) >
“Permissions” (heading in center pane) to investigate.

.. image:: _static/img/firefox-settings-perms.png

.. image:: _static/img/firefox-settings-camera.png

The “Block new requests” checkbox is what controls whether the Ask-vs.-Block
mechanic. When requests are blocked, the URL bar will not (in Firefox
116/Linux) include enough icons and/or knobs to selectively re-enable device
access for a page after the fact. Users are required to go back to settings and
switch from blocking to asking.

When requests are allowed, a popup is shown when a page requests device access:

.. image:: _static/img/firefox-access-ask.png

It does not matter which camera/microphone device you select (if you have more
than one). The dropdown seems to only exist as a reminder which devices you
have. The device selection can be made later in Meet anyway.

Subsequently, site settings can be adjusted by clicking on the
camera/microphone symbol in the URL bar. Importantly, there is a third setting
in Firefox, called *Autoplay*. The autoplay setting for a site is not part of
the previous permission confirmation dialog (because autoplay settings do not
have an “ask” state, just “block” or “allow”). Either way, Autoplay must be
allowed for Meet to function, so do click on the site settings icon(s) and make
sure all three things are allowed.

.. image:: _static/img/firefox-settings-cmurl.png


Granting AV capture (Chromium)
------------------------------

Depending on browser settings, pages may be blocked from asking for audio/video
captures. Go to the browser settings > “Privacy and security” > “Site settings”
to investigate.

.. image:: _static/img/chromium-settings-microphone.png

.. image:: _static/img/chromium-settings-camera.png

If all of these radio buttons are set to “Don't allow sites…”, the browser UI
will not show any dialog when permissions are requested by the page, and there
is a camera icon in the URL bar on the right hand side with a tiny red box and
white cross to indicate that everything is blocked.

.. image:: _static/img/chromium-access-block.png

If the page does not have all of the permissions it wanted, it may elect to
show a JavaScript-controlled visual element about the permission situation in
the document frame.

If any of the radio buttons in the settings are set to “Sites can ask…“, the
browser will show a small dialog. The device classes that will be presented for
approval in that dialog is the set of devices requested by the webpage minus
the set that is permanently banned through browser settings. In other words,
the dialog may show any of three outcomes: Only the “Use your microphone”
label, only the “Use your camera” label, or both labels.

.. image:: _static/img/chromium-access-ask.png

If any permissions were granted, the icon in the URI bar switches to the
most-significant permitted device class (microphone, camera, in that order).
That icon can then be used to call up a mini dialog to enable/disable the set
of previously granted permissions. In other words, this
dialog may show any of three outcomes: “Camera allowed/blocked” *or*
“Microphone allowed/blocked” *or* “Camera and microphone allowd/blocked”.

.. image:: _static/img/chromium-settings-cmurl.png

.. image:: _static/img/chromium-settings-cmurl2.png

With this dialog, the permissions can only be changed as a whole. To
individually reconfigure microphone or camera for the webpage, go back to the
browser's settings area. Also of note is that the minidialog does not permit
changing the device (the dropdown box does not react to anything in Chromium
115).


Granting AV capture (Android/Chrome)
------------------------------------

Troubleshoot as described in the previous section about Chromium.

On Android, the browser has a *third* category of site-specific settings
besides “Camera” and “Microphone”, namely “Sound”, that you need to check as
well.

.. image:: _static/img/android-sound4.png
.. image:: _static/img/android-sound5.png

The popups for device access and site settings when tapping on the URL bar icon
look similar to Chromium:

.. image:: _static/img/chromeandr-access-ask.png
.. image:: _static/img/chromeandr-settings-cmurl.png


Camera device information (Linux)
---------------------------------

The ``v4l2-ctl`` command-line utility can be used for a deeper technical view
of available devices from the Video4Linux API. Our example system here has
four V4L devices, which are: color capture, metadata channel, infrared capture,
metadata channel.

.. code-block:: text

	# ls /dev/video*
	/dev/video0  /dev/video1  /dev/video2  /dev/video3

	# v4l2-ctl -d /dev/video0 --all
	Driver Info:
		Driver name      : uvcvideo
		Card type        : FJ Camera: FJ Camera
		Bus info         : usb-0000:00:14.0-7
	…
	Video input : 0 (Camera 1: ok)
	Format Video Capture:
		Width/Height      : 640/480
		Pixel Format      : 'YUYV' (YUYV 4:2:2)
		Field             : None
		Bytes per Line    : 1280
		Size Image        : 614400
		Colorspace        : sRGB
		Transfer Function : Rec. 709
		YCbCr/HSV Encoding: ITU-R 601
	…
		Frames per second: 30.000 (30/1)
	…

	# v4l2-ctl -d /dev/video1 --all
	…
	Format Metadata Capture:
		Sample Format   : 'UVCH' (UVC Payload Header Metadata)
		Buffer Size     : 10240

	# v4l2-ctl -d /dev/video2 --all
	Format Video Capture:
		Width/Height      : 640/360
		Pixel Format      : 'GREY' (8-bit Greyscale)
		Field             : None
		Bytes per Line    : 640
		Size Image        : 230400
		Colorspace        : sRGB
		Transfer Function : Rec. 709
		YCbCr/HSV Encoding: ITU-R 601
		Quantization      : Default (maps to Full Range)
	…
		Frames per second: 30.000 (30/1)
	…

	# v4l2-ctl -d /dev/video3 --all
	…
	Format Metadata Capture:
		Sample Format   : 'UVCH' (UVC Payload Header Metadata)


Capture device selection (Firefox)
----------------------------------

Certain hardware may offer multiple capture modes and present them as
independent or partially-independent selectable devices.

Of the four V4L devices our example system has, two produce images, and Firefox
considers both the YUYV and the GREY output usable (and offers them through
Javascript APIs to Meet). However, selecting the infrared camera with its
monochrome output does not work without any explanation or error message, and
selection always reverts back to the color device.


Capture device selection (Chromium)
-----------------------------------

You can configure this in Settings > “Privacy” > “Site settings” >

.. image:: _static/img/chromium-settings-microphone.png

.. image:: _static/img/chromium-settings-camera.png

The dropdown for camera and microphone in the settings will *only* be visible
when at least one webpage has already tried to exercise the audio/video API.
Otherwise that dropdown box does not exist (in Chromium 115/Linux).

Of the four V4L devices our example system has, Chromium considers only the
YUYV device selectable. Here too, the infrared camera was unusable.


Capture device selection (Meet)
-------------------------------

Device selection can be made from the Meet interface settings.

.. image:: _static/img/meet-settings.png
