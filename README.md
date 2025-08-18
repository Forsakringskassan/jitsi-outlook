# **Jitsi Outlook add-in**

[![jitsi outlook workflow](https://github.com/Forsakringskassan/jitsi-outlook/actions/workflows/workflow.yml/badge.svg)](https://github.com/Forsakringskassan/jitsi-outlook/actions/workflows/workflow.yml)
[![Standard commitment](https://github.com/publiccodenet/standard/blob/develop/assets/standard-for-public-code-commitment.svg)](https://github.com/Forsakringskassan/jitsi-outlook/blob/main/CONTRIBUTING.adoc#standard-for-public-code)
[![REUSE status](https://api.reuse.software/badge/github.com/Forsakringskassan/jitsi-outlook)](https://api.reuse.software/info/github.com/Forsakringskassan/jitsi-outlook)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/Forsakringskassan/jitsi-outlook/badge)](https://scorecard.dev/viewer/?uri=github.com/Forsakringskassan/jitsi-outlook)


The purpose of this plug-in is to simplify the process of adding video conference links to meeting bookings. It is designed for users who value and require simplicity to complete their tasks quickly and intuitively. Therefore, it is important to preserve this simplicity as new features are added. Any additional contributions to the software must be designed in a way that does not interfere with or complicate the core functionality of booking a regular meeting with just one click.

The plugin randomly generates a Jitsi link to an appointment (while in the appointment creation window). It was built based on the Yeoman generator, as described in the this [guide](https://learn.microsoft.com/en-us/office/dev/add-ins/quickstarts/outlook-quickstart?tabs=yeomangenerator).

![Photo: Jitsi Outlook plugin example / HaV / CC0](screenshot.png)

<figcaption>Jitsi Outlook plugin example / HaV / CC0</figcaption>

---

## Table of Contents

- [Installation and Requirements](#installation-and-requirements)
- [Known Issues](#known-issues)
- [Contributing](#contributing)
- [Development](#development)
- [Additional config](#additional-config)
- [License](#license)
- [Maintainers](#maintainers)

## Installation and Requirements

### **Publishing the add-in**

See [Development](#development) for how you can run and test the project locally.

This project does not provide a hosting or publishing recommendation, that is entirely up to the individual(s) using it. Microsoft provides a comprehensive publishing guide and provides different options in the following [link](https://learn.microsoft.com/en-us/office/dev/add-ins/publish/publish).

### **Supported Outlook Versions**

The add-in works on the following Outlook versions:

- Outlook 2016 or later, on Windows
- Outlook 2016 or later, on Mac
- Outlook on the Web
- Outlook on Windows (Microsoft 365)
- Outlook on Mac (Microsoft 365)

\*This add-in does not work in the mobile app.

## Known issues

This project is a stripped down version with basic functionality. There are ideas and possible plans for the future.

## Contributing

Please see the [CONTRIBUTING](CONTRIBUTING.adoc) guide.

## Development

### **Installing the add-in on your Outlook**

For development, The add-in needs to be added to the relevant Outlook environment. The methods to do this are described in this section.

### **Adding the add-in to the Outlook taskbar**

The `manifest.xml` can be added as an add-in manually, through Outlooks add-in portal:

1. Open Outlook
2. Click the "..." button on the toolbar
3. Select "Get Add-ins"
4. Click on the "My add-ins" alternative on the left side menu
5. Click on the "Add a custom add-in" dropdown in the bottom section
6. Select the relevant alternative for where your manifest file is stored
7. Add the `manifest.xml` file and let it validate and load

When it has finished loading the add-in should be visible in the toolbar whenever you have the event organizer window open. I.e. when you are trying to organize and invite people to meeting.

### **Running the development server locally**

You can run and test the add-in code by running the following npm command:

```
npm run dev-server
```

This will start the local development server on port 3000. If the aforementioned `manifest.xml` variables have been set to your local machine you will be able to run the add-in locally.

## **Configuration**

This section describes how the add-in should and can be configured.

### `buildSettings.json`

This file contains the only mandatory settings for the creation of the manifest file. All dev settings will be used when running `npm run build-dev` and produce a dist folder for that `devVersion`. The webpack will produce as many manifests there is in the `/manifests` folder.

| **Property** | **Type** | **Description** |
| --- | --- | --- |
| TEST |
| `devUrlRemotePluginServer` | string | Url to a test environment where the plugin is hosted |
| `devBaseUrl` | string | Base url to test environment |
| `devAppId` | string | Marketstore ID for the plugin, deadbeef id used for test |
| `devVersion` | string | Version number used for test development |
| `devDisplayName` | string | Displayname used on add-in page for development plugin |
| PROD |
| `prodUrlPlugin` | string | Url to a production environment where the plugin is hosted |
| `prodBaseUrl` | string | Base url to production environment |
| `prodAppId` | string | Marketstore ID for the plugin |
| `prodDisplayName` | string | Displayname used on add-in page for production plugin |
| `version` | string | Version number used for test production |
| COMMON |
| `providerName` | string | Organization name or delivery product |
| `supportUrl` | string | Url to a support site for the consumers |

So for building and testing the plugin you need to enter at least the information above.

### `config.json`

The `config.json` file in the config folder will determine how the default meeting should look like. The following is an example of how the configuration file could look like:

```
{
    "baseUrl": "https://my-jitsi-instance-url"
}
```

All of the properties listed in [Additional config](#additional-config) can also be added to enable/disable any extra features.

> Note that configuration is entirely optional and that Jitsi's default configuration will be used as a default if no configuration file is found in the project. The add-in will default to https://meet.jit.si if no configuration file is found.

### `manifest.xml`

The `manifest.xml` file found in the manifests directory is the core of the add-in. This file contains the specification, points of entry, used methods and assets that the add-in should use. It is through this file that Outlook knows where to find the relevant assets in the project. In order to run this add-in you will need to add some urls that are specific for your use case, these places in the file are highlighted with three variables as shown below:

- `PROVIDER_NAME`: The name of the company providing the add-in (could be your company).
- `PROJECT_BASE_URL`: Url pointing to where your add-in app is hosted.
- `SUPPORT_URL`: Support url to the add-in admin.

> Note! The above variables are now configured in the buildSettings.json file, see [buildSettings](#buildsettingsjson).

The manifests folder works the same way as the configs folder does. Each manifest is created in a folder following the name except `.json`. So manifest `manifests/controll.test.xml` will be created as `dist/<version>/manifests/controll.test/manifest.xml`

## **Installation and building**

Thereafter, all the dependencies need to be installed:

```bash
# run installation to download all dependencies
npm install

# make sure all your configuration are done then run
npm run build
# or for development
npm run build-dev

# Other useful commands for testing and linting
npm run test

npm run lint

npm run prettier

# Testing of config and manifest file
npm run test-config config="path" index"index" lang="language code"

npm run validate "path to manifest file"
# Make sure to run these 3 before contributing code!
```

---

## **Additional config**

### **Comprehensive configuration guide**

#### Description of Config objects

| **Property**            | **Type**          | **Description**                                                             |
| ----------------------- | ----------------- | --------------------------------------------------------------------------- |
| `baseUrl`               | string            | Base url to your Jitsi instance.                                            |
| `currentLanguage`       | string            | Will be set by plugin, do not set this value                                |
| `locationString`        | object(localized) | This text is added to the Location field of the meeting                     |
| `globalAdditionalLinks` | AdditionalLinks[] | See additional links [table](#description-of-additionalinks-objects)        |
| `globalAdditionalTexts` | AdditionalTexts[] | See additional texts [table](#description-of-additionatexts-objects)        |
| `meetings`              | Meeting[]         | See meeting object [table](#description-of-meeting-objects)                 |
| `fontFamily`            | string            | The font family used for for the signature text (defaulting to Arial)       |
| `fontSize`              | string            | Html element font size, this is a global font size (default to 20px)        |
| `fontColor`             | string            | Html element font color, this is a global font color (default to #000000) |
| `useDiv`                | boolean           | Use dividers for footer or not                                              |
| `divColor`              | string            | Set a div color for the first divider (default to #ffffff)                |
| `useGraphics`           | boolean           | Use the camera image provided or not                                        |
| `userGraphics`          | string            | Src for the <img> html tag                                                  |

#### Description of Meeting objects

| **Property**       | **Type**          | **Description**                                                      |
| ------------------ | ----------------- | -------------------------------------------------------------------- |
| `type`             | string            | This text must match a type from config.json at build time!          |
| `additionalConfig` | object            | This object is a key pair list of link settings, see [this](https://jitsi.github.io/handbook/docs/user-guide/user-guide-advanced/) |
| `meetingPrefix`    | string            | A prefix to the meeting link, eg url/prefix_meetingname#options      |
| `meetingSuffix`    | string            | A suffix to the meeting link, eg url/meetingname_suffix#options      |
| `meetingHeader`    | object(localized) | A header for the link footer, this will use global font settings     |
| `additionalLinks`  | AdditionalLinks[] | See additional links [table](#description-of-additionalinks-objects) |
| `additionalTexts`  | AdditionalTexts[] | See additional texts [table](#description-of-additionatexts-objects) |

#### Description of AdditionaLinks objects

| **Property** | **Type**          | **Description**                             |
| ------------ | ----------------- | ------------------------------------------- |
| `fontSize`   | string            | Html element font size                      |
| `fontFamily` | string            | The font family used for for the link text  |
| `fontColor`  | string            | Html element font color                     |
| `text`       | object(localized) | The links text                              |
| `config`     | object            | The config that should be set, see [this](https://jitsi.github.io/handbook/docs/user-guide/user-guide-advanced/) |

#### Description of AdditionaTexts objects

| **Property** | **Type** | **Description**                             |
| ------------ | -------- | ------------------------------------------- |
| `fontSize`   | string   | Html element font size                      |
| `fontFamily` | string   | The font family used for for the link text  |
| `fontColor`  | string   | Html element font color                     |
| `texts`      | Text[]   | See text [table](#description-of-text)      |

#### Description of Text

| **Property** | **Type**          | **Description**                             |
| ------------ | ----------------- | ------------------------------------------- |
| `addNewLine` | boolean           | Add a new line after text  OBS! Mandatory   |
| `text`       | object(localized) | The text to add            OBS! Mandatory   |
| `url`        | object(localized) | If the text should link to website          |

#### Description of object(localized)
These objects should be configured following this standard:
```
{
  "en": "English text",
  "it": "Italian text",
  "default": "Mandatory!!"
}
Where the key is short for the language returned by Office.context.displayLanguage.
The default key is mandatory!
```
---
#### Example of advanced configuration
```
{
  "baseUrl": "https://meet.jit.si",
  "locationString": {"default": "Jitsi videomöte"},
  "fontFamily": "Segoe UI",
  "fontSize": "20px",
  "useDiv": true,
  "divColor": "#0d85c7",
  "globalAdditionalLinks": [
    {
      "fontSize": "12px",
      "fontFamily": "Segoe UI",
      "fontColor": "#0d85c7",
      "text": {"default": "Endast skärmdelning"},
      "config": {
        "startWithAudioMuted": true,
        "startWithVideoMuted": true,
        "disableInitialGUM": true,
        "faceLandmarks.enableFaceCentering": false,
        "disableTileEnlargement": true,
        "notifications": "[]",
        "toolbarButtons": "[%22desktop%22,%22sharedvideo%22,%22shareaudio%22,%22hangup%22]",
        "startSilent": true
      }
    }
  ],
  "globalAdditionalTexts": [
    {
      "fontSize": "12px",
      "fontFamily": "Segoe UI",
      "fontColor": "#0d85c7",
      "texts": [
        {
          "addNewLine": true,
          "text": {"default": "Användarhandledning"},
          "url": {"default": "https://google.com"}
        },
        {
          "addNewLine": true,
          "text": {"default": "Så här hanteras dina personuppgifter"},
          "url": {"default": "https://google.com"}
        }
      ]
    }
  ],
  "meetings": [
    {
      "type": "StandardMeeting",
      "meetingPrefix": "comp_",
      "additionalConfig": {
        "startWithAudioMuted": true,
        "startWithVideoMuted": true
      },
      "meetingHeader": {"default": "Jitsi videomöte"}
    }
  ]
}
```
This config will produce the following footer:

<div id="x_jitsi-link"><br>
<hr style="color:#0d85c7; border-color:#0d85c7">
<div style="font-size:20px; font-weight:700; font-family:'Segoe UI'">Jitsi videomöte</div>
<div style="padding-right:10px; vertical-align:middle; background-color:transparent">
<span style="font-size:20px; font-family:'Segoe UI'; color:#000000"><a title="Länk till mötet" href="https://meet.jit.si/comp_v9nkew5kn6wek8xn#config.startWithAudioMuted=true&amp;config.startWithVideoMuted=true" style="text-decoration:none">
<span style="font-size:20px; font-family:'Segoe UI'">→ </span>Anslut till mötet </a>
<br>
</span>
<div><br>
<span style="font-size:12px; font-family:'Segoe UI'; color:#0d85c7"><a title="Endast skärmdelning" href="https://meet.jit.si/comp_v9nkew5kn6wek8xn#config.startWithAudioMuted=true&amp;config.startWithVideoMuted=true&amp;config.disableInitialGUM=true&amp;config.faceLandmarks.enableFaceCentering=false&amp;config.disableTileEnlargement=true&amp;config.notifications=[]&amp;config.toolbarButtons=[%22desktop%22,%22sharedvideo%22,%22shareaudio%22,%22hangup%22]&amp;config.startSilent=true" style="text-decoration:none">Endast
 skärmdelning </a></span><br>
<span style="font-size:12px; font-family:'Segoe UI'; color:#0d85c7"><a title="Användarhandledning" href="https://google.com" style="text-decoration:none">Användarhandledning
</a><br>
<a title="Så här hanteras dina personuppgifter" href="https://google.com" style="text-decoration:none">Så här hanteras dina personuppgifter
</a><br>
</span><br>
<hr>
<div></div>
</div>
</div>
</div>

```html
<div id="x_jitsi-link"><br>
<hr style="color:#0d85c7; border-color:#0d85c7">
<div style="font-size:20px; font-weight:700; font-family:'Segoe UI'">Jitsi videomöte</div>
<div style="padding-right:10px; vertical-align:middle; background-color:transparent">
<span style="font-size:20px; font-family:'Segoe UI'; color:#000000"><a title="Länk till mötet" href="https://meet.jit.si/comp_v9nkew5kn6wek8xn#config.startWithAudioMuted=true&amp;config.startWithVideoMuted=true" style="text-decoration:none">
<span style="font-size:20px; font-family:'Segoe UI'">→ </span>Anslut till mötet </a>
<br>
</span>
<div><br>
<span style="font-size:12px; font-family:'Segoe UI'; color:#0d85c7"><a title="Endast skärmdelning" href="https://meet.jit.si/comp_v9nkew5kn6wek8xn#config.startWithAudioMuted=true&amp;config.startWithVideoMuted=true&amp;config.disableInitialGUM=true&amp;config.faceLandmarks.enableFaceCentering=false&amp;config.disableTileEnlargement=true&amp;config.notifications=[]&amp;config.toolbarButtons=[%22desktop%22,%22sharedvideo%22,%22shareaudio%22,%22hangup%22]&amp;config.startSilent=true" style="text-decoration:none">Endast
 skärmdelning </a></span><br>
<span style="font-size:12px; font-family:'Segoe UI'; color:#0d85c7"><a title="Användarhandledning" href="https://google.com" style="text-decoration:none">Användarhandledning
</a><br>
<a title="Så här hanteras dina personuppgifter" href="https://google.com" style="text-decoration:none">Så här hanteras dina personuppgifter
</a><br>
</span><br>
<hr>
<div></div>
</div>
</div>
</div>
```
---
### **Sub-domain configurations**

The add-in can be configured through the use of a configuration file (named `<sub-domain>.json`), that should be placed in the configs directory, these are then built and used per sub-domain. E.g. if you have an email domain on controll.test the file should be stored as, `/configs/controll.test.json`, this will produce a file in the dist for that sub-domain. It expects the same json object as the default.

To utilize this feature you have to specify the configuration setup in the `buildSettings.json`.

### **`src/commands/config.json`**

The `src/commands/config.json` file contains which meeting types should be added to html file and command.js. The list added here should correspond to a list in the `manifest.xml` as well. So if more than one link is present in this file then the manifest must be updated to a action list instead of a button, see `manifest-list.xml` as an example.

| **Property**               | **Type** | **Description**                                                                   |
| -------------------------- | -------- | --------------------------------------------------------------------------------- |
| `configUrl`                | string   | The direct uri to fetch configuration from                                        |
| `meetingLinks`             | list     | This contains the list with the below values                                      |
| `meetingLinks.associate`   | string   | The associated link name from `manifest.xml` file                                 |
| `meetingLinks.meetingName` | string   | The type meeting config related to this meeting link in `config.json`             |

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details

---

## Maintainers

SAFOS
