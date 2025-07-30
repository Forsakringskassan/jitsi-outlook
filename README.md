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

## **Installing the add-in on your Outlook**

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
| `devUrlRemoteConfigServer` | string | Url to a test environment where the configuration is hosted |
| `devBaseUrl` | string | Base url to test environment |
| `devAppId` | string | Marketstore ID for the plugin, deadbeef id used for test |
| `devVersion` | string | Version number used for test development |
| `devDisplayName` | string | Displayname used on add-in page for development plugin |
| PROD |
| `prodUrlPlugin` | string | Url to a production environment where the plugin is hosted |
| `prodUrlConfig` | string | Url to a production environment where the configuration is hosted |
| `prodBaseUrl` | string | Base url to production environment |
| `prodAppId` | string | Marketstore ID for the plugin |
| `prodDisplayName` | string | Displayname used on add-in page for production plugin |
| `version` | string | Version number used for test production |
| COMMON |
| `providerName` | string | Organization name or delivery product |
| `supportUrl` | string | Url to a support site for the consumers |

So for building and testing the plugin you need to enter at least the information above.

### `config.json`

The `config.json` file in the root folder will determine how the default meeting should look like. The following is an example of how the configuration file could look like:

```
{
    "baseUrl": "https://my-jitsi-instance-url",
    "additionalText": "Some additional text beneath the signature"
}
```

All of the properties listed below can also be added to enable/disable any extra features.

| **Property**          | **Type** | **Description**                                                                   |
| --------------------- | -------- | --------------------------------------------------------------------------------- |
| `baseUrl`             | string   | Base url to your Jitsi instance.                                                  |
| `locationString`      | string   | This text is added to the Location field of the meeting.                          |
| `additionalText`      | string   | This text will show up at the bottom of the email signature.                      |
| `fontFamily`          | string   | The font family used for for the signature text (defaulting to Arial)             |
| `meetings`            | list     | A list of meetings containing different settings per type                         |

Description of meeting objects

| **Property**          | **Type** | **Description**                                                                   |
| --------------------- | -------- | --------------------------------------------------------------------------------- |
| `startWithAudioMuted` | boolean  | This forces the mic to be muted for every person entering the meeting.            |
| `startWithVideoMuted` | boolean  | This forces the camera to be disabled for every person entering the meeting.      |
| `disableInitialGUM`   | boolean  | Skips the initial permission check and configuration screen (GUM = getUserMedia). |

> Note that configuration is entirely optional and that Jitsi's default configuration will be used as a default if no configuration file is found in the project. The add-in will default to https://meet.jit.si if no configuration file is found.

Please see [Additional config](#additional-config) for more settings and alternatives!

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

# Make sure to run these 3 before contributing code!
```

---

## **Additional config**

### Sub-domain configurations

The add-in can be configured through the use of a configuration file (named `<sub-domain>.json`), that should be placed in the configs directory, these are then built and used per sub-domain. E.g. if you have an email domain on controll.test the file should be stored as, `/configs/controll.test.json`, this will produce a file in the dist for that sub-domain. It expects the same json object as the default.

To utilize this feature you have to specify the configuration setup in the `buildSettings.json`.

### `src/commands/config.json`

The `src/commands/config.json` file contains which meeting types should be added to html file and command.js. The list added here should correspond to a list in the `manifest.xml` as well. So if more than one link is present in this file then the manifest must be updated to a action list instead of a button, see `manifest-list.xml` as an example.

| **Property**               | **Type** | **Description**                                                                   |
| -------------------------- | -------- | --------------------------------------------------------------------------------- |
| `meetingLinks`             | list     | This contains the list with the below values                                      |
| `meetingLinks.associate`   | string   | The associated link name from `manifest.xml` file                                 |
| `meetingLinks.meetingName` | string   | The type meeting config related to this meeting link in `config.json`             |

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details

---

## Maintainers

SAFOS
